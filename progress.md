Original prompt: continue js focus on making every feature work

- 2026-03-04: Continuing emulator and desktop stabilization pass.
- Current completed work in tree: window minimize crash cleanup, Quake launcher/data preflight, Win95 same-origin fallback/readability updates, ROM library uploads/notices, local js-dos runtime wiring for Commander Keen 4.
- Current constraints: keep live Google in Internet Explorer unchanged; skip Doom changes.
- Next verification steps:
- Start local Vite server.
- Validate desktop boot, Patch/About minimize/close, Win95 readability, Quake launch, Commander Keen 4 launch, and ROM library uploads in a clean browser session.
- If runtime issues remain, fix the first reproducible app-owned failure and rerun the flow.
