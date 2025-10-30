import { Meta, StoryObj } from "@storybook/react-vite";
import { useModal } from "react-async-modal-hook";
import { Dialog } from "./components/Dialog";
import { Button } from "@mui/material";
import { Drawer } from "./components/Drawer";
import { Snackbar } from "./components/Snackbar";

const meta: Meta = {
  component: () => null,
};

export default meta;

export const WithDialog: StoryObj = {
  render() {
    const [show, inlet] = useModal(Dialog);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open dialog</Button>
      </>
    );
  },
};

export const WithDrawer: StoryObj = {
  render() {
    const [show, inlet] = useModal(Drawer);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open drawer</Button>
      </>
    );
  },
};

export const WithSnackbar: StoryObj = {
  render() {
    const [show, inlet] = useModal(Snackbar);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open snackbar</Button>
      </>
    );
  },
};
