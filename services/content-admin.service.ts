import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, type DocumentData, type Unsubscribe } from "firebase/firestore";

import { SHOP_CATEGORY_CONFIG } from "@/data/navigation";
import { db } from "@/lib/firebase";
import { DEFAULT_HOME_CONTENT, type ContentActor, type ContentAuditEntry, type ContentStatus, type HomeContent, type StoreCategory, type StoreCollection } from "@/types/content-admin";

const validStatuses = new Set<ContentStatus>(["draft", "scheduled", "published", "archived"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: unknown, fallback = "") { return typeof value === "string" ? value.trim() : fallback; }
function number(value: unknown, fallback = 0) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : fallback; }
function date(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toISOString();
  return "";
}
function strings(value: unknown) { return Array.isArray(value) ? value.map((item) => text(item)).filter(Boolean) : []; }
function status(value: unknown): ContentStatus { return validStatuses.has(value as ContentStatus) ? value as ContentStatus : "draft"; }
function audit(value: unknown): ContentAuditEntry[] {
  return Array.isArray(value) ? value.map((entry) => {
    const item = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    return { id: text(item.id), action: text(item.action), detail: text(item.detail), actorUid: text(item.actorUid), actorName: text(item.actorName, "Administrator"), createdAt: date(item.createdAt) || text(item.createdAt) };
  }).filter((item) => item.id && item.action) : [];
}

function normalizeCategory(id: string, data: DocumentData): StoreCategory {
  return { id, slug: text(data.slug, id), name: text(data.name), title: text(data.title), eyebrow: text(data.eyebrow), description: text(data.description), productCategory: text(data.productCategory).toUpperCase(), href: text(data.href), image: text(data.image), mobileImage: text(data.mobileImage), subcategories: strings(data.subcategories), order: number(data.order), status: status(data.status), publishAt: date(data.publishAt) || text(data.publishAt), unpublishAt: date(data.unpublishAt) || text(data.unpublishAt), updatedAt: date(data.updatedAt), audit: audit(data.audit) };
}
function normalizeCollection(id: string, data: DocumentData): StoreCollection {
  return { id, slug: text(data.slug, id), name: text(data.name), eyebrow: text(data.eyebrow), description: text(data.description), href: text(data.href), image: text(data.image), mobileImage: text(data.mobileImage), productIds: strings(data.productIds), order: number(data.order), status: status(data.status), publishAt: date(data.publishAt) || text(data.publishAt), unpublishAt: date(data.unpublishAt) || text(data.unpublishAt), updatedAt: date(data.updatedAt), audit: audit(data.audit) };
}
function normalizeHome(data: DocumentData): HomeContent {
  return { ...DEFAULT_HOME_CONTENT, ...Object.fromEntries(Object.entries(DEFAULT_HOME_CONTENT).map(([key, fallback]) => [key, Array.isArray(fallback) ? strings(data[key]) : text(data[key], fallback as string)])), id: "home", featuredCategoryIds: strings(data.featuredCategoryIds).length ? strings(data.featuredCategoryIds) : DEFAULT_HOME_CONTENT.featuredCategoryIds, featuredProductIds: strings(data.featuredProductIds), newArrivalProductIds: strings(data.newArrivalProductIds), sectionOrder: strings(data.sectionOrder).length ? strings(data.sectionOrder) : DEFAULT_HOME_CONTENT.sectionOrder, hiddenSections: strings(data.hiddenSections), status: status(data.status), publishAt: date(data.publishAt) || text(data.publishAt), unpublishAt: date(data.unpublishAt) || text(data.unpublishAt), updatedAt: date(data.updatedAt), audit: audit(data.audit) } as HomeContent;
}

export function isContentLive(item: { status: ContentStatus; publishAt: string; unpublishAt: string }, now = Date.now()) {
  if (item.status !== "published" && item.status !== "scheduled") return false;
  if (item.status === "scheduled" && !item.publishAt) return false;
  if (item.publishAt && new Date(item.publishAt).getTime() > now) return false;
  if (item.unpublishAt && new Date(item.unpublishAt).getTime() <= now) return false;
  return true;
}

export function subscribeToStoreCategories(onData: (items: StoreCategory[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(db, "storeCategories"), (snapshot) => onData(snapshot.docs.map((item) => normalizeCategory(item.id, item.data())).sort((a, b) => a.order - b.order)), (error) => onError?.(error));
}
export function subscribeToStoreCollections(onData: (items: StoreCollection[]) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(db, "storeCollections"), (snapshot) => onData(snapshot.docs.map((item) => normalizeCollection(item.id, item.data())).sort((a, b) => a.order - b.order)), (error) => onError?.(error));
}
export function subscribeToHomeContent(onData: (item: HomeContent) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(doc(db, "siteContent", "home"), (snapshot) => onData(snapshot.exists() ? normalizeHome(snapshot.data()) : DEFAULT_HOME_CONTENT), (error) => onError?.(error));
}

