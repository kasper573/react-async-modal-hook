import { ComponentType } from "react";
import { deferPromise, DeferredPromise } from "./deferPromise";
import { produce } from "immer";

export class ModalStore {
  private sustainers = new Map<InstanceId, Promise<void>>();
  private listeners = new Set<ModalStoreListener>();

  #state: ModalStoreState = {
    instances: new Map(),
  };

  get state(): ModalStoreState {
    return this.#state;
  }

  subscribe = (listener: ModalStoreListener): StoreUnsubscriber => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private mutate<Return>(mutateFn: (state: ModalStoreState) => Return): Return {
    let ret: Return;
    this.#state = produce(this.#state, (draft) => {
      ret = mutateFn(draft);
    });
    for (const listener of this.listeners) {
      listener(this.#state);
    }
    return ret!;
  }

  setOutlet(newOutlet: HTMLElement | undefined) {
    this.mutate((draft) => {
      draft.outlet = newOutlet;
    });
  }

  setSustainer(instanceId: InstanceId, promise?: Promise<void>) {
    if (promise) {
      this.sustainers.set(instanceId, promise);
    } else {
      this.sustainers.delete(instanceId);
    }
  }

  unmount(component: AnyModalComponent) {
    this.mutate((draft) => {
      const componentInstances = draft.instances.get(component);
      if (!componentInstances) {
        return;
      }

      for (const { deferredPromise } of componentInstances.values()) {
        if (!deferredPromise.isResolved) {
          deferredPromise.reject(
            new Error("Modal unmounted before resolution"),
          );
        }
      }

      draft.instances.delete(component);
    });
  }

  private async removeInstance(
    component: AnyModalComponent,
    instanceId: InstanceId,
  ) {
    this.mutate((draft) => {
      const instance = draft.instances.get(component)?.get(instanceId);
      if (instance) {
        instance.visible = false;
      }
    });

    await this.sustainers.get(instanceId);

    this.mutate((draft) => {
      draft.instances.get(component)?.delete(instanceId);
    });
  }

  spawn<Resolution>(
    component: AnyModalComponent,
    props: ModalInstance["props"] = {},
  ): Promise<Resolution> {
    return this.mutate((draft) => {
      let componentInstances = draft.instances.get(component);
      if (!componentInstances) {
        componentInstances = new Map();
        draft.instances.set(component, componentInstances);
      }

      const instanceId = this.nextId();

      const deferredPromise = deferPromise((promise) =>
        promise.then(async (resolution) => {
          await this.removeInstance(component, instanceId);
          return resolution;
        }),
      );

      componentInstances.set(instanceId, {
        visible: true,
        deferredPromise,
        props,
      });

      return deferredPromise.promise as Promise<Resolution>;
    });
  }

  resolve<Resolution>(
    component: AnyModalComponent,
    instanceId: InstanceId,
    value: Resolution,
  ): void {
    this.mutate((draft) => {
      const instance = draft.instances.get(component)?.get(instanceId);
      if (instance && !instance.deferredPromise.isResolved) {
        instance.deferredPromise.resolve(value);
      }
    });
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
  visible: boolean;
  props: Record<string, unknown>;
  readonly deferredPromise: DeferredPromise<unknown>;
}

export type InstanceId = string;

export type StoreUnsubscriber = () => void;

export type ModalStoreListener = (state: ModalStoreState) => void;

export type AnyModalComponent = ComponentType<ModalProps<any>>;

/**
 * The props that any component that wants to be compatible with useModal must accept.
 */
export interface ModalProps<Resolution = void> {
  instanceId: InstanceId;
  open: boolean;
  resolve: (value: Resolution) => unknown;
}
