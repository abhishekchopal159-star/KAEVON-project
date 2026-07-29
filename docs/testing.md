# Testing and QA

## Automated gate

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Vitest covers order transitions, inventory math, promotions, recommendations and live Firebase security boundaries. Playwright covers guest navigation, branded 404, auth/admin denial, cloud-catalogue failure, slow media, WCAG serious/critical checks, product navigation and cross-browser smoke.

Visual baselines cover 360×800, 390×844, 430×932, 768×1024, 1366×768, 1440×900 and 1920×1080. Update baselines only after intentional review:

```powershell
npm.cmd run test:e2e:update
```

Chromium represents Chrome and Android Chromium behavior; Firefox covers Gecko; WebKit covers Safari/iOS rendering fundamentals. Before a paid delivery, repeat smoke tests on real iOS Safari, Android Chrome and Microsoft Edge, because device keyboards, safe areas and GPU/font rendering cannot be perfectly emulated.

Authenticated administrator/customer mutation checks require controlled test accounts and must be run against a non-production Firebase project. Screenshots, traces and videos for failures appear under `test-results/`; the HTML report appears under `playwright-report/`.
