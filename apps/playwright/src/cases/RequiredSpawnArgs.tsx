import type { ReactNode } from "react";
import type { ModalProps} from "react-async-modal-hook";
import { useModal } from "react-async-modal-hook";
import { createTestCase } from "../create-test-case";

/**
 * This test case isn't plugged into the Playwright suite.
 * It's only here to verify that type inference of modal props works as expected,
 * and will effectively only have its intended impact during CI runs.
 */
export const RequiredSpawnArgs = createTestCase(() => {
  const [spawnWithRequiredProps, inlet1] = useModal(Dialog);
  const [spawnWithOptionalProps, inlet2] = useModal(Dialog, {
    requiredProperty:
      "I am provided by default and won't be required when spawn is called",
  });
  return (
    <>
      {inlet1}
      {inlet2}
      <button
        onClick={() => {
          spawnWithRequiredProps({
            requiredProperty: "I must be provided at spawn",
          });

          // @ts-expect-error Missing required property should error
          spawnWithRequiredProps({});

          // @ts-expect-error Missing required property should error even if other optional properties are provided
          spawnWithRequiredProps({ optionalProperty: 42 });

          // @ts-expect-error Omitting props entirely should also error
          spawnWithRequiredProps();
        }}
      >
        Open 1
      </button>
      <button
        onClick={() => {
          spawnWithOptionalProps(); // Can be called without props
          spawnWithOptionalProps({ requiredProperty: "Can be overridden" });
          spawnWithOptionalProps({
            optionalProperty: "Can also still be provided",
          });
        }}
      >
        Open 2
      </button>
    </>
  );
});

declare function Dialog<Resolution = unknown>(
  props: ModalProps<Resolution> & {
    requiredProperty: string;
    optionalProperty?: string;
  },
): ReactNode;
