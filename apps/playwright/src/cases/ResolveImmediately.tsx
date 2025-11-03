import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveImmediately = createTestCase(() => {
  const [spawn, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});
