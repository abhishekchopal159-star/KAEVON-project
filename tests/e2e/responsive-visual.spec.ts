import { expect, test } from "@playwright/test";

const viewports=[
  {name:"mobile-360x800",width:360,height:800},
  {name:"mobile-390x844",width:390,height:844},
  {name:"mobile-430x932",width:430,height:932},
  {name:"tablet-768x1024",width:768,height:1024},
  {name:"desktop-1366x768",width:1366,height:768},
  {name:"desktop-1440x900",width:1440,height:900},
  {name:"desktop-1920x1080",width:1920,height:1080},
] as const;

test.describe("responsive storefront matrix",()=>{
  test.skip(({browserName})=>browserName!=="chromium","Full visual matrix is captured once in Chromium; cross-browser smoke is covered separately.");
  for(const viewport of viewports){
    test(`${viewport.name} has no horizontal overflow`,async({page})=>{
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect(page.locator("body")).toBeVisible();
      const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client+1);
      await expect(page).toHaveScreenshot(`${viewport.name}.png`,{fullPage:false});
    });
  }
});

test("storefront smoke works in every configured browser",async({page})=>{
  await page.goto("/");
  await expect(page.locator("body")).toContainText("STYLOVERSE");
  await page.goto("/shop");
  await expect(page.locator('a[href^="/product/"]').first()).toBeVisible();
});
