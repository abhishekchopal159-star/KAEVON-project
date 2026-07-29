"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  CalendarClock,
  Check,
  Eye,
  FolderKanban,
  ImageIcon,
  LayoutTemplate,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";

import { useAdminAccess } from "@/contexts/AdminContext";
import {
  DEFAULT_HOME_CONTENT,
  type ContentStatus,
  type HomeContent,
  type StoreCategory,
  type StoreCollection,
} from "@/types/content-admin";
import {
  saveHomeContent,
  deleteStoreCategory,
  deleteStoreCollection,
  saveStoreCategory,
  saveStoreCollection,
  seedDefaultContent,
  subscribeToHomeContent,
  subscribeToStoreCategories,
  subscribeToStoreCollections,
} from "@/services/content-admin.service";

type Tab = "categories" | "collections" | "homepage";
const statusOptions: ContentStatus[] = [
  "draft",
  "scheduled",
  "published",
  "archived",
];
const emptyCategory: StoreCategory = {
  id: "",
  slug: "",
  name: "",
  title: "",
  eyebrow: "",
  description: "",
  productCategory: "",
  href: "",
  image: "",
  mobileImage: "",
  subcategories: [],
  order: 1,
  status: "draft",
  publishAt: "",
  unpublishAt: "",
  updatedAt: "",
  audit: [],
};
const emptyCollection: StoreCollection = {
  id: "",
  slug: "",
  name: "",
  eyebrow: "",
  description: "",
  href: "",
  image: "",
  mobileImage: "",
  productIds: [],
  order: 1,
  status: "draft",
  publishAt: "",
  unpublishAt: "",
  updatedAt: "",
  audit: [],
};
const previewCategories: StoreCategory[] = [
  {
    ...emptyCategory,
    id: "women",
    slug: "women",
    name: "Women",
    title: "The Signature Edit",
    eyebrow: "Private collection",
    description: "Draped occasionwear and elevated essentials.",
    productCategory: "WOMEN",
    href: "/shop/women",
    image: "/images/categories/Women.png",
    mobileImage: "/images/categories/Women.png",
    subcategories: ["dresses", "sarees", "tops"],
    order: 1,
    status: "published",
  },
  {
    ...emptyCategory,
    id: "men",
    slug: "men",
    name: "Men",
    title: "Modern Tailoring",
    eyebrow: "Modern heritage",
    description: "Refined tailoring and Indian occasionwear.",
    productCategory: "MEN",
    href: "/shop/men",
    image: "/images/categories/Men.png",
    mobileImage: "/images/categories/Men.png",
    subcategories: ["blazers", "kurta-pajama"],
    order: 2,
    status: "published",
  },
];

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  disabled = false,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
      {label}
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-[#DED5CD] bg-white px-4 text-[13px] font-medium normal-case tracking-normal text-[#171513] outline-none transition focus:border-[#A7743D] disabled:opacity-55"
      />
    </label>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const tone =
    status === "published"
      ? "bg-emerald-50 text-emerald-700"
      : status === "scheduled"
        ? "bg-violet-50 text-violet-700"
        : status === "archived"
          ? "bg-stone-100 text-stone-500"
          : "bg-amber-50 text-amber-700";
  return (
    <span
      className={`rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-[0.14em] ${tone}`}
    >
      {status}
    </span>
  );
}

