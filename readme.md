# react-async-modal-hook

> See [packages/react-async-modal-hook](./packages/react-async-modal-hook) for the library readme.

## Working in the repository

The project is a pnpm monorepo using [oxlint](https://www.npmjs.com/package/oxlint) and [prettier](https://www.npmjs.com/package/prettier).

Enable your editor's integrations for these tools for the best experience.

- Run `pnpm dev` to start all dev servers and build watchers.
  > A link to the storybook will be displayed in the terminal.
- Run `pnpm test` to run tests in all packages.
  > Make sure to run `pnpm build` first so that the library is built with the latest changes.
- Run `pnpm build` to build all packages.
  > Not required for development, but useful to locally confirm all packages build correctly before committing changes.
- Run `pnpm lint:check` to check for linting issues.
- Run `pnpm lint:fix` to fix linting issues where possible.
- Run `pnpm format:check` to check for formatting issues.
- Run `pnpm format:fix` to fix formatting issues where possible.

## Contributing

Contributions are welcome! All CI checks must pass before a pull request can be merged. Use the above scripts to help ensure your code meets the project's standards before submitting a PR.
