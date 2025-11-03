import type { ComponentProps } from "react";
import { useState } from "react";
import { useModal, useModalSustainer } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveSustained = createTestCase(() => {
  const [spawn, inlet] = useModal(SustainDialog);
  return (
    <>
      {inlet}
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});

function SustainDialog(props: ComponentProps<typeof Dialog>) {
  const sustain = useModalSustainer();
  const [isReleased, setIsReleased] = useState(false);
  const isSustaining = !props.open && !isReleased;
  return (
    <Dialog
      {...props}
      open={props.open || isSustaining}
      message={isSustaining ? "sustained" : null}
    >
      {!props.open && (
        <button
          onClick={() => {
            setIsReleased(true);
            sustain.resolve();
          }}
        >
          Release sustain
        </button>
      )}
    </Dialog>
  );
}
