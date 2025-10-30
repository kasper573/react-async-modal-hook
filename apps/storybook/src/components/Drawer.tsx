import { ModalProps, useModalSustainer } from "react-async-modal-hook";
import { Box, Drawer as MuiDrawer, Typography } from "@mui/material";

export function Drawer({ instanceId, open, resolve }: ModalProps) {
  const sustain = useModalSustainer(instanceId);
  return (
    <MuiDrawer
      open={open}
      onClose={() => resolve()}
      onTransitionEnd={open ? undefined : () => sustain.resolve()}
      anchor="right"
    >
      <Box p={2} width={400}>
        <Typography variant="h5">This is an example drawer</Typography>
        <Typography>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          explicabo pariatur sint mollitia saepe quasi, molestiae aliquam
          quaerat minus officiis itaque possimus dolore. Non vitae voluptatum
          magni, itaque assumenda aut.
        </Typography>
      </Box>
    </MuiDrawer>
  );
}
