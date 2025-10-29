import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const SpawnProps = createTestCase(() => {
  const [show, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet />
      <button onClick={() => show({ message: "Custom message" })}>
        Open dialog
      </button>
    </>
  );
});
