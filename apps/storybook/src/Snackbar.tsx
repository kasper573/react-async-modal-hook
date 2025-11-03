import type { ModalProps } from "react-async-modal-hook";
import { useModalSustainer } from "react-async-modal-hook";
import { IconButton, Snackbar as MuiSnackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ComponentProps } from "react";

export function Snackbar({
  open,
  resolve,
  ...muiSnackbarProps
}: ModalProps &
  Omit<ComponentProps<typeof MuiSnackbar>, keyof ModalProps<unknown>>) {
  const sustain = useModalSustainer();
  const close = () => resolve();

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onTransitionEnd={open ? undefined : () => sustain.resolve()}
      message="Note archived"
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={close}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      onClose={(_, reason) => {
        switch (reason) {
          case "clickaway":
            return;
          default:
            close();
        }
      }}
      {...muiSnackbarProps}
    />
  );
}
