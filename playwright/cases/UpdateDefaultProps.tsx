import { useState } from "react";
import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const UpdateDefaultProps = createTestCase(() => {
  const [show, Inlet] = useModal(Dialog);
  const [message, setMessage] = useState("Default message");
  return (
    <>
      <Inlet message={message} />
      <button onClick={() => show()}>Open dialog</button>
      <button onClick={() => setMessage("Custom message")}>
        Update message
      </button>
    </>
  );
});
