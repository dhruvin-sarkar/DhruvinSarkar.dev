import { expect, test, type Locator, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/");
  await expect(page.locator(".login_container")).toBeVisible();
  await page.locator(".login_btn").first().click();
  await expect(page.locator(".btn_start")).toBeVisible();
  await dismissStartupWindows(page);
}

async function openStartMenu(page: Page) {
  const popup = page.locator(".start_popup");
  if (!(await popup.isVisible().catch(() => false))) {
    await page.locator(".btn_start").click();
  }
  await expect(popup).toBeVisible();
}

async function launchFromStart(page: Page, itemClass: string) {
  await openStartMenu(page);
  await page.locator(`.start_popup .${itemClass}`).click();
}

async function openDesktopIcon(page: Page, name: string) {
  const icon = page
    .locator(".drag_drop .icon")
    .filter({ has: page.locator(`img[alt="${name}"]`) })
    .first();

  await expect(icon).toBeVisible();
  await icon.dblclick();
}

function firstWindow(page: Page) {
  return page.locator(".retro-emulator-window").first();
}

function firstIframe(window: Locator) {
  return window.locator(".retro-emulator-iframe").first();
}

async function dismissStartupWindows(page: Page) {
  // The desktop intentionally auto-opens Patch and About after login.
  await page.waitForTimeout(2800);

  const patchWindow = page.locator(".folder_folder-resumefile").first();
  if (await patchWindow.isVisible().catch(() => false)) {
    await patchWindow.locator(".folder_barbtn-resumefile .x").click({ force: true });
    await expect(patchWindow).toBeHidden();
  }

  const aboutWindow = page.locator(".bio_folder").first();
  if (await aboutWindow.isVisible().catch(() => false)) {
    await aboutWindow.locator(".bio_barbtn .x").click({ force: true });
    await expect(aboutWindow).toBeHidden();
  }
}

test("login reaches the desktop and taskbar", async ({ page }) => {
  await login(page);
  await expect(page.locator(".drag_drop")).toBeVisible();

  await openStartMenu(page);
  await expect(page.locator(".start_popup")).toContainText("Nintendo 3DS");
  await expect(page.locator(".start_popup")).toContainText("Commander Keen 4");
});

test("Commander Keen 4 launches through the DOS.Zone wrapper", async ({ page }) => {
  await login(page);
  await launchFromStart(page, "keen4");

  const window = firstWindow(page);
  const iframe = firstIframe(window);

  await expect(window).toBeVisible();
  await expect(iframe).toHaveAttribute("src", /keen4-doszone\.html/);

  const frame = page.frameLocator(".retro-emulator-iframe");
  await expect(frame.locator("#keen-player")).toBeVisible();
  await expect(frame.locator("#overlay")).toHaveClass(/hidden/, {
    timeout: 40_000,
  });
  await expect(window.locator(".iframe-error-overlay")).toHaveCount(0);
});

test("Nintendo 3DS library uses proxy URLs and shows the Citra-core deployment error cleanly", async ({
  page,
}) => {
  await login(page);
  await launchFromStart(page, "threeds");

  const rows = page.locator(".rom-library-row");
  await expect(rows.first()).toBeVisible();
  await rows.first().click();

  const iframe = firstIframe(firstWindow(page));
  await expect(iframe).toHaveAttribute("src", /core=citra/);
  await expect(iframe).toHaveAttribute("src", /workers\.dev/);

  await expect(
    firstWindow(page).locator(".iframe-error-overlay"),
  ).toContainText("The Nintendo 3DS web core is not installed on this deployment.");

  await firstWindow(page).getByRole("button", { name: "Back" }).click();
  await expect(rows.first()).toBeVisible();
});

test("Store renders items and install or uninstall flows do not regress", async ({ page }) => {
  await login(page);
  await openDesktopIcon(page, "Store");

  const store = page.locator(".folder_folder-open-store");
  const list = page.locator(".store_sec_2 .item_section_two");

  await expect(store).toBeVisible();
  await expect(list.first()).toBeVisible();

  const keenRow = list.filter({ hasText: "Commander Keen 4" }).first();
  await expect(keenRow).toBeVisible();
  await keenRow.click();

  const detailsTitle = page.locator(".store_sec_3 h3");
  const installButton = page.locator(".store_sec_3 button").nth(0);
  const uninstallButton = page.locator(".store_sec_3 button").nth(1);

  await expect(detailsTitle).toHaveText("Commander Keen 4");

  if (((await installButton.textContent()) || "").trim() === "Installed") {
    await uninstallButton.click();
    await expect(installButton).toHaveText("Install", { timeout: 10_000 });
  }

  await installButton.click();
  await expect(installButton).toHaveText("Installed", { timeout: 20_000 });

  await uninstallButton.click();
  await expect(installButton).toHaveText("Install", { timeout: 10_000 });
});

test("Existing GBA emulator still launches a bundled ROM", async ({ page }) => {
  await login(page);
  await launchFromStart(page, "gba");

  const rows = page.locator(".rom-library-row");
  await expect(rows.first()).toBeVisible();
  await rows.first().click();

  const iframe = firstIframe(firstWindow(page));
  await expect(iframe).toHaveAttribute("src", /core=mgba/);
  await expect(iframe).toHaveAttribute("src", /\.gba/);
  await expect(page.locator(".iframe-error-overlay")).toHaveCount(0);
});
