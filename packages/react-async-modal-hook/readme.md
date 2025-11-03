# react-async-modal-hook

The declarative nature of React is great for most use cases, but not always. When working with async UI flows like dialogs, toasts and drawers, it's often preferable to have a promise based interface, which is what this library provides.

**Highlights:**

- **Minimal boilerplate**: Only write the code that matters. The rest is handled internally.
- **Linear logic flow**: Spawn and await modal results in easy to read and compose async/await flow.
- **Performance**: Modal state changes re-render modals without re-rendering the parent component
- **Tiny**: ~1kB gzipped and minified, zero dependencies.

## Quickstart

> For more detailed information, see full documentation below.

Here's an example of a component that allows the user to display and add list items. Adding new items is done via a dialog, and if the user tries to add a duplicate item, we want to show a confirmation dialog before proceeding.

```tsx
import { useModal } from "react-async-modal-hook";
import { CreateItemDialog } from "./CreateItemDialog";
import { ConfirmDialog } from "./ConfirmDialog";

function ItemList() {
  const [items, setItems] = useState([]);

  // useModal is a hook that returns the two key features of this library:
  // 1. A spawner function that opens a new instance of the given modal.
  //    It returns a promise that resolves when the modal closes, along with its result.
  // 2. The inlet: A react element that renders the spawned elements for the given component.
  const [confirm, confirmInlet] = useModal(ConfirmDialog);
  const [createItem, createInlet] = useModal(CreateItemDialog);

  async function onAddClicked() {
    // Calling `createItem` will display the `CreateItemDialog` modal and return a promise.
    // This promise waits for the dialog to close and returns the new item.
    // (See the modal component example below for how promise resolution works)
    const newItem = await createItem();

    if (items.includes(newItem)) {
      const confirmed = await confirm({
        title: "The item has already been added",
        message: `Are you sure you want add a duplicate of "${newItem}"?`,
      });

      if (!confirmed) {
        return; // User cancelled
      }
    }

    setItems([...items, newItem]);
  }

  return (
    <>
      {/* All modal inlets must be added to the react tree */}
      {createInlet}
      {confirmInlet}

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={onAddClicked}>Add item</button>
    </>
  );
}
```

Any react component that accepts `ModalProps<T>` can be used with `useModal`.

The component is expected to follow the convention of making use of the `open` prop to control visibility, and calling the `resolve` function when the modal should be closed.

The generic type `T` represents the type of value that the modal is designed to output, which can be any data you want. If specified, the `resolve` function will require a value of that type when called.

```tsx
import { ModalProps } from "react-async-modal-hook";

interface ConfirmDialogProps extends ModalProps<boolean> {
  title: string;
  message: string;
}

export function ConfirmDialog({ title, message, open, resolve }: ConfirmDialogProps) {
  return (
    <dialog open={open}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={() => resolve(true)}>Yes</button>
      <button onClick={() => resolve(false)}>No</button>
    </div>
  );
}
```

> Only showcasing one of the components from the above example here for brevity, as the other component would be nearly identical.

## Setup

1. Install the package

```bash
npm install react-async-modal-hook
# or
yarn add react-async-modal-hook
# or
pnpm add react-async-modal-hook
```

2. Add `ModalStore` and `ModalOutlet` to your app

The store contains the state of all modals in your app.

The outlet is a react portal destination where all modals will be sent. It allows you to control the draw order of all modals, which is a great way to avoid having to resort to z-index hacks.

```tsx
import { useMemo } from "react";
import { ModalStore, ModalContext, ModalOutlet } from "react-async-modal-hook";

function App() {
  const modalStore = useMemo(() => new ModalStore(), []);

  return (
    <ModalContext.Provider value={modalStore}>
      <YourAppContent />
      <ModalOutlet />
    </ModalContext.Provider>
  );
}
```

