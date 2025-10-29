import { ComponentType } from "react";
import { ModalStore, ModalContext, ModalOutlet } from "../src";

export function createTestCase(Content: ComponentType): ComponentType {
  const store = new ModalStore();
  return () => (
    <ModalContext.Provider value={store}>
      <Content />
      <ModalOutlet />
    </ModalContext.Provider>
  );
}
