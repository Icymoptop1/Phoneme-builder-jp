import { test, expect } from "@playwright/test";

test("builder can create, edit, and delete a word list", async ({
  page,
}) => {
  const originalName = "Playwright Test List";
  const updatedName = "Playwright Updated List";

  await page.goto("/word-lists");

  // Create a new word list.
  await page.getByLabel("List Name").fill(originalName);
  await page
    .getByLabel("Description")
    .fill("Created by the Playwright end-to-end test.");

  await page
    .getByRole("button", { name: "Create Word List" })
    .click();

  await expect(
    page.getByText("Word list created successfully.")
  ).toBeVisible();

  const createdCard = page
    .locator(".saved-word-list-card")
    .filter({ hasText: originalName });

  await expect(createdCard).toBeVisible();

  // Edit the word list.
  await createdCard
    .getByRole("button", { name: "Edit" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Edit Word List" })
  ).toBeVisible();

  await page.getByLabel("List Name").fill(updatedName);

  await page
    .getByRole("button", { name: "Update Word List" })
    .click();

  await expect(
    page.getByText("Word list updated successfully.")
  ).toBeVisible();

  const updatedCard = page
    .locator(".saved-word-list-card")
    .filter({ hasText: updatedName });

  await expect(updatedCard).toBeVisible();

  // Delete the test word list.
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    await dialog.accept();
  });

  await updatedCard
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByText("Word list deleted successfully.")
  ).toBeVisible();

  await expect(updatedCard).toHaveCount(0);
});