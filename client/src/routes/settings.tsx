import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  KeyRound,
  LoaderCircle,
  LogIn,
  LogOut,
  Phone,
  Settings,
  Sprout,
  User,
  UserPlus,
} from "lucide-react";
import { AppSidebar, PageHeader } from "@/components/app-sidebar";
import {
  useGetUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/store/api";
import {
  clearCurrentUser,
  getCurrentUserId,
  setCurrentUserId,
} from "@/lib/current-user";

export const Route = createFileRoute("/settings")({
  component: AccountPage,
});

function AccountPage() {
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
          icon={Settings}
          title={userId ? "অ্যাকাউন্ট" : "লগইন"}
          subtitle={userId ? "আপনার account ও logout" : "Login অথবা নতুন account তৈরি করুন"}
        />
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-lg space-y-5">
            {feedback && (
              <div
                role="alert"
                className={`rounded-xl border px-4 py-3 text-[13px] font-medium ${
                  feedback.type === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {userId ? (
              <div className="rounded-3xl border border-border bg-white p-4 shadow-sm sm:p-6">
                {isLoading ? (
                  <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tile-green)]">
                        <Sprout className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <div className="text-[18px] font-bold">{user?.name}</div>
                        <div className="text-[13px] text-muted-foreground">{user?.phone}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {user?._count?.conversations ?? 0}টি chat thread
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700"
                    >
                      <LogOut className="h-4 w-4" /> লগআউট
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 grid grid-cols-2 rounded-xl bg-secondary p-1">
                  {(["login", "register"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setMode(item);
                        setFeedback(null);
                      }}
                      className={`rounded-lg py-2 text-[13px] font-semibold ${
                        mode === item
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item === "login" ? "লগইন" : "Signup"}
                    </button>
                  ))}
                </div>

                <form onSubmit={submit} className="space-y-4">
                  {mode === "register" && (
                    <Field icon={User} label="নাম" value={name} onChange={setName} placeholder="আপনার নাম" />
                  )}
                  <Field icon={Phone} label="ফোন নম্বর" value={phone} onChange={setPhone} placeholder="01712345678" />
                  <Field icon={KeyRound} label="Password" value={password} onChange={setPassword} placeholder="কমপক্ষে ৬ অক্ষর" type="password" />
                  <button
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-[13px] font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {submitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : mode === "register" ? (
                      <UserPlus className="h-4 w-4" />
                    ) : (
                      <LogIn className="h-4 w-4" />
                    )}
                    {mode === "register" ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
                  </button>
                </form>
              </div>
            )}

            {!userId && (
              <p className="text-center text-[12px] text-muted-foreground">
                Account ছাড়াও সর্বোচ্চ ৫টি প্রশ্ন করা যাবে। Chat history রাখতে login করুন।
              </p>
            )}
          </div>
        </div>
      </main>
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
      <span className="mb-1.5 block text-[12px] font-semibold">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-border px-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          minLength={type === "password" ? 6 : undefined}
          className="w-full bg-transparent py-3 text-[13px] outline-none"
        />
      </div>
    </label>
  );
}
