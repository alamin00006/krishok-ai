"use client";

import { Link } from "@/lib/router-adapter";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { Bell, CloudRain, Bug, TrendingUp, FlaskConical, CheckCheck, Users } from "lucide-react";

const groups = [
  {
    label: "আজ",
    items: [
      { icon: CloudRain, color: "sky", title: "বৃষ্টির পূর্বাভাস", desc: "আগামী ৪৮ ঘণ্টায় ভারী বৃষ্টিপাতের সম্ভাবনা রয়েছে।", time: "১ ঘণ্টা আগে", unread: true },
      { icon: Bug, color: "amber", title: "ব্লাস্ট রোগের সতর্কতা", desc: "আপনার এলাকায় ধানের ব্লাস্ট রোগ ছড়াচ্ছে।", time: "৩ ঘণ্টা আগে", unread: true },
      { icon: TrendingUp, color: "green", title: "মরিচের দাম বেড়েছে", desc: "আজ মরিচের দাম ৮.২% বেড়েছে।", time: "৫ ঘণ্টা আগে", unread: false },
    ],
  },
  {
    label: "গতকাল",
    items: [
      { icon: FlaskConical, color: "violet", title: "সার প্রয়োগের সময়", desc: "ধানের জন্য দ্বিতীয় ইউরিয়া প্রয়োগের সময় এসেছে।", time: "Yesterday", unread: false },
      { icon: Users, color: "green", title: "নতুন বিশেষজ্ঞ যুক্ত", desc: "ড. সালমা আক্তার এখন অনলাইনে উপলব্ধ।", time: "Yesterday", unread: false },
    ],
  },
];

const colorMap: Record<string, string> = {
  sky: "bg-[var(--tile-sky)] text-[var(--icon-sky)]",
  amber: "bg-[var(--tile-amber)] text-[var(--icon-amber)]",
  green: "bg-[var(--tile-green)] text-[var(--icon-green)]",
  violet: "bg-[var(--tile-violet)] text-[var(--icon-violet)]",
};

export default function NotificationsPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader
          icon={Bell}
          title="নোটিস"
          subtitle="সব আপডেট এক জায়গায়"
          actions={
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-secondary">
              <CheckCheck className="h-3.5 w-3.5" /> সব পঠিত
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {groups.map((g) => (
              <div key={g.label}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g.label}</div>
                <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                  {g.items.map((n, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 border-b border-border px-4 py-3.5 last:border-0 ${n.unread ? "bg-[var(--tile-green)]/20" : ""}`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[n.color]}`}>
                        <n.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-[14px] font-semibold text-foreground">{n.title}</div>
                          {n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                        </div>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">{n.desc}</p>
                        <div className="mt-1 text-[11px] text-muted-foreground/80">{n.time}</div>
                        {g.label === "আজ" && i === 0 && (
                          <Link
                            to="/details/$section/$id"
                            params={{ section: "notifications", id: "rain-alert" }}
                            className="mt-2 inline-flex text-[11px] font-bold text-primary hover:underline"
                          >
                            বিস্তারিত সতর্কতা দেখুন
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
