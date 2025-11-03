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
          components and showcases how it behaves.
        </Typography>

        <Button onClick={() => showDrawer()} sx={{ pb: 2 }}>
          Open drawer
        </Button>

        <Typography gutterBottom>
          One gotcha with nesting is that if the component that uses `useModal`
          unmounts while it still has modals open, those modals will also
          unmount, even if they are suspended by `useModalSustainer`, so exit
          animations won't play. If you try out this demo you can observe this
          behavior.
        </Typography>

        <Typography gutterBottom>
          This is fine for the vast majority of use cases since in practice you
          rarely do this. And if you do, you are probably integrating with a
          global event system like notifications, in which case you should be
          moving up the useModal call higher up your react tree.
        </Typography>

        <Typography gutterBottom>
          This behavior is a combination of simplicity and safe guards. It is
          really easy to build and maintain, and guarantees that you won't have
          modals lingering around in case of unexpected unmounts. The
          alternative would be to rebuild the library to have first class
          nesting support built-in to the sustainer feature, but that would be
          excessively complex for little gain.
        </Typography>

        <Typography>
          To illustrate this issue, follow the demo above and open a drawer
          which in turn lets you open a notification, and then while the
          notification is still open, close the drawer. You will see that the
          notification unmounts immediately without playing its exit animation.
        </Typography>
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
