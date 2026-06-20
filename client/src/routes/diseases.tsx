import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { Bug, Camera, Upload, ScanLine, AlertTriangle, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/diseases")({
  head: () => ({
    meta: [
      { title: "রোগ ও প্রতিকার — Krishok.ai" },
      { name: "description", content: "ফসলের রোগ চিনুন, লক্ষণ ও চিকিৎসা পদ্ধতি জানুন।" },
    ],
  }),
  component: DiseasesPage,
});

const diseases = [
  { name: "ধানের ব্লাস্ট", crop: "ধান", severity: "উচ্চ", img: "https://images.unsplash.com/photo-1649088311431-9ffe92a4d4a4?w=600&q=80", desc: "পাতায় লম্বাটে বাদামী দাগ ও মাঝে ছাই রঙ।" },
  { name: "ধানের বাদামী দাগ", crop: "ধান", severity: "মাঝারি", img: "https://images.unsplash.com/photo-1758047920248-839ca7256a5c?w=600&q=80", desc: "ছোট ছোট গোল বাদামী দাগ পাতা জুড়ে।" },
  { name: "টমেটো লিফ কার্ল", crop: "টমেটো", severity: "উচ্চ", img: "https://images.unsplash.com/photo-1723580864433-b6b95a6d8393?w=600&q=80", desc: "পাতা কুঁকড়ে যায় ও বৃদ্ধি থেমে যায়।" },
  { name: "পাউডারি মিলডিউ", crop: "লাউ/কুমড়া", severity: "মাঝারি", img: "https://images.unsplash.com/photo-1725369865690-5a1a09f87e56?w=600&q=80", desc: "পাতায় সাদা পাউডারের মতো আবরণ।" },
  { name: "আলুর লেট ব্লাইট", crop: "আলু", severity: "উচ্চ", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80", desc: "পাতা ও কাণ্ডে কালো ভেজা দাগ।" },
  { name: "মরিচের অ্যানথ্রাকনোজ", crop: "মরিচ", severity: "মাঝারি", img: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=80", desc: "ফলে গাঢ় গোলাকার বসা দাগ।" },
];

const severityColor: Record<string, string> = {
  "উচ্চ": "bg-red-50 text-red-700 border-red-200",
  "মাঝারি": "bg-amber-50 text-amber-700 border-amber-200",
  "নিম্ন": "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const diseaseDetailIds: Record<number, string> = {
  0: "rice-blast",
  2: "tomato-leaf-curl",
};

function DiseasesPage() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex flex-1 flex-col min-w-0">
        <PageHeader icon={Bug} title="রোগ ও প্রতিকার" subtitle="AI দিয়ে রোগ সনাক্ত করুন ও চিকিৎসা জানুন" />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* AI Scan card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="grid gap-0 md:grid-cols-[1fr_auto]">
              <div className="p-4 sm:p-6">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--tile-green)] px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <ScanLine className="h-3 w-3" /> AI স্ক্যানার
                </div>
                <h2 className="mb-1.5 text-[18px] font-bold text-foreground">পাতার ছবি তুলে রোগ চিনুন</h2>
                <p className="mb-4 text-[13px] text-muted-foreground">
                  আক্রান্ত পাতার পরিষ্কার ছবি আপলোড করুন—AI কয়েক সেকেন্ডে রোগ চিহ্নিত করে চিকিৎসা সুপারিশ দেবে।
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-dark)]">
                    <Camera className="h-4 w-4" /> ছবি তুলুন
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary">
                    <Upload className="h-4 w-4" /> ছবি আপলোড
                  </button>
                </div>
              </div>
              <div className="hidden md:block w-64 bg-[var(--tile-green)]/40 p-6">
                <div className="flex h-full items-center justify-center">
                  <div className="grid h-32 w-32 place-items-center rounded-3xl border-2 border-dashed border-primary/40 bg-white">
                    <ScanLine className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-foreground">সাধারণ রোগসমূহ</h3>
            <span className="text-[12px] text-muted-foreground">{diseases.length} টি রোগ</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diseases.map((d, index) => (
              <div key={d.name} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                  <span className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${severityColor[d.severity]}`}>
                    <AlertTriangle className="h-3 w-3" /> {d.severity}
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{d.crop}</div>
                  <div className="mb-1.5 text-[15px] font-bold text-foreground">{d.name}</div>
                  <p className="mb-3 line-clamp-2 text-[12px] text-muted-foreground">{d.desc}</p>
                  <Link
                    to={diseaseDetailIds[index] ? "/details/$section/$id" : "/diseases"}
                    params={
                      diseaseDetailIds[index]
                        ? { section: "diseases", id: diseaseDetailIds[index] }
                        : undefined
                    }
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
                  >
                    চিকিৎসা দেখুন <ChevronRight className="h-3.5 w-3.5" />
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
