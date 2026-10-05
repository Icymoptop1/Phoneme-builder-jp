import { test, expect } from "@playwright/test";

test("user can load and generate a Wordle activity", async ({
  page,
}) => {
  await page.goto("/wordle");

  // Wait for the database-backed Wordle builder to finish loading.
  const activitySelect = page.getByLabel("Saved Activity");

  await expect(activitySelect).toBeVisible({
    timeout: 15000,
  });

  // Confirm a saved Wordle activity is selected.
  await expect(activitySelect).not.toHaveValue("");

  // Confirm a target word from the stored word list is selected.
  const targetSelect = page.getByLabel("Target Word");

  await expect(targetSelect).toBeVisible();
  await expect(targetSelect).not.toHaveValue("");

  // Confirm the activity preview has loaded.
  await expect(
    page.getByRole("heading", {
      name: "Wordle Preview",
    })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Phoneme Keyboard",
    })
  ).toBeVisible();

  // Generate the standalone Wordle HTML.
  await page
    .getByRole("button", {
      name: "Generate HTML",
    })
    .click();

  // Confirm the generation was persisted as usage data.
  await expect
    .poll(
      async () => {
        const response =
          await page.request.get("/api/usage");

        expect(response.ok()).toBeTruthy();

        const records = await response.json();

        return records.some(
          (record: {
            activityType: string | null;
            eventType: string;
            result: string | null;
          }) =>
            record.activityType === "WORDLE" &&
            record.eventType === "GENERATION" &&
            record.result === "SUCCESS"
        );
      },
      {
        timeout: 10000,
      }
    )
    .toBe(true);
});