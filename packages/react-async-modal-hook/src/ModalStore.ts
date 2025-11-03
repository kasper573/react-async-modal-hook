import type { ComponentType } from "react";
import type { DeferredPromise } from "./deferPromise";
import { deferPromise } from "./deferPromise";

export class ModalStore {
  #listeners = new Set<ModalStoreListener>();
  #state: ModalStoreState = {
    instances: new Map(),
  };

  subscribe = (listener: ModalStoreListener): StoreUnsubscriber => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  instancesFor(
    component: AnyModalComponent,
  ): ReadonlyMap<InstanceId, ModalInstance> {
    // Returning a new instance to avoid accidental mutation of internal state.
    // Also ensures usage with useState/useSyncExternalStore works correctly.
    return new Map(this.#state.instances.get(component));
  }

  getOutlet = () => this.#state.outlet;

  setOutlet(newOutlet: HTMLElement | undefined) {
    this.#state.outlet = newOutlet;
    this.notifyListeners();
  }

  setSustainer(instanceId: InstanceId, sustainer?: DeferredPromise<void>) {
    let instance: ModalInstance | undefined;
    for (const instancesMap of this.#state.instances.values()) {
      instance = instancesMap.get(instanceId);
      if (instance) {
        break;
      }
    }

    // Ignore irrelevant changes
    if (!instance || sustainer === instance.sustainer) {
      return;
    }

    // Graceful error handling for unmount edge cases.
    // ie. when forgetting to resolve a sustainer before unmount
    // Note that the replace error should be practically impossible, but we handle it just in case.
    if (instance.sustainer?.isPending) {
      instance.sustainer.reject(
        new Error(
          sustainer
            ? "Sustainer replaced while previous sustainer was still pending"
            : "Sustainer removed while pending, likely due to nested modal unmounting.",
        ),
      );
    }

    instance.sustainer = sustainer;

    // Note: no need to notify listeners since nothing reacts to sustainer changes.
    // It is only used internally in the promise chain
  }

  unmount(component: AnyModalComponent) {
    const componentInstances = this.#state.instances.get(component);
    if (!componentInstances) {
      return;
    }

    for (const { result: value, sustainer } of componentInstances.values()) {
      if (value.isPending) {
        value.reject(new Error("Modal unmounted before resolution"));
      }
      if (sustainer?.isPending) {
        sustainer.reject(new Error("Modal unmounted before resolution"));
      }
    }

    this.#state.instances.delete(component);
    this.notifyListeners();
  }

  private async removeInstance(
    component: AnyModalComponent,
    instanceId: InstanceId,
  ) {
    const instance = this.#state.instances.get(component)?.get(instanceId);
    if (instance) {
      instance.open = false;
      this.notifyListeners();
    }

    try {
      await instance?.sustainer?.promise;
    } finally {
      this.#state.instances.get(component)?.delete(instanceId);
      this.notifyListeners();
    }
  }

  async spawn<Resolution>(
    component: AnyModalComponent,
    props: ModalInstance["propsGivenViaSpawnInvocation"] = {},
  ): Promise<Resolution> {
    const instanceId = this.nextId();

    let componentInstances = this.#state.instances.get(component);
    if (!componentInstances) {
      componentInstances = new Map();
      this.#state.instances.set(component, componentInstances);
    }

    const result = deferPromise((promise) =>
      promise.then(async (resolution) => {
        await this.removeInstance(component, instanceId);
        return resolution;
      }),
    );

    componentInstances.set(instanceId, {
      open: false,
      result,
      propsGivenViaSpawnInvocation: props,
    });

    this.notifyListeners();

    // Wait to let the instance render as closed first.
    // This makes it drastically easier to do enter animations in css.
    await nextTick();

    const instance = this.#state.instances.get(component)?.get(instanceId);
    if (instance) {
      instance.open = true;
      this.notifyListeners();
    }

    return result.promise as Promise<Resolution>;
  }

  resolve<Resolution>(
    component: AnyModalComponent,
    instanceId: InstanceId,
    value: Resolution,
  ): void {
    const instance = this.#state.instances.get(component)?.get(instanceId);
    if (instance?.result.isPending) {
      instance.result.resolve(value);
    }
  }

  private notifyListeners() {
    for (const listener of this.#listeners) {
      listener();
    }
  }

  private _idCounter = 0;

  private nextId(): InstanceId {
    return this._idCounter++;
  }
}

/**
 * You are not supposed to be mutating this state outside of ModalStore.
 * Doing so may lead to unexpected behavior.
 *
 * @internal
 */
export interface ModalStoreState {
  readonly instances: Map<AnyModalComponent, Map<InstanceId, ModalInstance>>;
  outlet?: HTMLElement;
}

export interface ModalInstance {
  open: boolean;
  readonly propsGivenViaSpawnInvocation: Readonly<Record<string, unknown>>;
  readonly result: DeferredPromise<unknown>;
  sustainer?: DeferredPromise<void>;
}

export type InstanceId = number;

export type StoreUnsubscriber = () => void;

export type ModalStoreListener = () => void;

export type AnyModalComponent = ComponentType<AnyModalProps>;

// oxlint-disable-next-line no-explicit-any - This is only used for generic constraints, so it's fine
export type AnyModalProps = ModalProps<any>;

/**
 * The props that any component that wants to be compatible with useModal must accept.
 */
export interface ModalProps<Resolution = void> {
  open: boolean;
  resolve: (value: Resolution) => unknown;
}

function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
