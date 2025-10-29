import { useContext, useSyncExternalStore } from "react";
import { AnyModalComponent, ModalProps } from "./ModalStore";
import { ModalContext } from "./ModalContext";
import { ModalPortal } from "./ModalPortal";

// We don't bother with generics here since this component is only used internally.
// (Generics would only improve the dx for using the component directly outside the library)
export interface ModalInletProps {
  component: AnyModalComponent;
  defaultProps?: DefaultModalProps<ModalProps<any>>;
}

/**
 * The modal inlet is what puts the modal element into the react tree.
 * It should always be rendered where you call useModal.
 * This pattern ensures that your modal component has access to context.
 *
 * Visibility and portalling to the ModalOutlet is handeled internally,
 * so you should always render it unconditionally.
 */
export function ModalInlet({
  component: Component,
  defaultProps,
}: ModalInletProps) {
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
            {...defaultProps}
            {...props}
          />
        ),
      )}
    </ModalPortal>
  );
}

export type ExcessModalProps<Props extends ModalProps<any>> = Omit<
  Props,
  keyof ModalProps<unknown>
>;

export type DefaultModalProps<Props extends ModalProps<any>> = Partial<
  ExcessModalProps<Props>
>;
