# react-async-modal-hook

The declarative nature of React is great for most use cases, but not always. When working with async UI flows like dialogs, toasts and drawers, it's often preferable to have a promise based interface, which is what this library provides.

## Motivation

Traditional modal management in React is verbose and error-prone. Let's look at a real-world example of what implementing a confirmation dialog typically looks like:

### The traditional approach

Here's an example of a page that allows users to add items to a list. If the user tries to add a duplicate item, we want to show a confirmation dialog before proceeding.

```tsx
function ItemListPage() {
  const [items, setItems] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  function handleAddOpen() {
    setAddOpen(true);
  }

  function handleAddClosed(newItem) {
    setAddOpen(false);

    if (items.includes(newItem)) {
      setConfirmOpen(true);
      setPendingItem(newItem);
    } else {
      setItems([...items, newItem]);
    }
  }

  function handleConfirmClose(confirmed) {
    setConfirmOpen(false);

    if (confirmed && pendingItem) {
      setItems([...items, pendingItem]);
    }
    setPendingItem(null);
  }

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={handleAddOpen}>Add item</button>

      <AddDialog open={isAddOpen} onClose={handleAddClosed} />

      <ConfirmDialog
        open={isConfirmOpen}
        title="This item has already been added"
        message={`Are you sure you want to add a duplicate of "${pendingItem}"?`}
        onClose={handleConfirmClose}
      />
    </>
  );
}
```

**Problems with this approach:**

- **Verbose**: It's a lot of boilerplate code to write
- **Complex state management**: Each modal often requires open/result states, which becomes really hard to reason about as the number of modals grows
- **Fragmented logical flow**: The flow is hard to follow across multiple event handlers
- **Performance issues**: Parent component re-renders on every modal state change

### The react-async-modal-hook approach

With `react-async-modal-hook`, we can simplify the above example significantly:

```tsx
function ItemListPage() {
  const [items, setItems] = useState([]);
  const [add, addInlet] = useModal(AddDialog);
  const [confirm, confirmInlet] = useModal(ConfirmDialog);

  async function handleAdd() {
    const newItem = await add();

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
      {/* What is an inlet? See the next section in the docs. */}
      {addInlet}
      {confirmInlet}

      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={handleAdd}>Add item</button>
    </>
  );
}
```

**Benefits:**

- **Minimal boilerplate**: One line per modal setup
- **Linear logic flow**: Handle modal results directly in sequence and compose complex flows easily
- **Performance**: Modal state changes re-render modals without re-rendering the parent component

### What is a modal inlet?

A modal inlet is effectively just the given modal component rendered into a react element, but with a few enhancements:

1. It automatically renders the modal element into a [react portal](https://react.dev/reference/react-dom/createPortal) targeting your `<ModalOutlet />` component (See getting started for more information on the outlet).

2. It automatically handles the open/close state of the modal.

This means that the inlets should always be rendered unconditionally. They just need to be part of your component tree at the same place as you used `useModal` to ensure they have access to the same react context.

## Getting Started

### Installation

[immer](https://immerjs.github.io/immer/) is a required peer dependency.

```bash
npm install react-async-modal-hook immer
# or
yarn add react-async-modal-hook immer
# or
pnpm add react-async-modal-hook immer
```

### Basic Setup

0. **Prerequisites:**

Enable immers [Map/Set support](https://immerjs.github.io/immer/map-set/) in your app.

1. **Wrap your app with the modal provider:**

```tsx
import { useMemo } from "react";
import { ModalStore, ModalContext, ModalOutlet } from "react-async-modal-hook";

function App() {
  const modalStore = useMemo(() => new ModalStore(), []);

  return (
    <ModalContext.Provider value={modalStore}>
      <YourAppContent />
      {/* 
        The modal outlet is a react portal destination where all modals will be sent.
        This allows you to control the draw order of all modals.
      */}
      <ModalOutlet />
    </ModalContext.Provider>
  );
}
```

2. **Create a modal component:**

Any react component that accepts `ModalProps<T>` can be used as a modal.

The component is expected to follow the convention of making use of the `open` prop to control visibility, and calling the `resolve` function when the modal should be closed.

The generic type `T` represents the type of value that the modal is designed to output, which can be any data you want. If specified, the `resolve` function will require a value of that type when called.

```tsx
import { ModalProps } from "react-async-modal-hook";

interface ConfirmDialogProps extends ModalProps<boolean> {
  title: string;
  message: string;
}

function ConfirmDialog({ title, message, open, resolve }: ConfirmDialogProps) {
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

3. **Use the modal in your components:**

```tsx
import { useModal } from "react-async-modal-hook";

function MyComponent() {
  const [showConfirm, confirmInlet] = useModal(ConfirmDialog);

  async function handleAction() {
    // `showConfirm` returns a promise that resolves with the value `T` in ModalProps<T>.
    const confirmed = await showConfirm({
      title: "Confirm Action",
      message: "Are you sure you want to proceed?",
    });

    if (confirmed) {
      // User clicked "Yes"
      console.log("Action confirmed!");
    } else {
      // User clicked "No"
      console.log("Action cancelled");
    }
  }

  return (
    <>
      {confirmInlet}
      <button onClick={handleAction}>Perform Action</button>
    </>
  );
}
```

## Advanced features

### Default props

Reduce repetition by providing default props to your modals:

```tsx
const [showDialog, dialogInlet] = useModal(MyDialog, {
  theme: "dark",
  size: "large",
});

// Now all spawned dialogs will have these defaults
const result = await showDialog({ title: "Custom Title" });
// Will yield this modal: <MyDialog theme="dark" size="large" title="Custom Title" />
```

> Note that if you provide default props for properties that are required by the modal component, the librarys typescript definitions will adjust and allow you to omit them in the spawner function.

### Animation support with useModalSustainer

Prevent modals from unmounting until animations complete.

```tsx
import { ModalProps, useModalSustainer } from "react-async-modal-hook";

function AnimatedDialog({ open, resolve }: ModalProps<string>) {
  // Simply using the sustainer hook will keep all modal instances from being removed
  // until you explicitly call sustainer.resolve()
  const sustainer = useModalSustainer();

  return (
    <div
      className={`dialog ${open ? "entering" : "exiting"}`}
      onAnimationEnd={() => {
        // Only resolve sustainer when closing animation completes
        if (!open) {
          sustainer.resolve();
        }
      }}
    >
      <h2>Animated Dialog</h2>
      <button onClick={() => resolve("done")}>Close</button>
    </div>
  );
}
```

### Multiple modal instances

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

### Integration with UI libraries

Works seamlessly with Material-UI, Chakra UI, Ant Design, etc:

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

### Custom modal outlet

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
