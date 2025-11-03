import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveOneOfMany = createTestCase(() => {
  const [spawn, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button
        onClick={() =>
          spawn({
            name: "foo",
            message: "This is foo",
            style: { position: "relative", left: -100 },
          })
        }
      >
        Spawn foo
      </button>
      <button
        onClick={() =>
          spawn({
            name: "bar",
            message: "This is bar",
            style: { position: "relative", right: -100 },
          })
        }
      >
        Spawn bar
      </button>
    </>
  );
});
