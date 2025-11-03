import type { Meta, StoryObj } from "@storybook/react-vite";
import { useModal } from "react-async-modal-hook";
import { Button } from "@mui/material";
import { Drawer } from "./Drawer";

const meta: Meta = {
  component: Drawer,
};

export default meta;

export const UseModal: StoryObj<typeof Drawer> = {
  render(props) {
    const [show, inlet] = useModal(Drawer, props);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open drawer</Button>
      </>
    );
  },
};
