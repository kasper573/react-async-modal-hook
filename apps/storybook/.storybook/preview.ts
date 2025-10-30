import type { Preview } from "@storybook/react-vite";
import { enableMapSet } from "immer";

enableMapSet();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
