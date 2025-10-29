import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveImmediately = createTestCase(() => {
  const [spawn, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet />
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});
