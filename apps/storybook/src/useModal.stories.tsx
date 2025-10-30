import { Meta, StoryObj } from "@storybook/react-vite";
import { CssBaseline } from "@mui/material";
import { CSSProperties, useMemo } from "react";
import {
  ModalStore,
  ModalContext,
  ModalOutlet,
  useModal,
  ModalProps,
  useModalSustainer,
} from "react-async-modal-hook";

const meta: Meta = {
  component: UseModalApp,
};

export default meta;

export const UseModal: StoryObj = {};

function UseModalApp() {
  const store = useMemo(() => new ModalStore(), []);
  return (
    <ModalContext.Provider value={store}>
      <CssBaseline />
      <Page />
      <ModalOutlet />
    </ModalContext.Provider>
  );
}

function Page() {
  const [show, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button onClick={() => show()}>Open dialog</button>
    </>
  );
}

function Dialog({ instanceId, open, resolve }: ModalProps) {
  const sustain = useModalSustainer(instanceId);
  return (
    <dialog
      open={open}
      style={styles.dialog(open)}
      onTransitionEnd={open ? undefined : () => sustain.resolve()}
    >
      <p>This is an example dialog.</p>
      <button onClick={() => resolve()}>OK</button>
    </dialog>
  );
}

const styles = {
  dialog: (open: boolean): CSSProperties => ({
    border: "2px solid black",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform: open ? "scale(1)" : "scale(0.9)",
    opacity: open ? 1 : 0,
    display: "block",
  }),
};
