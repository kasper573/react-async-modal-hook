import { useRef } from "react";
import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const MultipleInSequence = createTestCase(() => {
  const [show, inlet] = useModal(Dialog);
  const countRef = useRef(0);
  return (
    <>
      {inlet}
      <button onClick={() => show({ name: `Dialog ${countRef.current++}` })}>
        Open dialog
      </button>
    </>
  );
});
