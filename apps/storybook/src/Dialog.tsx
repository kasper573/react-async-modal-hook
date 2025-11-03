import type { ComponentProps, ReactElement } from "react";
import { forwardRef } from "react";
import type { ModalProps } from "react-async-modal-hook";
import { useModalSustainer } from "react-async-modal-hook";
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";

export function Dialog({
  open,
  resolve,
  ...muiDialogProps
}: ModalProps<boolean> &
  Omit<ComponentProps<typeof MuiDialog>, keyof ModalProps<unknown>>) {
  const sustain = useModalSustainer();
  return (
    <MuiDialog
      open={open}
      keepMounted
      disablePortal // Portalling already handled by react-async-modal-hook
      onClose={() => resolve(false)}
      slots={{ transition: Transition }}
      slotProps={{
        transition: {
          // End sustain when the closing transition ends
          onTransitionEnd: open ? undefined : () => sustain.resolve(),
        },
      }}
      {...muiDialogProps}
    >
      <DialogTitle>This is an example dialog</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          explicabo pariatur sint mollitia saepe quasi, molestiae aliquam
          quaerat minus officiis itaque possimus dolore. Non vitae voluptatum
          magni, itaque assumenda aut.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => resolve(false)}>Close</Button>
        <Button onClick={() => resolve(true)}>Ok</Button>
      </DialogActions>
    </MuiDialog>
  );
}

const Transition = forwardRef<
  unknown,
  TransitionProps & { children: ReactElement }
>((props, ref) => <Slide direction="up" ref={ref} {...props} />);
