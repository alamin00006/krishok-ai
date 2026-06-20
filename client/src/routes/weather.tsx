"use client";

import { Link } from "@/lib/router-adapter";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { CloudSun, MapPin, Droplets, Wind, Sun, CloudRain, Cloud, Thermometer, AlertTriangle } from "lucide-react";

const days = [
  { day: "আজ", icon: Sun, temp: "৩১°", min: "২৪°", cond: "রোদ" },
  { day: "মঙ্গল", icon: CloudSun, temp: "৩০°", min: "২৩°", cond: "আংশিক মেঘ" },
  { day: "বুধ", icon: CloudRain, temp: "২৭°", min: "২২°", cond: "হালকা বৃষ্টি" },
  { day: "বৃহঃ", icon: CloudRain, temp: "২৬°", min: "২২°", cond: "বৃষ্টি" },
  { day: "শুক্র", icon: Cloud, temp: "২৯°", min: "২৩°", cond: "মেঘলা" },
  { day: "শনি", icon: Sun, temp: "৩২°", min: "২৪°", cond: "রোদ" },
  { day: "রবি", icon: Sun, temp: "৩৩°", min: "২৫°", cond: "রোদ" },
];

export default function WeatherPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader
          icon={CloudSun}
          title="আবহাওয়া"
          subtitle="৭ দিনের পূর্বাভাস ও কৃষি সতর্কতা"
          actions={
            <Link
              to="/details/$section/$id"
              params={{ section: "weather", id: "mymensingh" }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary"
            >
              <MapPin className="h-3.5 w-3.5" /> ময়মনসিংহ, বাংলাদেশ
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* Today big card */}
          <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-400 to-emerald-400 p-6 text-white shadow-lg">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="text-[12px] uppercase tracking-wide opacity-90">আজ • সোমবার</div>
                <div className="mt-1 flex items-end gap-3">
                  <div className="text-[64px] font-black leading-none">৩১°</div>
                  <div className="pb-2">
                    <div className="text-[14px] font-semibold">রোদেলা দিন</div>
                    <div className="text-[12px] opacity-90">অনুভূত হচ্ছে ৩৪°</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
                  <span className="inline-flex items-center gap-1.5"><Droplets className="h-4 w-4" /> আর্দ্রতা ৭২%</span>
                  <span className="inline-flex items-center gap-1.5"><Wind className="h-4 w-4" /> বাতাস ১২ কিমি/ঘ</span>
                  <span className="inline-flex items-center gap-1.5"><Thermometer className="h-4 w-4" /> চাপ ১০১২ hPa</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Sun className="h-32 w-32 opacity-90" />
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <div className="mb-6 rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-3 text-[14px] font-bold text-foreground">৭ দিনের পূর্বাভাস</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {days.map((d) => (
                <div key={d.day} className="rounded-xl border border-border bg-[var(--tile-green)]/30 p-3 text-center">
                  <div className="text-[12px] font-semibold text-muted-foreground">{d.day}</div>
                  <d.icon className="mx-auto my-2 h-7 w-7" style={{ color: "var(--icon-green)" }} />
                  <div className="text-[14px] font-bold text-foreground">{d.temp}</div>
                  <div className="text-[11px] text-muted-foreground">{d.min}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{d.cond}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisories */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="text-[14px] font-bold text-amber-900">কৃষি সতর্কতা</div>
              </div>
              <p className="text-[13px] text-amber-900/80">
                আগামী ৩-৪ দিনের মধ্যে বৃষ্টিপাতের সম্ভাবনা রয়েছে। কাটা ধান শুকনো জায়গায় সরিয়ে রাখুন এবং কীটনাশক স্প্রে স্থগিত রাখুন।
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                <div className="text-[14px] font-bold text-foreground">আজকের পরামর্শ</div>
              </div>
              <ul className="space-y-1.5 text-[13px] text-muted-foreground">
                <li>• সকাল ১০টার আগে সেচ দিন</li>
                <li>• পাতার রোগ পর্যবেক্ষণ করুন</li>
                <li>• ছায়াযুক্ত স্থানে চারা সংরক্ষণ করুন</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
