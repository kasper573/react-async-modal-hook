import { useRef } from "react";
import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const MultipleInSequence = createTestCase(() => {
  const [show, Inlet] = useModal(Dialog);
  const countRef = useRef(0);
  return (
    <>
      <Inlet />
      <button onClick={() => show({ name: `Dialog ${countRef.current++}` })}>
        Open dialog
      </button>
    </>
  );
});
