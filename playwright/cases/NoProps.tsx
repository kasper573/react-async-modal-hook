import { useModal } from "../../src";
import { Dialog } from "../Dialog";
import { createTestCase } from "../create-test-case";

export const NoProps = createTestCase(() => {
  const [spawn, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet />
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});
