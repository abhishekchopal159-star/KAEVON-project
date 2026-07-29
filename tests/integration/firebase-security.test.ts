import { describe, expect, it } from "vitest";

const projectId=process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey=process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const root=projectId?`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`:"";

describe.runIf(Boolean(projectId&&apiKey))("deployed Firebase security boundary",()=>{
  it("allows the public-safe settings projection",async()=>{
    const response=await fetch(`${root}/publicStoreSettings/public?key=${apiKey}`);
    expect([200,404]).toContain(response.status);
  });
  it("denies unauthenticated reads of private store settings",async()=>{
    const response=await fetch(`${root}/storeSettings/global?key=${apiKey}`);
    expect(response.status).toBe(403);
  });
  it("denies unauthenticated admin order listing",async()=>{
    const response=await fetch(`${root}/orders?pageSize=1&key=${apiKey}`);
    expect(response.status).toBe(403);
  });
});
