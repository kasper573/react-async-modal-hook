import { useState } from "react";
import { useModal } from "../../src";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveWithValue = createTestCase(() => {
  const [spawn, Inlet] = useModal(Dialog<string>);
  const [resolution, setResolution] = useState<string>();
  return (
    <>
      <Inlet resolution="foo" />
      {resolution ? <p>Resolved with: {resolution}</p> : null}
      <button onClick={() => spawn().then(setResolution)}>Open dialog</button>
    </>
  );
});
