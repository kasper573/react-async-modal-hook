import type { ModalProps } from "react-async-modal-hook";
import { useModalSustainer } from "react-async-modal-hook";
import { Box, Drawer as MuiDrawer, Typography } from "@mui/material";
import type { ComponentProps } from "react";

export function Drawer({
  open,
  resolve,
  children = (
    <>
      <Typography variant="h5">This is an example drawer</Typography>
      <Typography>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
        explicabo pariatur sint mollitia saepe quasi, molestiae aliquam quaerat
        minus officiis itaque possimus dolore. Non vitae voluptatum magni,
        itaque assumenda aut.
      </Typography>
    </>
  ),
  ...muiDrawerProps
}: ModalProps &
  Omit<ComponentProps<typeof MuiDrawer>, keyof ModalProps<unknown>>) {
  const sustain = useModalSustainer();
  return (
    <MuiDrawer
      open={open}
      onClose={() => resolve()}
      onTransitionEnd={open ? undefined : () => sustain.resolve()}
      anchor="right"
      disablePortal
      {...muiDrawerProps}
    >
      <Box p={2} width={400}>
        {children}
      </Box>
    </MuiDrawer>
  );
}
