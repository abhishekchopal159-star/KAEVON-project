import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicRoutes=["/","/shop","/collections","/product/1"];

test.describe("guest storefront",()=>{
  for(const route of publicRoutes){
    test(`${route} renders without critical accessibility violations`,async({page})=>{
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
      const severe=results.violations.filter((item)=>["critical","serious"].includes(item.impact??""));
      if(severe.length) console.log("A11Y",route,severe.map((item)=>({id:item.id,impact:item.impact,nodes:item.nodes.length,classes:[...new Set(item.nodes.map((node)=>node.html.match(/class=\"([^\"]+)\"/)?.[1]??node.html))]})));
      expect(severe.length).toBe(0);
    });
  }
  test("unknown route presents the branded recovery page",async({page})=>{
    await page.goto("/this-piece-does-not-exist");
    await expect(page.getByRole("heading",{name:"This piece is no longer here."})).toBeVisible();
  });
  test("catalogue remains usable when cloud catalogue requests fail",async({page})=>{
    await page.route(/firestore\.googleapis\.com/,route=>route.abort("failed"));
    await page.goto("/shop");
    await expect(page.locator('a[href^="/product/"]').first()).toBeVisible();
  });
  test("slow media delivery preserves meaningful storefront content",async({page})=>{
    await page.route(/\.(?:avif|gif|jpe?g|png|webp)(?:\?.*)?$/i,async route=>{
      await new Promise((resolve)=>setTimeout(resolve,75));
      await route.continue();
    });
    await page.goto("/");
    await expect(page.locator("body")).toContainText("STYLOVERSE");
    await expect(page.locator('a[href="/shop"]').first()).toBeVisible();
  });
});

test.describe("authorization boundaries",()=>{
  test("checkout requires authentication",async({page})=>{
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/auth\/checkout/);
  });
  test("private admin routes require an administrator session",async({page})=>{
    await page.goto("/admin/orders?preview=1");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading",{name:"Enter the atelier."})).toBeVisible();
  });
});

test("core public navigation is operational",async({page})=>{
  await page.goto("/shop");
  const product=page.locator('a[href^="/product/"]');
  await expect(product.first()).toBeVisible();
  await product.first().click();
  await expect(page).toHaveURL(/\/product\//);
  await expect(page.locator("main h1")).toBeVisible();
});
