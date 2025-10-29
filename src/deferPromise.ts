export function deferPromise<T>(
  chain: (promise: Promise<T>) => Promise<T> = (p) => p,
): DeferredPromise<T> {
  let resolve: DeferredPromise<T>["resolve"];
  let reject: DeferredPromise<T>["reject"];

  const promise = chain(
    new Promise<T>(
      (_resolve, _reject) => ((resolve = _resolve), (reject = _reject)),
    ),
  );

  let status: "resolved" | "rejected" | "pending" = "pending";

  return {
    promise,
    resolve(value) {
      status = "resolved";
      resolve!(value);
    },
    reject(reason) {
      status = "rejected";
      reject!(reason);
    },
    get isResolved() {
      return status === "resolved";
    },
  };
}

export interface DeferredPromise<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (reason?: unknown) => void;
  readonly isResolved: boolean;
}
