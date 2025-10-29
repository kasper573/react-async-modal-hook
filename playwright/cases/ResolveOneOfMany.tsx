import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveOneOfMany = createTestCase(() => {
  const [spawn, Inlet] = useModal(Dialog);
  return (
    <>
      <Inlet />
      <button onClick={() => spawn({ name: "foo", message: "This is foo" })}>
        Spawn foo
      </button>
      <button onClick={() => spawn({ name: "bar", message: "This is bar" })}>
        Spawn bar
      </button>
    </>
  );
});
