import type { ComponentProps, ComponentType } from "react";
import { useCallback, useContext } from "react";
import { ModalContext } from "./ModalContext";
import { ModalInlet, ModalInletInternalProps } from "./ModalInlet";
import { AnyModalComponent, ModalProps, ModalResolution } from "./ModalStore";

export function useModal<Component extends AnyModalComponent>(
  component: Component,
): UseModalReturn<Component> {
  const store = useContext(ModalContext);
  const spawn = useCallback(
    (props?: ExcessModalProps<Component>) =>
      store.spawn<ModalResolution<Component>>(component, props),
    [store],
  );
  const Inlet = useCallback(
    (props: ExcessModalProps<Component>) => (
      <ModalInlet component={component as AnyModalComponent} {...props} />
    ),
    [component],
  );
  return [spawn, Inlet];
}

/**
 * Spawns a new modal instance and returns a promise that resolves
 * when the modal is closed and with the value output by the modal.
 */
export type ModalSpawner<Component extends AnyModalComponent> = (
  props?: ExcessModalProps<Component>,
) => Promise<ModalResolution<Component>>;

export type UseModalReturn<Component extends AnyModalComponent> = [
  spawn: ModalSpawner<Component>,
  /**
   * The modal inlet is what puts the modal element into the react tree.
   * It should always be rendered where you call useModal.
   * This pattern ensures that your modal component has access to context.
   * Visibility is handeled internally, so you should always render it unconditionally.
   * Portalling to the ModalOutlet is also handeled
   */
  Inlet: ComponentType<ExcessModalProps<Component>>,
];

export type ExcessModalProps<Component extends AnyModalComponent> = Omit<
  ComponentProps<Component>,
  keyof ModalInletInternalProps<AnyModalComponent> | keyof ModalProps<unknown>
>;
