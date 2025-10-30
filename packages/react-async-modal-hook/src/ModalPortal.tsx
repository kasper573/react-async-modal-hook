import { ReactNode, useContext, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "./ModalContext";

export function ModalPortal({ children }: { children?: ReactNode }) {
  const store = useContext(ModalContext);
  const outlet = useSyncExternalStore(
    store.subscribe,
    () => store.state.outlet,
    () => store.state.outlet,
  );
  if (!outlet) {
    return null;
  }
  return createPortal(children, outlet);
}