function validateBase(item: { slug: string; name: string; href: string; status: ContentStatus; publishAt: string; unpublishAt: string }) {
  if (!slugPattern.test(item.slug)) throw new Error("Slug lowercase letters, numbers aur hyphens mein hona chahiye.");
  if (!item.name.trim()) throw new Error("Name required hai.");
  if (!item.href.startsWith("/")) throw new Error("Internal link / se start hona chahiye.");
  if (item.status === "scheduled" && !item.publishAt) throw new Error("Scheduled content ke liye publish date required hai.");
  if (item.publishAt && item.unpublishAt && new Date(item.publishAt) >= new Date(item.unpublishAt)) throw new Error("Unpublish time publish time ke baad hona chahiye.");
}
function nextAudit(action: string, detail: string, actor: ContentActor): ContentAuditEntry {
  return { id: crypto.randomUUID(), action, detail, actorUid: actor.uid, actorName: actor.displayName || "Administrator", createdAt: new Date().toISOString() };
}

export async function saveStoreCategory(item: StoreCategory, actor: ContentActor) {
  validateBase(item);
  if (item.status === "published" && (!item.image || !item.mobileImage)) throw new Error("Published category ke desktop aur mobile images required hain.");
  await setDoc(doc(db, "storeCategories", item.slug), { ...item, id: item.slug, audit: [...item.audit, nextAudit("category_saved", `${item.name} saved as ${item.status}.`, actor)].slice(-100), updatedAt: serverTimestamp() }, { merge: true });
}
export async function saveStoreCollection(item: StoreCollection, actor: ContentActor) {
  validateBase(item);
  if (item.status === "published" && (!item.image || !item.mobileImage || !item.productIds.length)) throw new Error("Published collection ke images aur kam-se-kam ek product required hai.");
  await setDoc(doc(db, "storeCollections", item.slug), { ...item, id: item.slug, audit: [...item.audit, nextAudit("collection_saved", `${item.name} saved as ${item.status}.`, actor)].slice(-100), updatedAt: serverTimestamp() }, { merge: true });
}
export async function deleteStoreCategory(id: string) {
  if (!id.trim()) throw new Error("Category ID required hai.");
  await deleteDoc(doc(db, "storeCategories", id));
}
export async function deleteStoreCollection(id: string) {
  if (!id.trim()) throw new Error("Collection ID required hai.");
  await deleteDoc(doc(db, "storeCollections", id));
}
export async function saveHomeContent(item: HomeContent, actor: ContentActor) {
  if (!item.heroTitle || !item.heroImage || !item.heroMobileImage) throw new Error("Hero title aur desktop/mobile images required hain.");
  if (!item.primaryHref.startsWith("/") || !item.secondaryHref.startsWith("/")) throw new Error("Hero links / se start hone chahiye.");
  if (item.seasonalHref && !item.seasonalHref.startsWith("/")) throw new Error("Seasonal link / se start hona chahiye.");
  const allowedSections = new Set(DEFAULT_HOME_CONTENT.sectionOrder);
  if (!item.sectionOrder.length || item.sectionOrder.some((section) => !allowedSections.has(section))) throw new Error("Homepage section order invalid hai.");
  await setDoc(doc(db, "siteContent", "home"), { ...item, audit: [...item.audit, nextAudit("homepage_saved", `Homepage saved as ${item.status}.`, actor)].slice(-100), updatedAt: serverTimestamp() }, { merge: true });
}

export async function seedDefaultContent(actor: ContentActor) {
  const images: Record<string, string> = { women: "/images/categories/Women.png", men: "/images/categories/Men.png", footwear: "/images/categories/Footwear.png", accessories: "/images/categories/Accessories.png", streetwear: "/images/shop/products/streetwear/jackets/streetwear-black-bomber-jacket-01.png" };
  await Promise.all(Object.entries(SHOP_CATEGORY_CONFIG).map(([slug, config], index) => saveStoreCategory({ id: slug, slug, name: config.name, title: config.title, eyebrow: config.eyebrow, description: config.description, productCategory: config.productCategory, href: config.href, image: images[slug] ?? "", mobileImage: images[slug] ?? "", subcategories: [...config.subcategories], order: index + 1, status: images[slug] ? "published" : "draft", publishAt: "", unpublishAt: "", updatedAt: "", audit: [] }, actor)));
  await saveHomeContent(DEFAULT_HOME_CONTENT, actor);
}
