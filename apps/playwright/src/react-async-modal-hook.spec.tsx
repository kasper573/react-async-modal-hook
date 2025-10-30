import { test, expect } from "@playwright/experimental-ct-react";
import { NoProps } from "./cases/NoProps";
import { SpawnProps } from "./cases/SpawnProps";
import { DefaultProps } from "./cases/DefaultProps";
import { UpdateDefaultProps } from "./cases/UpdateDefaultProps";
import { MultipleInSequence } from "./cases/MultipleInSequence";
import { OpenCloseUnmount } from "./cases/OpenCloseUnmount";
import { ResolveImmediately } from "./cases/ResolveImmediately";
import { ResolveSustained } from "./cases/ResolveSustained";
import { ResolveWithValue } from "./cases/ResolveWithValue";
import { ResolveOneOfMany } from "./cases/ResolveOneOfMany";

test.describe("basics", () => {
  test("no props", async ({ mount, page }) => {
    await mount(<NoProps />);

    await page.getByText("Open dialog").click();
    await expect(
      page.getByRole("dialog").getByText("Built-in message"),
    ).toBeVisible();
  });

  test("spawn props", async ({ mount, page }) => {
    await mount(<SpawnProps />);

    await page.getByText("Open dialog").click();
    await expect(
      page.getByRole("dialog").getByText("Custom message"),
    ).toBeVisible();
  });

  test("default props", async ({ mount, page }) => {
    await mount(<DefaultProps />);

    await page.getByText("Open dialog").click();
    await expect(
      page.getByRole("dialog").getByText("Default message"),
    ).toBeVisible();
  });

  test("can update default props", async ({ mount, page }) => {
    await mount(<UpdateDefaultProps />);

    await page.getByText("Open dialog").click();
    await page.getByText("Update message").click();
    await expect(page.getByText("Custom message")).toBeVisible();
  });
});

test.describe("can resolve", () => {
  test("immediately", async ({ mount, page }) => {
    await mount(<ResolveImmediately />);

    await page.getByText("Open dialog").click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page.getByRole("dialog")).not.toBeAttached();
  });

  test("sustained", async ({ mount, page }) => {
    await mount(<ResolveSustained />);

    await page.getByText("Open dialog").click();
    const dialog = page.getByRole("dialog");

    await dialog.getByRole("button", { name: "OK" }).click();
    await expect(dialog.getByText("sustained")).toBeVisible();

    await dialog.getByRole("button", { name: "Release sustain" }).click();

    expect(dialog).not.toBeVisible();
  });

  test("with value", async ({ mount, page }) => {
    await mount(<ResolveWithValue />);

    await page.getByText("Open dialog").click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page.getByText("Resolved with: foo")).toBeVisible();
  });

  test("one of many", async ({ mount, page }) => {
    await mount(<ResolveOneOfMany />);

    await page.getByText("Spawn foo").click();
    await page.getByText("Spawn bar").click();

    const fooDialog = page.getByRole("dialog", { name: "foo" });
    await fooDialog.getByRole("button", { name: "OK" }).click({ force: true });

    const barDialog = page.getByRole("dialog", { name: "bar" });
    await expect(barDialog).toBeVisible();
    await expect(fooDialog).not.toBeAttached();
  });
});

test.describe("flows", () => {
  test("multiple in sequence", async ({ mount, page }) => {
    await mount(<MultipleInSequence />);

    const openAndResolveDialog = async (name: string) => {
      await page.getByText("Open dialog").click();
      const dialog = page.getByRole("dialog", { name });
      await dialog.getByRole("button", { name: "OK" }).click();
    };

    await openAndResolveDialog("Dialog 0");
    await openAndResolveDialog("Dialog 1");
  });

  test("can open dialog, close it, and then unmount", async ({
    mount,
    page,
  }) => {
    await mount(<OpenCloseUnmount />);

    await page.getByText("Open dialog").click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page.getByRole("dialog")).not.toBeAttached();

    await page.getByText("Go to page 2").click();
    await expect(page.getByText("This is page 2")).toBeVisible();
  });
});
