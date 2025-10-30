import { Meta, StoryObj } from "@storybook/react-vite";
import { useModal } from "react-async-modal-hook";
import { Button } from "@mui/material";
import { Snackbar } from "./Snackbar";

const meta: Meta = {
  component: Snackbar,
};

export default meta;

export const UseModal: StoryObj<typeof Snackbar> = {
  render(props) {
    const [show, inlet] = useModal(Snackbar, props);
    return (
      <>
        {inlet}
        <Button onClick={() => show()}>Open snackbar</Button>
      </>
    );
  },
};
