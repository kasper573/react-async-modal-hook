import { useContext, HTMLAttributes } from "react";
import { ModalContext } from "./ModalContext";

export function ModalOutlet(props: HTMLAttributes<HTMLDivElement>) {
  const store = useContext(ModalContext);
  return (
    <div
      id="modal-outlet"
      ref={(el) => store.setOutlet(el ?? undefined)}
      {...props}
    />
  );
}
