import { ComponentProps, useState } from "react";
import { useModal, useModalSustainer } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveSustained = createTestCase(() => {
  const [spawn, Inlet] = useModal(SustainDialog);
  return (
    <>
      <Inlet />
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});

function SustainDialog(props: ComponentProps<typeof Dialog>) {
  const sustain = useModalSustainer(props.instanceId);
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
