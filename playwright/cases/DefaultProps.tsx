import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const DefaultProps = createTestCase(() => {
  const [show, inlet] = useModal(Dialog, { message: "Default message" });
  return (
    <>
      {inlet}
      <button onClick={() => show()}>Open dialog</button>
    </>
  );
});
