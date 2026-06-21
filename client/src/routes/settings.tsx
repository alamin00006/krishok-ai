"use client";

import { useNavigate } from "@/lib/router-adapter";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  History,
  KeyRound,
  LoaderCircle,
  LogIn,
  LogOut,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  Sprout,
  User,
  UserPlus,
} from "lucide-react";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import { useGetUserQuery, useLoginUserMutation, useRegisterUserMutation } from "@/store/api";
import { clearCurrentUser, getCurrentUserId, setCurrentUserId } from "@/lib/current-user";

export default function AccountPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { data: user, isLoading } = useGetUserQuery(userId ?? "", {
    skip: !userId,
  });
  const [registerUser, registerState] = useRegisterUserMutation();
  const [loginUser, loginState] = useLoginUserMutation();
  const submitting = registerState.isLoading || loginState.isLoading;

  useEffect(() => setUserId(getCurrentUserId()), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    try {
      const account =
        mode === "register"
          ? await registerUser({ name, phone, password }).unwrap()
          : await loginUser({ phone, password }).unwrap();
      setCurrentUserId(account.id);
      setUserId(account.id);
      setPassword("");
      setFeedback({
        type: "success",
        message: mode === "register" ? "অ্যাকাউন্ট তৈরি হয়েছে।" : "লগইন সফল হয়েছে।",
      });
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      setFeedback({
        type: "error",
        message: apiError.data?.message ?? "অনুরোধটি সম্পন্ন করা যায়নি।",
      });
    }
  };

  const logout = () => {
    clearCurrentUser();
    setUserId(null);
    setFeedback({
      type: "success",
      message: "লগআউট হয়েছে। Guest হিসেবে সর্বোচ্চ ৫টি প্রশ্ন করতে পারবেন।",
    });
    navigate({ to: "/", search: { thread: undefined } });
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          icon={User}
          title={userId ? "আমার অ্যাকাউন্ট" : "আপনার অ্যাকাউন্ট"}
          subtitle={userId ? "প্রোফাইল ও সংরক্ষিত কথোপকথন" : "লগইন করুন অথবা নতুন অ্যাকাউন্ট খুলুন"}
        />
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8 ">
          <div className="mx-auto max-w-5xl">
            {userId ? (
              <ProfileCard
                user={user}
                loading={isLoading}
                onChat={() => navigate({ to: "/", search: { thread: undefined } })}
                onLogout={logout}
              />
            ) : (
              <div className="overflow-hidden rounded-[30px] border border-border bg-white shadow-[0_18px_60px_rgba(22,68,42,0.10)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
                <section className="relative overflow-hidden bg-(--tile-green) p-6 sm:p-8 lg:p-10">
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-24 border-primary/5" />
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                      <Sprout className="h-7 w-7 text-primary" />
                    </div>
                    <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.18em] text-primary">
                      Krishok.ai
                    </p>
                    <h1 className="handwritten-title mt-2 max-w-sm text-[28px] leading-tight text-foreground sm:text-[34px]">
                      আপনার কৃষি আলোচনা, আপনার সাথেই থাকুক
                    </h1>
                    <p className="mt-4 max-w-sm text-[13px] leading-6 text-muted-foreground">
                      লগইন করলে আগের প্রশ্ন, AI-এর উত্তর এবং প্রতিটি চ্যাট নিরাপদে সংরক্ষিত থাকবে।
                    </p>
                    <div className="mt-8 space-y-4">
                      <Benefit
                        icon={MessageCircleMore}
                        text="আগের আলোচনা যেখানে শেষ হয়েছিল, সেখান থেকেই শুরু করুন"
                      />
                      <Benefit icon={History} text="সব চ্যাট একটি জায়গায় সহজে খুঁজে পান" />
                      <Benefit icon={ShieldCheck} text="শুধু ফোন নম্বর ও পাসওয়ার্ডেই সহজ প্রবেশ" />
                    </div>
                  </div>
                </section>

                <section className="p-5 sm:p-8 lg:p-10">
                  <div className="mb-7">
                    <h2 className="text-[22px] font-bold text-foreground">
                      {mode === "login" ? "স্বাগতম" : "নতুন অ্যাকাউন্ট খুলুন"}
                    </h2>
                    <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
                      {mode === "login"
                        ? "আপনার সংরক্ষিত কৃষি আলোচনায় ফিরে যান।"
                        : "এক মিনিটেই অ্যাকাউন্ট তৈরি করে শুরু করুন।"}
                    </p>
                    {feedback && (
                      <div
                        role="alert"
                        className={`mt-3 rounded-2xl border px-4 py-3 text-[13px] font-medium ${
                          feedback.type === "error"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {feedback.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex gap-6 border-b border-border">
                    {(["login", "register"] as const).map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          setMode(item);
                          setFeedback(null);
                        }}
                        className={`relative px-1 pb-3 text-[13px] font-bold transition-colors ${
                          mode === item
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item === "login" ? "লগইন" : "অ্যাকাউন্ট তৈরি"}
                        {mode === item && (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={submit} className="space-y-4">
                    {mode === "register" && (
                      <Field
                        icon={User}
                        label="আপনার নাম"
                        value={name}
                        onChange={setName}
                        placeholder="যেমন: আব্দুল করিম"
                      />
                    )}
                    <Field
                      icon={Phone}
                      label="ফোন নম্বর"
                      value={phone}
                      onChange={setPhone}
                      placeholder="01700000000"
                    />
                    <Field
                      icon={KeyRound}
                      label="পাসওয়ার্ড"
                      value={password}
                      onChange={setPassword}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      type="password"
                    />
                    <button
                      disabled={submitting}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-[13px] font-bold text-primary-foreground transition-all disabled:opacity-60"
                    >
                      {submitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : mode === "register" ? (
                        <UserPlus className="h-4 w-4" />
                      ) : (
                        <LogIn className="h-4 w-4" />
                      )}
                      {mode === "register" ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
                      {!submitting && (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  </form>
                  <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">
                    অ্যাকাউন্ট ছাড়াও সর্বোচ্চ ৫টি প্রশ্ন করতে পারবেন।
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileCard({
  user,
  loading,
  onChat,
  onLogout,
}: {
  user?: {
    name: string;
    phone: string;
    _count?: { conversations: number };
  };
  loading: boolean;
  onChat: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-[28px] border border-border bg-white p-5 shadow-sm sm:p-7">
      {loading ? (
        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {user?.name?.trim().charAt(0) || "ক"}
            </div>
            <div className="min-w-0">
              <div className="handwritten-title truncate text-[22px] text-foreground">
                {user?.name}
              </div>
              <div className="mt-1 text-[13px] text-muted-foreground">{user?.phone}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--tile-green)] px-3 py-1 text-[11px] font-semibold text-primary">
                <History className="h-3.5 w-3.5" />
                {user?._count?.conversations ?? 0}টি সংরক্ষিত চ্যাট
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-secondary/70 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <div className="text-[13px] font-bold text-foreground">
                  আপনার আলোচনা সংরক্ষিত আছে
                </div>
                <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                  যেকোনো সময় ফিরে এসে আগের কৃষি আলোচনা থেকে আবার শুরু করতে পারবেন।
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onChat}
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-bold text-primary-foreground transition-all hover:brightness-95"
          >
            <MessageCircleMore className="h-4 w-4" />
            চ্যাটে যান
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" /> লগআউট
          </button>
        </>
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-bold text-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/55 px-3.5 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
        <Icon className="h-4 w-4 text-primary" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          minLength={type === "password" ? 6 : undefined}
          className="w-full bg-transparent py-3.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}

function Benefit({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/70 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="pt-1 text-[12px] leading-5 text-foreground/80">{text}</p>
    </div>
  );
}
