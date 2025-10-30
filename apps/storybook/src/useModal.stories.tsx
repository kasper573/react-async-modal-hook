import { Meta, StoryObj } from "@storybook/react-vite";
import { CssBaseline } from "@mui/material";
import { useMemo } from "react";
import {
  ModalStore,
  ModalContext,
  ModalOutlet,
  useModal,
} from "react-async-modal-hook";
import { Dialog } from "./components/Dialog";

const meta: Meta = {
  component: UseModalApp,
};

export default meta;

export const WithDialog: StoryObj = {};

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
