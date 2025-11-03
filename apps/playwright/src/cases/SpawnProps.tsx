import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const SpawnProps = createTestCase(() => {
  const [show, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button onClick={() => show({ message: "Custom message" })}>
        Open dialog
      </button>
    </>
  );
});
