import { useState } from "react";
import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";
import { Dialog } from "../Dialog";

export const ResolveWithValue = createTestCase(() => {
  const [result, setResult] = useState<Result>();
  const [spawn, inlet] = useModal(Dialog<string>, { resolution: "foo" });
  return (
    <>
      {inlet}
      {result ? <p>{describeResult(result)}</p> : null}
      <button
        onClick={() =>
          spawn()
            .then((resolution) => setResult({ resolution }))
            .catch((error) => setResult({ error }))
        }
      >
        Open dialog
      </button>
    </>
  );
});

type Result = { resolution: string } | { error: unknown };

function describeResult(result: Result): string {
  if ("resolution" in result) {
    return `Resolved with: ${result.resolution}`;
  } else {
    return `Rejected with: ${String(result.error)}`;
  }
}
