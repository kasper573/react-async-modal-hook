import { useModal } from "react-async-modal-hook";
import { Dialog } from "../Dialog";
import { createTestCase } from "../create-test-case";

export const NoProps = createTestCase(() => {
  const [spawn, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button onClick={() => spawn()}>Open dialog</button>
    </>
  );
});