export default function AdminContentStudio() {
  const { profile, isPreview } = useAdminAccess();
  const [tab, setTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<StoreCategory[]>(
    isPreview ? previewCategories : [],
  );
  const [collections, setCollections] = useState<StoreCollection[]>([]);
  const [home, setHome] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [editing, setEditing] = useState<StoreCategory | null>(null);
  const [editingCollection, setEditingCollection] =
    useState<StoreCollection | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPreview) return;
    const fail = (failure: Error) => setError(failure.message);
    const stops = [
      subscribeToStoreCategories(setCategories, fail),
      subscribeToStoreCollections(setCollections, fail),
      subscribeToHomeContent(setHome, fail),
    ];
    return () => stops.forEach((stop) => stop());
  }, [isPreview]);

  const stats = useMemo(
    () => ({
      published: categories.filter((item) => item.status === "published")
        .length,
      drafts: categories.filter((item) => item.status === "draft").length,
      scheduled: categories.filter((item) => item.status === "scheduled")
        .length,
    }),
    [categories],
  );
  const actor = { uid: profile.uid, displayName: profile.displayName };

  async function run(action: () => Promise<void>, success: string) {
    if (isPreview) {
      setNotice(
        "Safe preview read-only hai. Real admin account se changes persist honge.",
      );
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(success);
      setEditing(null);
      setEditingCollection(null);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Content save nahi ho saka.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-[#F4EFE9] px-4 py-6 text-[#171513] sm:px-7 lg:px-10 lg:py-9">
      <section className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_82%_12%,rgba(129,94,255,0.28),transparent_35%),linear-gradient(125deg,#171513,#2D2436)] px-6 py-8 text-white shadow-[0_28px_70px_rgba(29,23,20,0.18)] sm:px-9 lg:px-12 lg:py-11">
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.24em] text-[#E8C88F]">
              <Sparkles size={13} /> Living storefront system
            </span>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-white/45">
              Content command centre
            </p>
            <h1 className="mt-2 font-heading text-4xl leading-none sm:text-5xl lg:text-6xl">
              The editorial atelier.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58">
              Categories, curated collections aur homepage campaigns ko ek
              secure publishing workflow se control karein.
            </p>
          </div>
          <button
            onClick={() =>
              run(
                () => seedDefaultContent(actor),
                "Default luxury content Firestore mein seed ho gaya.",
              )
            }
            disabled={busy}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E0B16C] px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-[#171513] transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Plus size={15} /> Seed defaults
          </button>
        </div>
      </section>

      {(notice || error) && (
        <div
          className={`mt-5 rounded-2xl border px-5 py-4 text-xs ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
        >
          {error || notice}
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Published", value: stats.published, icon: Eye },
          { label: "Drafts", value: stats.drafts, icon: Archive },
          { label: "Scheduled", value: stats.scheduled, icon: CalendarClock },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-[#E2D8CE] bg-white p-4 sm:p-5"
          >
            <item.icon size={17} className="text-[#A7743D]" />
            <strong className="mt-4 block font-heading text-2xl sm:text-3xl">
              {item.value}
            </strong>
            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8B8178]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-[#E2D8CE] bg-white p-2">
        {(
          [
            { id: "categories", label: "Categories", icon: Tags },
            { id: "collections", label: "Collections", icon: FolderKanban },
            { id: "homepage", label: "Homepage", icon: LayoutTemplate },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-5 text-[9px] font-bold uppercase tracking-[0.14em] ${tab === item.id ? "bg-[#171513] text-white" : "text-[#6F665F]"}`}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "categories" && (
        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[28px] border border-[#E2D8CE] bg-white">
            <div className="flex items-center justify-between border-b border-[#EEE6DE] p-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A7743D]">
                  Navigation architecture
                </p>
                <h2 className="mt-1 font-heading text-3xl">Store categories</h2>
              </div>
              <button
                onClick={() => setEditing({ ...emptyCategory })}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171513] text-white"
              >
                <Plus size={17} />
              </button>
            </div>
            <div className="divide-y divide-[#EEE6DE]">
              {categories.length ? (
                categories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditing({ ...item })}
                    className="grid w-full grid-cols-[50px_1fr_auto] items-center gap-4 px-5 py-4 text-left transition hover:bg-[#FBF8F4]"
                  >
                    <div className="relative h-12 overflow-hidden rounded-xl bg-[#EEE7DF]">
                      <ImageIcon
                        className="absolute inset-0 m-auto text-[#B8AAA0]"
                        size={18}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="truncate text-sm">
                          {item.name}
                        </strong>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 truncate text-[10px] text-[#8B8178]">
                        {item.href} · {item.productCategory}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#A7743D]">
                      Edit
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center text-sm text-[#8B8178]">
                  No categories yet. Seed defaults ya new category add karein.
                </div>
              )}
            </div>
          </div>
          <aside className="rounded-[28px] bg-[#1C1917] p-6 text-white">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#D7A863]">
              Publishing guardrails
            </p>
            <h3 className="mt-3 font-heading text-3xl">
              Luxury, without broken journeys.
            </h3>
            <div className="mt-6 space-y-4 text-xs leading-5 text-white/60">
              {[
                "Published entries require desktop + mobile imagery.",
                "Internal links are validated before saving.",
                "Scheduled campaigns require a launch time.",
                "Every save records an administrator audit event.",
              ].map((text) => (
                <p key={text} className="flex gap-3">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#D7A863]" />
                  {text}
                </p>
              ))}
            </div>
          </aside>
        </section>
      )}

      {tab === "collections" && (
        <section className="mt-6 rounded-[28px] border border-[#E2D8CE] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A7743D]">
                Curated commerce
              </p>
              <h2 className="mt-2 font-heading text-3xl">
                Collections registry
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-5 text-[#81776F]">
                Product IDs se editorial collections compose, schedule aur
                publish karein.
              </p>
            </div>
            <button
              onClick={() => setEditingCollection({ ...emptyCollection })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171513] text-white"
            >
              <Plus size={17} />
            </button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {collections.map((item) => (
              <button
                key={item.id}
                onClick={() => setEditingCollection({ ...item })}
                className="rounded-2xl border border-[#E8DED5] p-5 text-left transition hover:border-[#B68A58]"
              >
                <StatusBadge status={item.status} />
                <h3 className="mt-4 font-heading text-2xl">{item.name}</h3>
                <p className="mt-2 text-xs text-[#81776F]">
                  {item.productIds.length} curated products · Edit
                </p>
              </button>
            ))}
            {!collections.length && (
              <div className="rounded-2xl border border-dashed border-[#D9CEC4] p-8 text-center text-xs text-[#81776F] sm:col-span-2">
                Abhi koi collection nahi hai. + se first editorial collection
                create karein.
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "homepage" && (
        <section className="mt-6 rounded-[28px] border border-[#E2D8CE] bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A7743D]">
                Campaign composer
              </p>
              <h2 className="mt-1 font-heading text-3xl">
                Homepage merchandising
              </h2>
            </div>
            <StatusBadge status={home.status} />
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Field
              label="Eyebrow"
              value={home.heroEyebrow}
              onChange={(value) => setHome({ ...home, heroEyebrow: value })}
            />
            <Field
              label="Announcement"
              value={home.announcement}
              onChange={(value) => setHome({ ...home, announcement: value })}
            />
            <Field
              label="Hero title"
              value={home.heroTitle}
              onChange={(value) => setHome({ ...home, heroTitle: value })}
            />
            <Field
              label="Accent line"
              value={home.heroAccent}
              onChange={(value) => setHome({ ...home, heroAccent: value })}
            />
            <Field
              label="Desktop image"
              value={home.heroImage}
              onChange={(value) => setHome({ ...home, heroImage: value })}
            />
            <Field
              label="Mobile image"
              value={home.heroMobileImage}
              onChange={(value) => setHome({ ...home, heroMobileImage: value })}
            />
            <Field
              label="Primary label"
              value={home.primaryLabel}
              onChange={(value) => setHome({ ...home, primaryLabel: value })}
            />
            <Field
              label="Primary link"
              value={home.primaryHref}
              onChange={(value) => setHome({ ...home, primaryHref: value })}
            />
            <Field
              label="Featured product IDs (comma separated)"
              value={home.featuredProductIds.join(", ")}
              onChange={(value) =>
                setHome({
                  ...home,
                  featuredProductIds: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
            <Field
              label="New arrival IDs (comma separated)"
              value={home.newArrivalProductIds.join(", ")}
              onChange={(value) =>
                setHome({
                  ...home,
                  newArrivalProductIds: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
            <Field
              label="Homepage order (comma separated)"
              value={home.sectionOrder.join(", ")}
              onChange={(value) => setHome({ ...home, sectionOrder: value.split(",").map((item)=>item.trim()).filter(Boolean) })}
              placeholder="categories, featured, why, new-arrivals, seasonal, testimonials"
            />
            <Field
              label="Hidden sections (comma separated)"
              value={home.hiddenSections.join(", ")}
              onChange={(value) => setHome({ ...home, hiddenSections: value.split(",").map((item)=>item.trim()).filter(Boolean) })}
            />
            <Field label="Seasonal eyebrow" value={home.seasonalEyebrow} onChange={(value)=>setHome({...home,seasonalEyebrow:value})}/>
            <Field label="Seasonal title" value={home.seasonalTitle} onChange={(value)=>setHome({...home,seasonalTitle:value})}/>
            <Field label="Seasonal desktop image" value={home.seasonalImage} onChange={(value)=>setHome({...home,seasonalImage:value})}/>
            <Field label="Seasonal mobile image" value={home.seasonalMobileImage} onChange={(value)=>setHome({...home,seasonalMobileImage:value})}/>
            <Field label="Seasonal link" value={home.seasonalHref} onChange={(value)=>setHome({...home,seasonalHref:value})}/>
            <Field label="Footer statement" value={home.footerStatement} onChange={(value)=>setHome({...home,footerStatement:value})}/>
            <Field
              label="Publish time"
              type="datetime-local"
              value={home.publishAt.slice(0, 16)}
              onChange={(value) => setHome({ ...home, publishAt: value })}
            />
            <Field
              label="Unpublish time"
              type="datetime-local"
              value={home.unpublishAt.slice(0, 16)}
              onChange={(value) => setHome({ ...home, unpublishAt: value })}
            />
          </div>
          <label className="mt-4 grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
            Description
            <textarea
              value={home.heroDescription}
              onChange={(event) =>
                setHome({ ...home, heroDescription: event.target.value })
              }
              className="min-h-24 rounded-2xl border border-[#DED5CD] p-4 text-[13px] font-medium normal-case tracking-normal outline-none focus:border-[#A7743D]"
            />
          </label>
          <div className="mt-6 rounded-[24px] border border-[#E2D8CE] bg-[#FAF7F3] p-4 sm:p-5">
            <p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#9B6A38]">Client care policy editor</p>
            <p className="mt-2 text-xs leading-5 text-[#81776F]">Storefront policy page ke saare public statements yahan se controlled hain.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([
                ["Shipping", "policyShipping"],
                ["Cancellation", "policyCancellation"],
                ["Returns", "policyReturns"],
                ["Exchanges", "policyExchanges"],
                ["Refunds", "policyRefunds"],
                ["Demo disclosure", "policyDemo"],
              ] as const).map(([label,key])=><label key={key} className="grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">{label}<textarea value={home[key]} onChange={(event)=>setHome({...home,[key]:event.target.value})} className="min-h-28 rounded-2xl border border-[#DED5CD] bg-white p-4 text-[12px] font-medium normal-case leading-5 tracking-normal outline-none focus:border-[#A7743D]"/></label>)}
            </div>
          </div>
          <label className="mt-4 grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
            Seasonal description
            <textarea value={home.seasonalDescription} onChange={(event)=>setHome({...home,seasonalDescription:event.target.value})} className="min-h-24 rounded-2xl border border-[#DED5CD] p-4 text-[13px] font-medium normal-case tracking-normal outline-none focus:border-[#A7743D]"/>
          </label>
          <div className="mt-5 rounded-[24px] border border-[#E2D8CE] bg-[#FAF7F3] p-4">
            <p className="text-[8px] font-bold uppercase tracking-[.2em] text-[#9B6A38]">Section visibility & order</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {home.sectionOrder.map((section,index)=><div key={section} className="flex items-center gap-2 rounded-2xl border border-[#E3D9D0] bg-white p-3"><button type="button" onClick={()=>setHome({...home,hiddenSections:home.hiddenSections.includes(section)?home.hiddenSections.filter((item)=>item!==section):[...home.hiddenSections,section]})} className={`flex-1 text-left text-[8px] font-bold uppercase tracking-[.12em] ${home.hiddenSections.includes(section)?"text-[#A69B91] line-through":"text-[#29231F]"}`}>{section.replace(/-/g," ")}</button><button type="button" disabled={index===0} aria-label={`Move ${section} up`} onClick={()=>{const next=[...home.sectionOrder];[next[index-1],next[index]]=[next[index],next[index-1]];setHome({...home,sectionOrder:next});}} className="h-8 w-8 rounded-lg border border-[#DED4CA] disabled:opacity-30">↑</button><button type="button" disabled={index===home.sectionOrder.length-1} aria-label={`Move ${section} down`} onClick={()=>{const next=[...home.sectionOrder];[next[index+1],next[index]]=[next[index],next[index+1]];setHome({...home,sectionOrder:next});}} className="h-8 w-8 rounded-lg border border-[#DED4CA] disabled:opacity-30">↓</button></div>)}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={home.status}
              onChange={(event) =>
                setHome({
                  ...home,
                  status: event.target.value as ContentStatus,
                })
              }
              className="h-12 rounded-full border border-[#DED5CD] bg-white px-5 text-xs"
            >
              {statusOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button
              onClick={() =>
                run(
                  () => saveHomeContent(home, actor),
                  "Homepage campaign saved aur storefront sync ho gaya.",
                )
              }
              disabled={busy}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#171513] px-6 text-[10px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Save campaign
            </button>
          </div>
        </section>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Category editor"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[32px] bg-[#F8F4EF] p-5 shadow-2xl sm:rounded-[32px] sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A7743D]">
                  Category editor
                </p>
                <h2 className="mt-1 font-heading text-3xl">
                  {editing.id ? editing.name : "New category"}
                </h2>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-[#DDD2C8] px-4 py-2 text-[9px] font-bold uppercase"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Slug"
                value={editing.slug}
                disabled={Boolean(editing.id)}
                onChange={(value) =>
                  setEditing({
                    ...editing,
                    slug: value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
              <Field
                label="Name"
                value={editing.name}
                onChange={(value) => setEditing({ ...editing, name: value })}
              />
              <Field
                label="Editorial title"
                value={editing.title}
                onChange={(value) => setEditing({ ...editing, title: value })}
              />
              <Field
                label="Eyebrow"
                value={editing.eyebrow}
                onChange={(value) => setEditing({ ...editing, eyebrow: value })}
              />
              <Field
                label="Product category"
                value={editing.productCategory}
                onChange={(value) =>
                  setEditing({
                    ...editing,
                    productCategory: value.toUpperCase(),
                  })
                }
              />
              <Field
                label="Storefront link"
                value={editing.href}
                onChange={(value) => setEditing({ ...editing, href: value })}
              />
              <Field
                label="Desktop image"
                value={editing.image}
                onChange={(value) => setEditing({ ...editing, image: value })}
              />
              <Field
                label="Mobile image"
                value={editing.mobileImage}
                onChange={(value) =>
                  setEditing({ ...editing, mobileImage: value })
                }
              />
              <Field
                label="Order"
                type="number"
                value={editing.order}
                onChange={(value) =>
                  setEditing({ ...editing, order: Number(value) })
                }
              />
              <label className="grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
                Status
                <select
                  value={editing.status}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      status: event.target.value as ContentStatus,
                    })
                  }
                  className="h-12 rounded-2xl border border-[#DED5CD] bg-white px-4 text-xs normal-case tracking-normal"
                >
                  {statusOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <Field
                label="Publish time"
                type="datetime-local"
                value={editing.publishAt.slice(0, 16)}
                onChange={(value) =>
                  setEditing({ ...editing, publishAt: value })
                }
              />
              <Field
                label="Unpublish time"
                type="datetime-local"
                value={editing.unpublishAt.slice(0, 16)}
                onChange={(value) =>
                  setEditing({ ...editing, unpublishAt: value })
                }
              />
            </div>
            <label className="mt-4 grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
              Description
              <textarea
                value={editing.description}
                onChange={(event) =>
                  setEditing({ ...editing, description: event.target.value })
                }
                className="min-h-24 rounded-2xl border border-[#DED5CD] bg-white p-4 text-xs normal-case tracking-normal outline-none"
              />
            </label>
            <Field
              label="Subcategories (comma separated)"
              value={editing.subcategories.join(", ")}
              onChange={(value) =>
                setEditing({
                  ...editing,
                  subcategories: value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                run(
                  () => saveStoreCategory(editing, actor),
                  "Category saved aur audit trail update ho gaya.",
                )
              }
              disabled={busy}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#171513] text-[10px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Save category
            </button>
            {editing.id && <button type="button" disabled={busy} onClick={()=>{if(window.confirm(`Delete ${editing.name}? This cannot be undone.`)) run(()=>deleteStoreCategory(editing.id),"Category deleted from the storefront registry.");}} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 text-[9px] font-bold uppercase tracking-[.12em] text-red-700 disabled:opacity-50"><Trash2 size={14}/> Delete</button>}
            </div>
          </div>
        </div>
      )}

      {editingCollection && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Collection editor"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[32px] bg-[#F8F4EF] p-5 sm:rounded-[32px] sm:p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A7743D]">
                  Collection composer
                </p>
                <h2 className="mt-1 font-heading text-3xl">
                  {editingCollection.id
                    ? editingCollection.name
                    : "New collection"}
                </h2>
              </div>
              <button
                onClick={() => setEditingCollection(null)}
                className="rounded-full border border-[#DDD2C8] px-4 py-2 text-[9px] font-bold uppercase"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Slug"
                value={editingCollection.slug}
                disabled={Boolean(editingCollection.id)}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    slug: value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
              />
              <Field
                label="Name"
                value={editingCollection.name}
                onChange={(value) =>
                  setEditingCollection({ ...editingCollection, name: value })
                }
              />
              <Field
                label="Eyebrow"
                value={editingCollection.eyebrow}
                onChange={(value) =>
                  setEditingCollection({ ...editingCollection, eyebrow: value })
                }
              />
              <Field
                label="Storefront link"
                value={editingCollection.href}
                onChange={(value) =>
                  setEditingCollection({ ...editingCollection, href: value })
                }
              />
              <Field
                label="Desktop image"
                value={editingCollection.image}
                onChange={(value) =>
                  setEditingCollection({ ...editingCollection, image: value })
                }
              />
              <Field
                label="Mobile image"
                value={editingCollection.mobileImage}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    mobileImage: value,
                  })
                }
              />
              <Field
                label="Order"
                type="number"
                value={editingCollection.order}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    order: Number(value),
                  })
                }
              />
              <label className="grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
                Status
                <select
                  value={editingCollection.status}
                  onChange={(event) =>
                    setEditingCollection({
                      ...editingCollection,
                      status: event.target.value as ContentStatus,
                    })
                  }
                  className="h-12 rounded-2xl border border-[#DED5CD] bg-white px-4 text-xs normal-case tracking-normal"
                >
                  {statusOptions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <Field
                label="Publish time"
                type="datetime-local"
                value={editingCollection.publishAt.slice(0, 16)}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    publishAt: value,
                  })
                }
              />
              <Field
                label="Unpublish time"
                type="datetime-local"
                value={editingCollection.unpublishAt.slice(0, 16)}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    unpublishAt: value,
                  })
                }
              />
            </div>
            <label className="mt-4 grid gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847970]">
              Description
              <textarea
                value={editingCollection.description}
                onChange={(event) =>
                  setEditingCollection({
                    ...editingCollection,
                    description: event.target.value,
                  })
                }
                className="min-h-24 rounded-2xl border border-[#DED5CD] bg-white p-4 text-xs normal-case tracking-normal outline-none"
              />
            </label>
            <div className="mt-4">
              <Field
                label="Product IDs (comma separated)"
                value={editingCollection.productIds.join(", ")}
                onChange={(value) =>
                  setEditingCollection({
                    ...editingCollection,
                    productIds: value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                run(
                  () => saveStoreCollection(editingCollection, actor),
                  "Collection saved aur publishing registry update ho gayi.",
                )
              }
              disabled={busy}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#171513] text-[10px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              Save collection
            </button>
            {editingCollection.id && <button type="button" disabled={busy} onClick={()=>{if(window.confirm(`Delete ${editingCollection.name}? This cannot be undone.`)) run(()=>deleteStoreCollection(editingCollection.id),"Collection deleted from the storefront registry.");}} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 text-[9px] font-bold uppercase tracking-[.12em] text-red-700 disabled:opacity-50"><Trash2 size={14}/> Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
