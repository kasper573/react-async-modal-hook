import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ModalProps } from "react-async-modal-hook";
import { useModal } from "react-async-modal-hook";
import { Button, Typography } from "@mui/material";
import { Drawer } from "./Drawer";
import { Dialog } from "./Dialog";
import { Snackbar } from "./Snackbar";
import { createContext, useContext, useEffect } from "react";

const meta: Meta = {
  component: () => null,
};

export default meta;

export const UseModal: StoryObj = {
  render() {
    const [showDrawer, drawerInlet] = useModal(NestedDrawer);
    return (
      <>
        <NotificationModalIntegration />

        {drawerInlet}

        <Typography gutterBottom>
          This story demonstrates that you can use `useModal` in nested modal
          components and showcases how to integrate with global event systems
          for non blocking modal UI patterns like notifications.
        </Typography>
        <Typography gutterBottom>
          Open a drawer which in turn lets you open a notification, and then
          while the notification is still open, close the drawer. You will see
          that the notification stays even though the dialog has been closed.
        </Typography>

        <Button onClick={() => showDrawer()}>Open drawer</Button>
      </>
    );
  },
};

function NotificationModalIntegration() {
  const store = useContext(NotificationBusContext);
  const [showSnackbar, inlet] = useModal(Snackbar);
  useEffect(() => store.subscribe(showSnackbar), [store, showSnackbar]);
  return inlet;
}

function NestedDrawer(props: ModalProps) {
  const [showDialog, dialogInlet] = useModal(NestedDialog);
  const notifications = useContext(NotificationBusContext);
  return (
    <>
      {dialogInlet}

      <Drawer {...props}>
        <Typography variant="h6" gutterBottom>
          This drawer was opened by the app
        </Typography>
        <Button onClick={() => showDialog()}>Open dialog</Button>
        <Button
          onClick={() =>
            notifications.send({ message: "Notification from drawer" })
          }
        >
          Show notification
        </Button>
      </Drawer>
    </>
  );
}

function NestedDialog(props: ModalProps<boolean>) {
  const notifications = useContext(NotificationBusContext);
  return (
    <Dialog
      {...props}
      title="This dialog was opened by the drawer"
      message={
        <Button
          onClick={() =>
            notifications.send({ message: "Notification from dialog" })
          }
          sx={{ mb: 1 }}
        >
          Show notification
        </Button>
      }
    />
  );
}

// This is a simple example of an external global event system for notifications,
// but this pattern could be applied to essentially any external event driven system.

class NotificationBus {
  private listeners = new Set<(n: Notification) => void>();

  send = (n: Notification) => {
    this.listeners.forEach((listener) => listener(n));
  };

  subscribe = (listener: (n: Notification) => void) => {
    this.listeners.add(listener);
    return () => void this.listeners.delete(listener);
  };
}

const NotificationBusContext = createContext(new NotificationBus());

interface Notification {
  readonly message: string;
}
