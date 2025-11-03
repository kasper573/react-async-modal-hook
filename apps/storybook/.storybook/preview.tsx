import type { Preview } from "@storybook/react-vite";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { CssBaseline } from "@mui/material";
import { ModalStore, ModalContext, ModalOutlet } from "react-async-modal-hook";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

function Providers({ children }: { children?: ReactNode }) {
  const store = useMemo(() => new ModalStore(), []);
  return (
    <ModalContext.Provider value={store}>
      <CssBaseline />
      {children}
      <ModalOutlet />
    </ModalContext.Provider>
  );
}

export default preview;
