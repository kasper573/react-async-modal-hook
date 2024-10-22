import "./setup";
import type { ComponentType } from "react";
import { test, render as renderReact } from "./setup";
import type { InstanceSpawnerFor } from "../src/useModal";
import type { GeneralHookOptions } from "../src/constants";
import type { ModalOutletMapper } from "../src/index";
import {
  ModalOutlet,
  ModalContext,
  useModal,
  useModalSustainer,
  useModals,
  ModalStore,
} from "../src/index";
import type { AnyComponent } from "../src/utilityTypes";

export type AbstractHookTestFactory<T extends AnyComponent> = (
  useHook: (options?: GeneralHookOptions) => InstanceSpawnerFor<T>,
  render: (Content: ComponentType) => ReturnType<typeof renderReact>,
) => void;

export function defineAbstractHookTest<T extends AnyComponent>(
  component: T,
  defineTest: AbstractHookTestFactory<T>,
  { render } = createTestAPI(),
) {
  test("useModal", () =>
    defineTest((options) => useModal(component, {}, options), render));

  test("useModals", () =>
    defineTest((options) => {
      const spawnModal = useModals(options);
      return (...[props]) =>
        // @ts-expect-error lazy avoidance of having to specify the correct generic argument for test convenience. It's okay to pass in empty object.
        spawnModal(component, props);
    }, render));
}

export function createTestAPI(
  createStore = () => new ModalStore(),
  map?: ModalOutletMapper,
) {
  function render(Content: ComponentType) {
    const store = createStore();
    return renderReact(
      <ModalContext.Provider value={store}>
        <Content />
        <ModalOutlet map={map} />
      </ModalContext.Provider>,
    );
  }

  return {
    ModalOutlet,
    ModalContext,
    useModal,
    useModals,
    useModalSustainer,
    render,
  };
}