> You can [customize the modal outlet](#custom-modal-outlet) if necessary.

## What are these `inlets` in the example above?

I call them inlets because they are the counterpart to the outlet you set up.

They are react elements that renders all currently spawned modal instances for its associated modal component.

1. It automatically renders into a [react portal](https://react.dev/reference/react-dom/createPortal) targeting your [ModalOutlet](#1-set-up-modal-store-and-outlet) component

2. It automatically handles the open/close state of the modal.

3. It provides the `resolve` function to the modal component, which allows the modal to close itself and return a value.

Inlets should always be part of the react tree. Do not render them conditionally for visibility, or wrap with more react portals, since that is already handled internally.

Note that since inlets automatically portal to the outlet, it never actually renders anything inline, so you do not have to worry about it impacting the dom where you place them.

> An optional note on implementation for the extra curious: It may seem like it should be possible to automate the rendering of modal elements without this inlet pattern, and thus reducing boilerplate even futher. Unfortunately that can't be done without losing access to react context. Previous versions of this library tried this approach and found this out the hard way, so the inlet pattern is a minor verbosity ultimately imposed by react itself that we simply cannot avoid if we want modals to have access to context, which we definitely do. The reduction in boilerplate is not worth the loss of access to react context.

## Default props

Props passed to all spawned instances can be provided by using the second argument to `useModal`:

```tsx
const [showDialog, dialogInlet] = useModal(MyDialog, {
  theme: "dark",
  size: "large",
});

// Now all spawned dialogs will have these defaults
const result = await showDialog({ title: "Custom Title" });
// Will yield this modal: <MyDialog theme="dark" size="large" title="Custom Title" />
```

### TypeScript benefits

For Typescript users: If you provide default props for properties that are required by the modal component, the librarys typescript definitions will adjust and allow you to omit them in the spawner function.

```tsx
// Lets say you have a modal component for the following props:
// (Modal implementation not shown for brevity)
interface MyDialogProps extends ModalProps<string> {
  title: string;
}

// It's perfectly fine to omit default props, even if some props are required:
const [show, inlet1] = useModal(MyDialog);

// But then when you spawn a new instance, you must provide all required props:
await show({ title: "Hello" }); // OK
await show({}); // TypeScript error: Property 'title' is missing
await show(); // TypeScript error: Expected 1 arguments, but got 0.

// However, if you provide default props for all required properties:
const [showWithDefaults, inlet2] = useModal(MyDialog, {
  title: "Default Title",
});

// Now you can omit them when spawning new instances:
await showWithDefaults({}); // OK
await showWithDefaults(); // OK

// But of course you can still override the defaults if needed:
await showWithDefaults({ title: "Custom Title" }); // OK
```

## Animation support with useModalSustainer

By default, modal elements are unmounted as soon as they are resolved. This works fine as long as your modals do not have any exit animations. If you want to add exit animations, you can use the `useModalSustainer` hook inside your modal component to communicate to the library that it should wait to unmount modal elements of this component until you explicitly tell it to do so.

This allows you to integrate with any animation library of your choice, or even just use CSS animations.

```tsx
import { ModalProps, useModalSustainer } from "react-async-modal-hook";

function AnimatedDialog({ open, resolve }: ModalProps<string>) {
  // Simply using the sustainer hook will keep all modal instances from being removed
  // until you explicitly call sustainer.resolve()
  const sustainer = useModalSustainer();

  return (
    <div
      className={`dialog ${open ? "entering" : "exiting"}`}
      // We only want to resolve the sustainer when the "close" animation ends
      onAnimationEnd={open ? undefined : () => sustainer.resolve()}
    >
      <h2>Animated Dialog</h2>
      <button onClick={() => resolve("done")}>Close</button>
    </div>
  );
}
```

Note: See [Nested `useModal` calls](#nested-usemodal-calls) for a gotcha when using nested modals with sustainers.

## Multiple modal instances

The same modal component can have multiple instances open simultaneously:

```tsx
const [showNotification, notificationInlet] = useModal(NotificationDialog);

async function handleMultipleNotifications() {
  // All three will be open at the same time
  const results = await Promise.all([
    showNotification({ message: "First notification", type: "info" }),
    showNotification({ message: "Second notification", type: "warning" }),
    showNotification({ message: "Third notification", type: "error" }),
  ]);

  console.log("All notifications resolved:", results);
}
```

## Integration with UI component libraries

The library interface is really small and should work seamlessly with any popular UI component library. Here's an example for integrating with a [material-ui dialog component](https://mui.com/material-ui/react-dialog/).

```tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ModalProps, useModalSustainer } from "react-async-modal-hook";

function ConfirmDialog({
  open,
  resolve,
  title,
  content,
}: ModalProps<boolean> & {
  title: string;
  content: string;
}) {
  const sustainer = useModalSustainer();

  return (
    <Dialog
      open={open}
      onClose={() => resolve(false)}
      // This may differ based on the UI library you use,
      // but it usually involves hooking into the exit transition.
      TransitionProps={{
        onExited: () => sustainer.resolve(), // Wait for MUI's exit transition
      }}
      // Remember to disable any built-in portals
      // since it's already handled by the library
      disablePortal
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={() => resolve(false)}>Cancel</Button>
        <Button onClick={() => resolve(true)} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

For more examples you can check out the [storybook app included in the repository](https://github.com/kasper573/react-async-modal-hook/tree/main/apps/storybook/src)

## Custom modal outlet

By default, modals render into the `<ModalOutlet />`. It's a div that can be styled as needed:

```tsx
<ModalOutlet
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    pointerEvents: "none",
  }}
/>
```

But if you need more control, you can set any dom element as the react portal target by assigning it to the `ModalStore`:

```tsx
const modalStore = new ModalStore();
modalStore.setOutlet(document.getElementById("custom-modal-root"));
```

> In fact, the `ModalOutlet` component is just a simple div component that assigns its ref as the outlet on the `ModalStore` when mounted.

## Nested `useModal` calls

> For example, a drawer modal that spawns notification modals.

This is supported. You can have components that use `useModal` to spawn modals from within modals, but there is one gotcha to be aware of when doing this, especially when using `useModalSustainer` for exit animations:

If a component that uses `useModal` unmounts while it still has modals open, those modals will also unmount, regardless if you are using `useModalSustainer`. The promises of the discarded modals will be rejected, so you will still have an opportunity to handle this scenario by catching the promise rejection. However, for components using sustainers to keep exit animations running, the animations simply won't finish playing before the modals are unmounted.

> See the [NestedGotcha](https://github.com/kasper573/react-async-modal-hook/blob/main/apps/storybook/src/NestedGotcha.stories.tsx) storybook story for a demo of this behavior.

This is fine for the vast majority of use cases since in practice you rarely do this, as `useModal` is intended for modals which by nature prompt the user until an action has been chosen. However, if using `useModal` for notification modals like snackbars/toasts or other similar non blocking UI patterns, then discarding the modals early may not be desirable. But in those cases you can solve the problem by using a global event system, and plugging those events into `useModal` higher up in your react tree, likely in the app root.

> See the [NestedIdeal](https://github.com/kasper573/react-async-modal-hook/blob/main/apps/storybook/src/NestedIdeal.stories.tsx) storybook story for a demo of the solution.

This limitation is an intentional design choice to keep the library simple and robust. This approach is really easy to build and maintain, and guarantees that you won't have modals lingering around in case of unexpected unmounts. The alternative would be to rebuild the library to have first class nesting support built-in to the sustainer feature, but that would be excessively complex for little gain, since the vast majority of use cases don't require it.
