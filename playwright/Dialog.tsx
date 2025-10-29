import { ReactNode } from "react";
import { ModalProps } from "../src";

export function Dialog<Resolution = unknown>({
  open,
  message = "Built-in message",
  name,
  resolve,
  resolution,
  children,
}: ModalProps<Resolution> & {
  message?: ReactNode;
  name?: string;
  resolution?: Resolution;
  children?: ReactNode;
}) {
  return (
    <dialog open={open} aria-label={name}>
      <p>{message}</p>
      {children}
      <button onClick={() => resolve(resolution as Resolution)}>OK</button>
    </dialog>
  );
}
