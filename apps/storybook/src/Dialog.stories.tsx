import type { Meta, StoryObj } from "@storybook/react-vite";
import { useModal } from "react-async-modal-hook";
import { Dialog } from "./Dialog";
import { Button } from "@mui/material";

const meta: Meta = {
  component: Dialog,
};

export default meta;

export const UseModal: StoryObj<typeof Dialog> = {
  render(props) {
    const [show, inlet] = useModal(Dialog, props);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open dialog</Button>
      </>
    );
  },
};
