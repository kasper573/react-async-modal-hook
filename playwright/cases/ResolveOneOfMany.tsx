import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveOneOfMany = createTestCase(() => {
  const [spawn, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet />
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
