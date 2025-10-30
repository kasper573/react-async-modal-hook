import type { ComponentProps, ComponentType, ReactElement } from "react";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { ModalContext } from "./ModalContext";
import { DefaultModalProps, ExcessModalProps, ModalInlet } from "./ModalInlet";
import { AnyModalComponent, ModalProps } from "./ModalStore";

export function useModal<
  Props extends ModalProps<any>,
  DefaultProps extends DefaultModalProps<Props> = {},
>(
  component: ComponentType<Props>,
  defaultProps?: DefaultProps,
): UseModalReturn<Props, DefaultProps> {
  const store = useContext(ModalContext);

  // We create a copy of the component to get a unique identity for the modal store.
  // This ensures that we handle the edge case of the same component being used
  // in multiple useModal calls correctly. Without this, each inlet of the duplicate
  // useModal calls would render duplicate modal instances. By making the component
  // unique, each inlet will only render the instances spawned by its own useModal call.
  const uniqueComponent = useMemo(
    () => copyComponent(component) as AnyModalComponent,
    [component],
  );

  useEffect(() => () => store.unmount(uniqueComponent), []);

  return [
    useCallback((...[props]) => store.spawn(uniqueComponent, props), [store]),
    <ModalInlet component={uniqueComponent} defaultProps={defaultProps} />,
  ];
}

function copyComponent<T extends ComponentType<any>>(Component: T): T {
  const copy = (props: ComponentProps<T>) => <Component {...(props as any)} />;
  return copy as T;
}

/**
 * Spawns a new modal instance and returns a promise that resolves
 * when the modal is closed and with the value output by the modal.
 */
export type ModalSpawner<
  Props extends ModalProps<any>,
  DefaultProps extends DefaultModalProps<Props>,
> = (
  ...args: OptionalArgIfNoRequiredKeys<
    MakePartial<ExcessModalProps<Props>, keyof DefaultProps>
  >
) => Promise<ResolutionFromProps<Props>>;

export type UseModalReturn<
  Props extends ModalProps<any>,
  DefaultProps extends DefaultModalProps<Props>,
> = [
  spawn: ModalSpawner<Props, DefaultProps>,
  /**
   * A `ModalInlet` element preconfigured with the modal component and default props passed to `useModal`.
   */
  inlet: ReactElement,
];

type MakePartial<T, K extends PropertyKey> = Omit<T, K> &
  Partial<Omit<T, Exclude<keyof T, K>>>;

type ResolutionFromProps<Props extends ModalProps<any>> =
  Props extends ModalProps<infer R> ? R : never;

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalArgIfNoRequiredKeys<T> =
  RequiredKeys<T> extends never ? [arg?: T] : [arg: T];
