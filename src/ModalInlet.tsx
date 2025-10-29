import { useContext, useSyncExternalStore } from "react";
import { AnyModalComponent } from "./ModalStore";
import { ModalContext } from "./ModalContext";
import { ModalPortal } from "./ModalPortal";

export interface ModalInletProps<Component extends AnyModalComponent> {
  component: Component;
  defaultProps?: Partial<React.ComponentProps<Component>>;
}

/**
 * The modal inlet is what puts the modal element into the react tree.
 * It should always be rendered where you call useModal.
 * This pattern ensures that your modal component has access to context.
 *
 * Visibility and portalling to the ModalOutlet is handeled internally,
 * so you should always render it unconditionally.
 */
export function ModalInlet<Component extends AnyModalComponent>({
  component: Component,
  defaultProps,
}: ModalInletProps<Component>) {
  const store = useContext(ModalContext);
  const instances = useSyncExternalStore(
    store.subscribe,
    () => store.state.instances.get(Component),
    () => store.state.instances.get(Component),
  );

  return (
    <ModalPortal>
      {[...(instances?.entries() ?? [])].map(
        ([instanceId, { visible, props }]) => (
          <Component
            key={instanceId}
            instanceId={instanceId}
            open={visible}
            resolve={(value) => store.resolve(Component, instanceId, value)}
            {...(defaultProps as any)}
            {...props}
          />
        ),
      )}
    </ModalPortal>
  );
}

// export type ModalInletProps<Component extends AnyModalComponent> =
//   ModalInletInternalProps<Component> &
//     Omit<ComponentProps<Component>, keyof ModalProps<unknown>>;
