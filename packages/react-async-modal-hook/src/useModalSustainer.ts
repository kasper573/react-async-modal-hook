import { useContext, useEffect, useMemo } from "react";
import type { InstanceId } from "./ModalStore";
import type { DeferredPromise } from "./deferPromise";
import { deferPromise } from "./deferPromise";
import { ModalContext } from "./ModalContext";

/**
 * Use inside a useModal compatible react component to prevent a modal instance
 * from being unmounted until the sustainer is explicitly resolved.
 *
 * This is typically used to allow you to suspend removal until a hide animation has finished.
 *
 * Call `sustainer.resolve()` on the returned sustainer when you want to allow the modal to be unmounted.
 */
export function useModalSustainer(
  instanceId: InstanceId,
): DeferredPromise<void> {
  const sustainer = useMemo(deferPromise<void>, []);
  const store = useContext(ModalContext);

  useEffect(() => {
    store.setSustainer(instanceId, sustainer.promise);
    return () => store.setSustainer(instanceId, undefined);
  }, [store, instanceId, sustainer.promise]);

  return sustainer;
}
