import type { ReactNode } from "react";
import { useContext, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "./ModalContext";

export function ModalPortal({ children }: { children?: ReactNode }) {
  const store = useContext(ModalContext);
  const outlet = useSyncExternalStore(
    store.subscribe,
    store.getOutlet,
    store.getOutlet,
  );
  if (!outlet) {
    return null;
  }
  return createPortal(children, outlet);
}
