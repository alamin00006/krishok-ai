"use client";

import { Link } from "@/lib/router-adapter";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { Users, Phone, MessageSquare, Star, Verified, Video } from "lucide-react";

const experts = [
  { name: "ড. আব্দুর রহমান", role: "ধান ও শস্য বিশেষজ্ঞ", exp: "১৫+ বছর", rating: 4.9, reviews: 1240, online: true, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
  { name: "ড. সালমা আক্তার", role: "উদ্ভিদ রোগ বিশেষজ্ঞ", exp: "১২ বছর", rating: 4.8, reviews: 980, online: true, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "কৃষিবিদ মাহফুজ", role: "সবজি ও উদ্যান বিশেষজ্ঞ", exp: "১০ বছর", rating: 4.7, reviews: 760, online: false, img: "https://images.unsplash.com/photo-1559548331-f9cb98280344?w=400&q=80" },
  { name: "ড. ফারহানা ইসলাম", role: "মাটি ও সার বিশেষজ্ঞ", exp: "১৪ বছর", rating: 4.9, reviews: 1100, online: true, img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
];
const expertDetailIds = ["dr-abdur-rahman", "dr-salma-akter"];

export default function ExpertsPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader icon={Users} title="বিশেষজ্ঞের সাথে কথা" subtitle="সরাসরি কৃষি বিশেষজ্ঞদের পরামর্শ নিন" />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* Hero */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-[var(--tile-green)] via-white to-[var(--tile-sky)] p-4 sm:p-6">
            <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">প্রথম পরামর্শ ফ্রি!</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">২৪/৭ অভিজ্ঞ কৃষি বিশেষজ্ঞদের কাছ থেকে সমাধান পান—চ্যাট, কল বা ভিডিওতে।</p>
              </div>
              <button className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-[var(--primary-dark)]">
                এখনই শুরু করুন
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-foreground">উপলব্ধ বিশেষজ্ঞরা</h3>
            <span className="text-[12px] text-muted-foreground">{experts.filter(e => e.online).length} জন অনলাইন</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {experts.map((e, index) => (
              <div key={e.name} className="rounded-2xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img src={e.img} alt={e.name} className="h-16 w-16 rounded-2xl object-cover" />
                    {e.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="truncate text-[15px] font-bold text-foreground">{e.name}</div>
                      <Verified className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <div className="truncate text-[12px] text-muted-foreground">{e.role}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <strong className="text-foreground">{e.rating}</strong> ({e.reviews})
                      </span>
                      <span>অভিজ্ঞতা: {e.exp}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--tile-green)] px-2 py-2 text-[12px] font-semibold text-primary hover:bg-[var(--tile-green)]/80">
                    <MessageSquare className="h-3.5 w-3.5" /> চ্যাট
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-white px-2 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">
                    <Phone className="h-3.5 w-3.5" /> কল
                  </button>
                  <button className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-white px-2 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary">
                    <Video className="h-3.5 w-3.5" /> ভিডিও
                  </button>
                </div>
                {expertDetailIds[index] && (
                  <Link
                    to="/details/$section/$id"
                    params={{ section: "experts", id: expertDetailIds[index] }}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-3 py-2 text-[12px] font-semibold text-primary hover:bg-[var(--tile-green)]"
                  >
                    সম্পূর্ণ প্রোফাইল দেখুন
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
