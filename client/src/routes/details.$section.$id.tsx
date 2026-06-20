"use client";

import { useParams } from "next/navigation";
import { Link } from "@/lib/router-adapter";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Bug,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  MessageSquare,
  Phone,
  ShieldAlert,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { useGetContentDetailQuery } from "@/store/api";

const sectionMeta = {
  crops: { title: "ফসলের বিস্তারিত গাইড", icon: BookOpen, back: "/crops" },
  diseases: { title: "রোগ ও প্রতিকার", icon: Bug, back: "/diseases" },
  market: { title: "বাজার বিশ্লেষণ", icon: TrendingUp, back: "/market" },
  experts: { title: "বিশেষজ্ঞ প্রোফাইল", icon: Users, back: "/experts" },
  weather: { title: "কৃষি আবহাওয়া", icon: CloudSun, back: "/weather" },
  notifications: { title: "সতর্কতার বিস্তারিত", icon: Bell, back: "/notifications" },
} as const;

export default function ContentDetailsPage() {
  const { section, id } = useParams<{ section: string; id: string }>();
  const meta = sectionMeta[section as keyof typeof sectionMeta] ?? {
    title: "বিস্তারিত",
    icon: BookOpen,
    back: "/",
  };
  const { data, isLoading, isError, refetch } = useGetContentDetailQuery({ section, id });

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          icon={meta.icon}
          title={meta.title}
          subtitle="Backend API থেকে লোড করা বাস্তবসম্মত demo data"
          actions={
            <Link
              to={meta.back}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-[12px] font-semibold text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> ফিরে যান
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {isLoading && <DetailsSkeleton />}

          {isError && (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="text-[16px] font-bold text-red-700">তথ্য লোড করা যায়নি</div>
              <p className="mt-1 text-[13px] text-red-700/80">
                Backend server চালু আছে এবং NEXT_PUBLIC_API_URL সঠিক কিনা দেখুন।
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          {data && (
            <div className="mx-auto max-w-5xl space-y-5">
              <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="order-2 p-5 sm:p-7 lg:order-1">
                    <span className="inline-flex rounded-full bg-[var(--tile-green)] px-3 py-1 text-[11px] font-bold text-primary">
                      {data.category}
                    </span>
                    <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {data.name}
                    </h1>
                    <p className="mt-3 max-w-2xl text-[14px] leading-7 text-muted-foreground">
                      {data.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {data.season && <Pill icon={CalendarDays} text={data.season} />}
                      {data.duration && <Pill icon={CalendarDays} text={data.duration} />}
                      {data.price && <Pill icon={TrendingUp} text={data.price} />}
                      {data.change && <Pill icon={TrendingUp} text={data.change} />}
                      {data.severity && <Pill icon={ShieldAlert} text={`ঝুঁকি: ${data.severity}`} />}
                    </div>

                    {section === "experts" && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <ActionButton icon={MessageSquare} label="চ্যাট করুন" primary />
                        <ActionButton icon={Phone} label="কল করুন" />
                        <ActionButton icon={Video} label="ভিডিও পরামর্শ" />
                      </div>
                    )}
                  </div>
                  <div className="order-1 min-h-64 bg-secondary lg:order-2">
                    <img src={data.image} alt={data.name} className="h-full min-h-64 w-full object-cover" />
                  </div>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-3">
                {data.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className="mt-1 text-[17px] font-black text-foreground">{stat.value}</div>
                  </div>
                ))}
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                {data.sections.map((block, index) => (
                  <article
                    key={block.title}
                    className={`rounded-2xl border border-border bg-white p-5 shadow-sm ${
                      data.sections.length % 2 === 1 && index === data.sections.length - 1
                        ? "lg:col-span-2"
                        : ""
                    }`}
                  >
                    <h2 className="text-[16px] font-bold text-foreground">{block.title}</h2>
                    <ul className="mt-3 space-y-2.5">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-[13px] leading-6 text-muted-foreground">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>

              <section className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <div className="text-[13px] font-bold">গুরুত্বপূর্ণ নোট</div>
                  <p className="mt-0.5 text-[12px] leading-5 text-amber-900/80">{data.alert}</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Pill({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-[11px] font-semibold text-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" /> {text}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  primary,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-semibold ${
        primary
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-white text-foreground hover:bg-secondary"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-5">
      <div className="h-80 rounded-3xl bg-secondary" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-24 rounded-2xl bg-secondary" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-52 rounded-2xl bg-secondary" />
        <div className="h-52 rounded-2xl bg-secondary" />
      </div>
    </div>
  );
}
