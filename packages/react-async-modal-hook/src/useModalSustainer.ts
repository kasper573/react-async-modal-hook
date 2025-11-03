import { useContext, useEffect, useMemo } from "react";
import type { DeferredPromise } from "./deferPromise";
import { deferPromise } from "./deferPromise";
import { ModalContext } from "./ModalContext";
import { ModalInstanceContext } from "./ModalInlet";

/**
 * Use inside a useModal compatible react component to prevent a modal instance
 * from being unmounted until the sustainer is explicitly resolved.
 *
 * This is typically used to allow you to suspend removal until a hide animation has finished.
 *
 * Call `sustainer.resolve()` on the returned sustainer when you want to allow the modal to be unmounted.
 */
export function useModalSustainer(): DeferredPromise<void> {
  const instanceId = useContext(ModalInstanceContext);
  const sustainer = useMemo(deferPromise<void>, []);
  const store = useContext(ModalContext);

  useEffect(() => {
    if (instanceId === undefined) {
      // If hook is used outside of a modal instance, do nothing
      return;
    }

    store.setSustainer(instanceId, sustainer);
    return () => store.setSustainer(instanceId, undefined);
  }, [store, instanceId, sustainer]);

  return sustainer;
}
