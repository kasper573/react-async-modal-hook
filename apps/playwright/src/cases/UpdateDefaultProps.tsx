import { useState } from "react";
import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const UpdateDefaultProps = createTestCase(() => {
  const [message, setMessage] = useState("Default message");
  const [show, inlet] = useModal(Dialog, { message });
  return (
    <>
      {inlet}
      <button onClick={() => show()}>Open dialog</button>
      <button onClick={() => setMessage("Custom message")}>
        Update message
      </button>
    </>
  );
});
