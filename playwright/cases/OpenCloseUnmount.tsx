import { useState } from "react";
import { useModal } from "../../src";
import { Dialog } from "../Dialog";
import { createTestCase } from "../create-test-case";

export const OpenCloseUnmount = createTestCase(() => {
  const [pageNum, setPageNum] = useState(1);
  return pageNum === 1 ? <Page1 gotoPage2={() => setPageNum(2)} /> : <Page2 />;
});

function Page1({ gotoPage2 }: { gotoPage2: () => void }) {
  const [show, inlet] = useModal(Dialog);
  return (
    <>
      {inlet}
      <button onClick={() => show()}>Open dialog</button>
      <button onClick={gotoPage2}>Go to page 2</button>
    </>
  );
}

function Page2() {
  return <p>This is page 2</p>;
}
