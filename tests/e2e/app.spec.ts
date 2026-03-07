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

  const aboutWindow = page.locator(".bio_folder").first();
  if (await aboutWindow.isVisible().catch(() => false)) {
    await aboutWindow.locator(".bio_barbtn .x").click({ force: true });
    await expect(aboutWindow).toHaveCSS("display", "none");
  }

  const patchWindow = page.locator(".folder_folder-resumefile").first();
  if (await patchWindow.isVisible().catch(() => false)) {
    await patchWindow.locator(".folder_barbtn-resumefile > div").last().click({ force: true });
    await expect(patchWindow).toHaveCSS("display", "none");
  }
}

test("login reaches the desktop and taskbar", async ({ page }) => {
  await login(page);
  await expect(page.locator(".drag_drop")).toBeVisible();

  await openStartMenu(page);
  await expect(page.locator(".start_popup")).toContainText("Nintendo 3DS");
  await expect(page.locator(".start_popup")).toContainText("Commander Keen 4");
});

test("Commander Keen 4 launches through the stable JS-DOS compatibility page", async ({ page }) => {
  await login(page);
  await launchFromStart(page, "keen4");

  const window = firstWindow(page);
  const iframe = firstIframe(window);

  await expect(window).toBeVisible();
  await expect(iframe).toHaveAttribute("src", /js-dos\.com\/games\/ke\.exe\.html/);

  const frame = page.frameLocator(".retro-emulator-iframe");
  await expect(frame.locator("#canvas")).toBeVisible();
  await page.waitForTimeout(8_000);
  await expect(frame.locator("body")).not.toContainText("Exception thrown");
  await expect(frame.locator("body")).not.toContainText("Downloading data...");
  await expect(window.locator(".iframe-error-overlay")).toHaveCount(0);
});

test("Nintendo 3DS library keeps the proxy-backed manifest flow and reports the unavailable web runtime cleanly", async ({
  page,
}) => {
  await login(page);
  await launchFromStart(page, "threeds");

  const rows = page.locator(".rom-library-row");
  await expect(rows.first()).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Pokemon Ultra Sun" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Pokemon Omega Ruby" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Pokemon Y" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Super Mario 3D Land" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Ocarina of Time 3D" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Pokemon Omega Ruby" }).locator("img")).toBeVisible();
  await rows.first().click();

  await expect(firstWindow(page).locator(".rom-player-meta")).toContainText("workers.dev");
  await expect(firstWindow(page).locator(".retro-emulator-iframe")).toHaveCount(0);

  await expect(
    firstWindow(page).locator(".iframe-error-overlay"),
  ).toContainText("Nintendo 3DS runtime unavailable");
  await expect(
    firstWindow(page).locator(".iframe-error-overlay"),
  ).toContainText("EmulatorJS does not currently provide a usable Nintendo 3DS Citra core");

  await firstWindow(page).getByRole("button", { name: "Back" }).click();
  await expect(rows.first()).toBeVisible();
});

test("PlayStation 1 library uses proxy URLs with the PS1 core mapping", async ({ page }) => {
  await login(page);
  await launchFromStart(page, "ps1");

  const rows = page.locator(".rom-library-row");
  await expect(rows.first()).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Mortal Kombat Trilogy" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Spyro the Dragon" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Tekken 3" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Final Fantasy IX" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Gran Turismo" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Metal Gear Solid" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Tomb Raider" })).toBeVisible();
  await expect(page.locator(".rom-library-row", { hasText: "Metal Gear Solid" }).locator("img")).toBeVisible();
  await rows.first().click();

  const iframe = firstIframe(firstWindow(page));
  await expect(iframe).toHaveAttribute("src", /core=mednafen_psx_hw/);
  await expect(iframe).toHaveAttribute("src", /workers\.dev/);
  await expect(iframe).toHaveAttribute("src", /bios=/);
  await expect(iframe).toHaveAttribute("src", /scph5501\.bin/);

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
