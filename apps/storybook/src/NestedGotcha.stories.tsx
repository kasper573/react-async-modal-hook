import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ModalProps } from "react-async-modal-hook";
import { useModal } from "react-async-modal-hook";
import { Button, Typography } from "@mui/material";
import { Drawer } from "./Drawer";
import { Dialog } from "./Dialog";
import { Snackbar } from "./Snackbar";

const meta: Meta = {
  component: () => null,
};

export default meta;

export const UseModal: StoryObj = {
  render() {
    const [showDrawer, drawerInlet] = useModal(NestedDrawer);
    return (
      <>
        {drawerInlet}

        <Typography gutterBottom>
          This story demonstrates that you can use `useModal` in nested modal
          components and showcases how the gotcha outlined in the readme
          behaves.
        </Typography>

        <Typography gutterBottom>
          How to produce the issue: Open the drawer which in turn lets you open
          a notification, and then while the notification is still open, close
          the drawer. You will see that the notification unmounts immediately
          without playing its exit animation.
        </Typography>

        <Button onClick={() => showDrawer()}>Open drawer</Button>
      </>
    );
  },
};

function NestedDrawer(props: ModalProps) {
  const [showDialog, dialogInlet] = useModal(NestedDialog);
  const [showNotification, notificationInlet] = useModal(Snackbar, {
    message: "Notification from drawer",
  });
  return (
    <>
      {dialogInlet}
      {notificationInlet}

      <Drawer {...props}>
        <Typography variant="h6" gutterBottom>
          This drawer was opened by the app
        </Typography>
        <Button onClick={() => showDialog()}>Open dialog</Button>
        <Button onClick={() => showNotification()}>Show notification</Button>
      </Drawer>
    </>
  );
}

function NestedDialog(props: ModalProps<boolean>) {
  const [showNotification, notificationInlet] = useModal(Snackbar, {
    message: "Notification from dialog",
  });
  return (
    <>
      {notificationInlet}
      <Dialog
        {...props}
        title="This dialog was opened by the drawer"
        message={
          <Button onClick={() => showNotification()} sx={{ mb: 1 }}>
            Show notification
          </Button>
        }
      />
    </>
  );
}
