import { CSSProperties, ReactNode } from "react";
import { ModalProps } from "../src";

export function Dialog<Resolution = unknown>({
  open,
  message = "Built-in message",
  name,
  resolve,
  resolution,
  children,
  style,
}: ModalProps<Resolution> & {
  message?: ReactNode;
  name?: string;
  resolution?: Resolution;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <dialog open={open} aria-label={name} style={style}>
      <p>{message}</p>
      {children}
      <button onClick={() => resolve(resolution as Resolution)}>OK</button>
    </dialog>
  );
}
