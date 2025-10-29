import type { ComponentProps, ReactElement } from "react";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { ModalContext } from "./ModalContext";
import { ModalInlet } from "./ModalInlet";
import { AnyModalComponent, ModalProps, ModalResolution } from "./ModalStore";

export function useModal<Component extends AnyModalComponent>(
  component: Component,
  defaultProps?: Partial<ComponentProps<Component>>,
): UseModalReturn<Component> {
  const store = useContext(ModalContext);

  // We create a copy of the component to get a unique identity for the modal store.
  // This ensures that we handle the edge case of the same component being used
  // in multiple useModal calls correctly. Without this, each inlet of the duplicate
  // useModal calls would render duplicate modal instances. By making the component
  // unique, each inlet will only render the instances spawned by its own useModal call.
  const uniqueComponent = useMemo(() => copyComponent(component), [component]);

  useEffect(() => () => store.unmount(uniqueComponent), []);

  return [
    useCallback((props) => store.spawn(uniqueComponent, props), [store]),
    <ModalInlet component={uniqueComponent} defaultProps={defaultProps} />,
  ];
}

function copyComponent<T extends AnyModalComponent>(Component: T): T {
  const copy = (props: ComponentProps<T>) => <Component {...(props as any)} />;
  return copy as T;
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
   * A `ModalInlet` element preconfigured with the modal component and default props passed to `useModal`.
   */
  inlet: ReactElement<{}>,
];

export type ExcessModalProps<Component extends AnyModalComponent> = Omit<
  ComponentProps<Component>,
  keyof ModalProps<unknown>
>;
