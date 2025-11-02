import { ComponentType } from "react";
import { deferPromise, DeferredPromise } from "./deferPromise";

export class ModalStore {
  private sustainers = new Map<InstanceId, Promise<void>>();
  private listeners = new Set<ModalStoreListener>();

  #state: ModalStoreState = {
    instances: new Map(),
  };

  subscribe = (listener: ModalStoreListener): StoreUnsubscriber => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
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

  setSustainer(instanceId: InstanceId, promise?: Promise<void>) {
    if (promise) {
      this.sustainers.set(instanceId, promise);
    } else {
      this.sustainers.delete(instanceId);
    }
  }

  unmount(component: AnyModalComponent) {
    const componentInstances = this.#state.instances.get(component);
    if (!componentInstances) {
      return;
    }

    for (const { deferredPromise } of componentInstances.values()) {
      if (!deferredPromise.isResolved) {
        deferredPromise.reject(new Error("Modal unmounted before resolution"));
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

    await this.sustainers.get(instanceId);

    this.#state.instances.get(component)?.delete(instanceId);
    this.notifyListeners();
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

    const deferredPromise = deferPromise((promise) =>
      promise.then(async (resolution) => {
        await this.removeInstance(component, instanceId);
        return resolution;
      }),
    );

    componentInstances.set(instanceId, {
      open: false,
      deferredPromise,
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

    return deferredPromise.promise as Promise<Resolution>;
  }

  resolve<Resolution>(
    component: AnyModalComponent,
    instanceId: InstanceId,
    value: Resolution,
  ): void {
    const instance = this.#state.instances.get(component)?.get(instanceId);
    if (instance && !instance.deferredPromise.isResolved) {
      instance.deferredPromise.resolve(value);
    }
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private _idCounter = 0;

  nextId(): InstanceId {
    return (this._idCounter++).toString();
  }
}

export interface ModalStoreState {
  readonly instances: Map<AnyModalComponent, Map<InstanceId, ModalInstance>>;
  outlet?: HTMLElement;
}

export interface ModalInstance {
  open: boolean;
  readonly propsGivenViaSpawnInvocation: Readonly<Record<string, unknown>>;
  readonly deferredPromise: DeferredPromise<unknown>;
}

export type InstanceId = string;

export type StoreUnsubscriber = () => void;

export type ModalStoreListener = () => void;

export type AnyModalComponent = ComponentType<ModalProps<any>>;

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
