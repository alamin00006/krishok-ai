"use client";

import { Link } from "@/lib/router-adapter";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { TrendingUp, TrendingDown, Search, MapPin, ArrowUpRight } from "lucide-react";

const prices = [
  { name: "ধান (মোটা)", market: "ময়মনসিংহ", price: "১,১৫০", unit: "৳/মণ", change: "+২.৫%", up: true },
  { name: "ধান (চিকন)", market: "বগুড়া", price: "১,৪২০", unit: "৳/মণ", change: "+১.২%", up: true },
  { name: "আলু", market: "মুন্সিগঞ্জ", price: "৩২", unit: "৳/কেজি", change: "-৩.১%", up: false },
  { name: "পেঁয়াজ", market: "ফরিদপুর", price: "৬৮", unit: "৳/কেজি", change: "+৪.৮%", up: true },
  { name: "টমেটো", market: "যশোর", price: "৪৫", unit: "৳/কেজি", change: "-১.৫%", up: false },
  { name: "মরিচ (কাঁচা)", market: "বগুড়া", price: "১২০", unit: "৳/কেজি", change: "+৮.২%", up: true },
  { name: "সরিষা", market: "টাঙ্গাইল", price: "২,৮০০", unit: "৳/মণ", change: "+০.৬%", up: true },
  { name: "মসুর ডাল", market: "ঢাকা", price: "১১৫", unit: "৳/কেজি", change: "—", up: true },
];
const marketDetailIds: Record<number, string> = {
  2: "potato",
  5: "green-chili",
};

export default function MarketPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader
          icon={TrendingUp}
          title="বাজার দর"
          subtitle="আজকের পাইকারি দাম ও ৭ দিনের পরিবর্তন"
          actions={
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary">
              <MapPin className="h-3.5 w-3.5" /> সকল বাজার
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* Summary */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">শীর্ষ বৃদ্ধি</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="text-[18px] font-bold text-foreground">মরিচ</div>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <TrendingUp className="h-3 w-3" /> +৮.২%
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">শীর্ষ পতন</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="text-[18px] font-bold text-foreground">আলু</div>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                  <TrendingDown className="h-3 w-3" /> -৩.১%
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-[var(--tile-green)] to-white p-4 shadow-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">সক্রিয় বাজার</div>
              <div className="mt-1 text-[18px] font-bold text-foreground">৬৪ টি</div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="ফসল বা বাজার খুঁজুন..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
              <div>ফসল</div>
              <div>বাজার</div>
              <div>দাম</div>
              <div>পরিবর্তন</div>
              <div></div>
            </div>
            {prices.map((p, index) => (
              <div key={p.name + p.market} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border px-5 py-3.5 last:border-0 sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-foreground">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground sm:hidden">{p.market}</div>
                </div>
                <div className="hidden text-[13px] text-muted-foreground sm:block">{p.market}</div>
                <div className="text-right text-[14px] font-bold text-foreground sm:text-left">
                  ৳{p.price} <span className="text-[10px] font-normal text-muted-foreground">{p.unit}</span>
                </div>
                <div className="hidden sm:block">
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${p.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {p.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {p.change}
                  </span>
                </div>
                <Link
                  to={marketDetailIds[index] ? "/details/$section/$id" : "/market"}
                  params={
                    marketDetailIds[index]
                      ? { section: "market", id: marketDetailIds[index] }
                      : undefined
                  }
                  aria-label={`${p.name} বিস্তারিত`}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary sm:inline-flex"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
