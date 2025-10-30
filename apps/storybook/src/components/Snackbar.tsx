import { ModalProps, useModalSustainer } from "react-async-modal-hook";
import { Button, IconButton, Snackbar as MuiSnackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function Snackbar({ instanceId, open, resolve }: ModalProps) {
  const sustain = useModalSustainer(instanceId);
  const close = () => resolve();

  const action = (
    <>
      <Button color="secondary" size="small" onClick={close}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={close}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onTransitionEnd={open ? undefined : () => sustain.resolve()}
      message="Note archived"
      action={action}
      onClose={(_, reason) => {
        switch (reason) {
          case "clickaway":
            return;
          default:
            close();
        }
      }}
    />
  );
}
