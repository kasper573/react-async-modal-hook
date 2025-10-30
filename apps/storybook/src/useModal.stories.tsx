import { Meta, StoryObj } from "@storybook/react-vite";
import { useModal } from "react-async-modal-hook";
import { Dialog } from "./components/Dialog";
import { Button } from "@mui/material";

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
