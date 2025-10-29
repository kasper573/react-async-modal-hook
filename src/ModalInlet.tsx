import {
  ComponentProps,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { AnyModalComponent, ModalProps } from "./ModalStore";
import { ModalContext } from "./ModalContext";
import { ModalPortal } from "./ModalPortal";

export interface ModalInletInternalProps<Component extends AnyModalComponent> {
  component: Component;
}

export type ModalInletProps<Component extends AnyModalComponent> =
  ModalInletInternalProps<Component> &
    Omit<ComponentProps<Component>, keyof ModalProps<unknown>>;

export function ModalInlet<Component extends AnyModalComponent>({
  component: Component,
  ...defaultProps
}: ModalInletProps<Component>) {
  const store = useContext(ModalContext);
  const instances = useSyncExternalStore(
    store.subscribe,
    () => store.state.instances.get(Component),
    () => store.state.instances.get(Component),
  );

  useEffect(() => () => store.unmount(Component), []);

  return (
    <ModalPortal>
      {instances
        ?.entries()
        .map(([instanceId, { visible, props }]) => (
          <Component
            key={instanceId}
            instanceId={instanceId}
            open={visible}
            resolve={(value) => store.resolve(Component, instanceId, value)}
            {...(defaultProps as any)}
            {...props}
          />
        ))}
    </ModalPortal>
  );
}
