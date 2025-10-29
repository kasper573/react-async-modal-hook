import { useContext, useEffect, useMemo } from "react";
import type { InstanceId } from "./ModalStore";
import type { DeferredPromise } from "./deferPromise";
import { deferPromise } from "./deferPromise";
import { ModalContext } from "./ModalContext";

export function useModalSustainer(
  instanceId: InstanceId,
): DeferredPromise<unknown> {
  const sustainer = useMemo(deferPromise, []);
  const store = useContext(ModalContext);

  useEffect(() => {
    store.setSustainer(instanceId, sustainer.promise);
    return () => store.setSustainer(instanceId, undefined);
  }, [store, instanceId, sustainer.promise]);

  return sustainer;
}
