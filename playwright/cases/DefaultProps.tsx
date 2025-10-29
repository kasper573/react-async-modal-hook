import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const DefaultProps = createTestCase(() => {
  const [show, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet message="Default message" />
      <button onClick={() => show()}>Open dialog</button>
    </>
  );
});
