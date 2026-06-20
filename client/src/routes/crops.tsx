"use client";

import { Link } from "@/lib/router-adapter";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { BookOpen, Search, Calendar, Droplets, Sun, Sprout, ChevronRight } from "lucide-react";

const crops = [
  { name: "ধান (BRRI dhan29)", season: "বোরো", duration: "১৬০-১৬৫ দিন", water: "উচ্চ", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1568347355280-d33fdf77d42a?w=600&q=80" },
  { name: "টমেটো", season: "রবি", duration: "৯০-১২০ দিন", water: "মাঝারি", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80" },
  { name: "সরিষা (BARI-14)", season: "রবি", duration: "৭৫-৮৫ দিন", water: "কম", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&q=80" },
  { name: "মরিচ", season: "সারাবছর", duration: "১২০-১৮০ দিন", water: "মাঝারি", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=80" },
  { name: "আলু", season: "রবি", duration: "৮৫-৯০ দিন", water: "মাঝারি", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80" },
  { name: "পেঁয়াজ", season: "রবি", duration: "১২০-১৫০ দিন", water: "মাঝারি", sun: "পূর্ণ", img: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=600&q=80" },
];

const categories = ["সব", "ধান্যশস্য", "সবজি", "ডাল", "তেলবীজ", "ফল", "মসলা"];
const cropDetailIds = ["brri-dhan-29", "tomato"];

export default function CropsPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader
          icon={BookOpen}
          title="ফসল গাইড"
          subtitle="মৌসুম অনুযায়ী চাষ পদ্ধতি ও যত্ন"
          actions={
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="ফসল খুঁজুন..."
                className="w-48 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* Category chips */}
          <div className="mb-5 flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  i === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-muted-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Featured banner */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[var(--tile-green)] to-white">
            <div className="flex items-center gap-3 p-4 sm:gap-5 sm:p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white">
                <Sprout className="h-7 w-7" style={{ color: "var(--icon-green)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold text-foreground">এই মৌসুমে কী চাষ করবেন?</div>
                <div className="text-[12px] text-muted-foreground">আপনার এলাকা ও মাটি অনুযায়ী AI সুপারিশ পান।</div>
              </div>
              <button className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-2 text-[12px] font-semibold text-primary-foreground hover:bg-[var(--primary-dark)]">
                সুপারিশ নিন <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Crop grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {crops.map((c, index) => (
              <div key={c.name} className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <img src={c.img} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="truncate text-[15px] font-bold text-foreground">{c.name}</div>
                    <span className="shrink-0 rounded-full bg-[var(--tile-green)] px-2 py-0.5 text-[10px] font-semibold text-primary">{c.season}</span>
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{c.duration}</span>
                    <span className="inline-flex items-center gap-1"><Droplets className="h-3 w-3" />{c.water}</span>
                    <span className="inline-flex items-center gap-1"><Sun className="h-3 w-3" />{c.sun}</span>
                  </div>
                  <Link
                    to={cropDetailIds[index] ? "/details/$section/$id" : "/crops"}
                    params={
                      cropDetailIds[index]
                        ? { section: "crops", id: cropDetailIds[index] }
                        : undefined
                    }
                    className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-border bg-[var(--tile-green)]/40 px-3 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-[var(--tile-green)]"
                  >
                    গাইড দেখুন <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
