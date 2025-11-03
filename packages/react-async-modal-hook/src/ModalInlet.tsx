import { createContext, useContext, useEffect, useState } from "react";
import type {
  AnyModalComponent,
  AnyModalProps,
  InstanceId,
  ModalProps,
} from "./ModalStore";
import { ModalContext } from "./ModalContext";
import { ModalPortal } from "./ModalPortal";

// We don't bother with generics here since this component is only used internally.
// (Generics would only improve the dx for using the component directly outside the library)
export interface ModalInletProps {
  component: AnyModalComponent;
  defaultProps?: DefaultModalProps<AnyModalProps>;
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
  component: Modal,
  defaultProps,
}: ModalInletProps) {
  const store = useContext(ModalContext);

  // Note: Can't use useSyncExternalStore here since instancesFor() always returns a new map.
  // Making it return a stable instance is possible but would make the store way more complex for little gain.
  // Recomputing instance maps on every store change is not particularly expensive.
  const [instances, setInstances] = useState(() => store.instancesFor(Modal));
  useEffect(
    () => store.subscribe(() => setInstances(store.instancesFor(Modal))),
    [store, Modal],
  );

  return (
    <ModalPortal>
      {[...instances.entries()].map(
        ([instanceId, { open, propsGivenViaSpawnInvocation }]) => (
          <ModalInstanceContext.Provider key={instanceId} value={instanceId}>
            <Modal
              {...defaultProps}
              {...propsGivenViaSpawnInvocation}
              open={open}
              resolve={(value) => store.resolve(Modal, instanceId, value)}
            />
          </ModalInstanceContext.Provider>
        ),
      )}
    </ModalPortal>
  );
}

export const ModalInstanceContext = createContext<InstanceId | undefined>(
  undefined,
);

export type ExcessModalProps<Props extends AnyModalProps> = Omit<
  Props,
  keyof ModalProps<unknown>
>;

export type DefaultModalProps<Props extends AnyModalProps> = Partial<
  ExcessModalProps<Props>
>;
