import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sprout,
  Send,
  ImagePlus,
  Mic,
  ThumbsUp,
  ThumbsDown,
  CheckCheck,
  Verified,
  MessageCircleQuestion,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { AppSidebar, ThemeToggle } from "@/components/app-sidebar";
import {
  useCreateConversationMutation,
  useCreateGuestQuestionMutation,
  useGetConversationQuery,
  useGetConversationsQuery,
  useGetGuestQuestionsQuery,
  useGetUserQuery,
  useSendConversationMessageMutation,
} from "@/store/api";
import { clearCurrentUser, getCurrentUserId, getGuestId } from "@/lib/current-user";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    thread: typeof search.thread === "string" ? search.thread : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Krishok.ai — AI কৃষক সহকারী" },
      {
        name: "description",
        content: "ফসলের রোগ, সার, সেচ, আবহাওয়া ও বাজারদর সম্পর্কে সহজ বাংলায় সঠিক পরামর্শ নিন।",
      },
    ],
  }),
  component: ChatPage,
});

/* ─── Assistant avatar ─── */
function AssistantAvatar({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-[var(--tile-green)]`}
    >
      <Sprout className="h-[60%] w-[60%]" style={{ color: "var(--icon-green)" }} />
    </div>
  );
}

/* ─── Chat page ─── */
function ChatPage() {
  const { thread } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [userId, setUserId] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [guestId, setGuestId] = useState("");
  const { data: currentUser } = useGetUserQuery(userId ?? "", {
    skip: !userId,
  });
  const { data: conversations = [] } = useGetConversationsQuery(userId ?? "", {
    skip: !userId,
  });
  const { data: conversation, isLoading } = useGetConversationQuery(
    { id: thread ?? "", userId: userId ?? "" },
    { skip: !thread || !userId },
  );
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage, { isLoading: isSending }] = useSendConversationMessageMutation();
  const { data: guestData, isLoading: isGuestLoading } = useGetGuestQuestionsQuery(guestId, {
    skip: !!userId || !guestId,
  });
  const [sendGuestQuestion, { isLoading: isGuestSending }] = useCreateGuestQuestionMutation();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const ordered = userId ? (conversation?.questions ?? []) : (guestData?.questions ?? []);
  const sending = isSending || isGuestSending;
  const loading = userId ? isLoading : isGuestLoading;

  useEffect(() => {
    setUserId(getCurrentUserId());
    setGuestId(getGuestId());
  }, []);

  useEffect(() => {
    const handleUserChange = (event: Event) => {
      const nextUserId = (event as CustomEvent<string | null>).detail;
      setUserId(nextUserId);
      if (!nextUserId) navigate({ search: { thread: undefined }, replace: true });
    };
    window.addEventListener("krishok-user-changed", handleUserChange);
    return () => window.removeEventListener("krishok-user-changed", handleUserChange);
  }, [navigate]);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ordered.length, sending]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const submittedImage = image;
    setErrorMsg(null);
    setPendingText(trimmed);
    setText("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    try {
      if (userId) {
        let conversationId = thread;
        if (!conversationId) {
          const created = await createConversation({
            userId,
            title: trimmed,
          }).unwrap();
          conversationId = created.id;
          await navigate({ search: { thread: created.id }, replace: true });
        }
        await sendMessage({
          conversationId,
          userId,
          text: trimmed,
          image: submittedImage,
        }).unwrap();
      } else {
        await sendGuestQuestion({
          guestId,
          text: trimmed,
          image: submittedImage,
        }).unwrap();
      }
      setPendingText(null);
    } catch (err) {
      console.error("Failed to send question", err);
      setText((current) => current || trimmed);
      setImage((current) => current ?? submittedImage);
      setPendingText(null);
      const apiError = err as { status?: number; data?: { message?: string } };
      setErrorMsg(
        apiError.status === 403
          ? "Guest হিসেবে ৫টি প্রশ্নের সীমা শেষ। আরও প্রশ্ন করতে account তৈরি বা login করুন।"
          : (apiError.data?.message ?? "সার্ভারে সংযোগ করা যাচ্ছে না।"),
      );
    }
  };

  const handleNewChat = () => {
    setText("");
    setImage(null);
    setErrorMsg(null);
    navigate({ search: { thread: undefined }, replace: false });
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUserId(null);
    setProfileMenuOpen(false);
    navigate({ search: { thread: undefined }, replace: true });
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(
        "এই browser-এ voice input support নেই। Chrome বা Edge-এর সর্বশেষ version ব্যবহার করুন।",
      );
      return;
    }

    setErrorMsg(null);
    const recognition = new SpeechRecognition();
    recognition.lang = "bn-BD";
    recognition.continuous = false;
    recognition.interimResults = true;
    let finalTranscript = "";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }
      const spokenText = `${finalTranscript}${interimTranscript}`.trim();
      if (spokenText) setText(spokenText);
    };
    recognition.onerror = (event) => {
      const messages: Record<string, string> = {
        "not-allowed": "Microphone permission দেওয়া হয়নি। Browser settings থেকে permission দিন।",
        "audio-capture": "কোনো microphone পাওয়া যায়নি।",
        "no-speech": "কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।",
        network: "Voice recognition service-এ সংযোগ করা যায়নি।",
      };
      setErrorMsg(messages[event.error] ?? "Voice input নেওয়া যায়নি। আবার চেষ্টা করুন।");
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#f6f7f9]">
      <AppSidebar
        conversations={conversations}
        activeConversationId={thread}
        onNewChat={handleNewChat}
      />

      {/* ── Main chat area ── */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="paper-panel flex min-h-16 shrink-0 items-center justify-between gap-2 border-b-2 border-border bg-white px-3 py-2 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <AssistantAvatar className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <div className="handwritten-title flex items-center gap-1.5 text-[18px] text-foreground">
                <span className="truncate">{conversation?.title ?? "Krishok.ai Assistant"}</span>
                <Verified className="h-4 w-4 shrink-0 text-primary" />
              </div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">
                আপনার কৃষি সহকারী • সবসময় আপনার পাশে
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ThemeToggle />
            {userId ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-2 py-1.5 text-left hover:bg-secondary"
                  aria-expanded={profileMenuOpen}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                    {currentUser?.name?.trim().charAt(0) || "U"}
                  </span>
                  <span className="hidden max-w-32 truncate text-[12px] font-semibold text-foreground sm:block">
                    {currentUser?.name ?? "User"}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                    <div className="border-b border-border px-4 py-3">
                      <div className="truncate text-[13px] font-bold text-foreground">
                        {currentUser?.name}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {currentUser?.phone}
                      </div>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[12px] text-foreground hover:bg-secondary"
                    >
                      <LogIn className="h-4 w-4" /> অ্যাকাউন্ট
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> লগআউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-2.5 py-2 text-[12px] font-semibold text-primary-foreground sm:gap-2 sm:px-3"
              >
                <LogIn className="h-4 w-4" /> লগইন
              </Link>
            )}
          </div>
        </header>

        {/* Chat messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
          {loading && (
            <div className="text-center text-[12px] text-muted-foreground">লোড হচ্ছে...</div>
          )}

          {!loading && ordered.length === 0 && (
            <div className="mt-10 flex flex-col items-center justify-center text-center">
              <AssistantAvatar className="h-14 w-14" />
              <div className="handwritten-title mt-3 text-[24px] text-foreground">স্বাগতম! 👋</div>
              <p className="mt-1 max-w-md text-[13px] text-muted-foreground">
                আপনি কি ফসলের রোগ, পোকামাকড়, সার ব্যবস্থাপনা, সেচ, বীজ নির্বাচন বা কৃষি প্রযুক্তি
                নিয়ে জানতে চান?
              </p>
              <p className="mt-1 max-w-md text-[13px] font-bold">
                প্রশ্ন লিখুন, সমাধান জানুন — স্মার্ট কৃষির পাশে Krishok.ai।
              </p>
              {!userId && (
                <>
                  {/* <div className="mt-3 text-[12px] font-semibold text-primary">
                    Guest প্রশ্ন বাকি: {guestData?.remaining ?? 5}/{guestData?.limit ?? 5}
                  </div> */}
                  <Link
                    to="/settings"
                    className="mt-4 rounded-xl bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground"
                  >
                    Account তৈরি বা login করুন
                  </Link>
                </>
              )}
            </div>
          )}

          {ordered.map((q) => (
            <div key={q.id}>
              {/* User bubble */}
              <div className="mb-4 flex justify-end">
                <div className="max-w-[90%] sm:max-w-[75%]">
                  <div className="note-bubble-user bg-[var(--tile-green)] px-5 py-3.5 text-[14px] leading-relaxed text-foreground whitespace-pre-wrap">
                    {q.text}
                  </div>
                  {q.imageUrl && (
                    <div className="mt-2 flex justify-end">
                      <img
                        src={q.imageUrl}
                        alt="upload"
                        className="h-32 w-32 rounded-xl object-cover"
                      />
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
                    {formatTime(q.createdAt)}
                    <CheckCheck className="h-3 w-3 text-primary" />
                  </div>
                </div>
              </div>

              {/* Assistant bubble */}
              {q.aiAnswer && (
                <div className="mb-6 flex justify-start">
                  <div className="max-w-[96%] sm:max-w-[80%]">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AssistantAvatar className="mt-0.5 h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
                      <div className="note-bubble-ai overflow-hidden border border-border bg-card text-card-foreground">
                        <div className="px-4 py-3.5 text-[14px] leading-relaxed text-card-foreground whitespace-pre-wrap sm:px-5 sm:py-4">
                          {q.aiAnswer}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 sm:px-5">
                          <span className="hidden text-[12px] text-muted-foreground sm:inline">
                            এই উত্তরটি কেমন হলো?
                          </span>
                          <div className="flex items-center gap-2">
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {formatTime(q.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {pendingText && (
            <div className="mb-4 flex justify-end">
              <div className="max-w-[90%] sm:max-w-[75%]">
                <div className="note-bubble-user bg-[var(--tile-green)] px-5 py-3.5 text-[14px] leading-relaxed text-foreground">
                  {pendingText}
                </div>
                <div className="mt-1 text-right text-[11px] text-muted-foreground">
                  পাঠানো হচ্ছে...
                </div>
              </div>
            </div>
          )}

          {sending && (
            <div className="mb-6 flex justify-start">
              <div className="flex items-center gap-3">
                <AssistantAvatar className="h-8 w-8" />
                <div className="note-bubble-ai flex items-center gap-1 border border-border bg-card px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom area ── */}
        <div className="paper-panel shrink-0 border-t-2 border-border bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto flex max-w-3xl items-end">
            {/* Input */}
            <div className="flex-1">
              {errorMsg && (
                <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                  ⚠️ {errorMsg}
                </div>
              )}
              {image && (
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-2 py-1 text-[11px] text-foreground">
                  <ImagePlus className="h-3 w-3" /> {image.name}
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className="sketch-surface border border-border bg-background p-2 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <input
                  type="text"
                  placeholder="আপনার কৃষি সমস্যা লিখুন..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={sending}
                  className="block w-full rounded-xl bg-transparent px-2 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none sm:px-3"
                />
                <div className="mt-1 flex items-center justify-end gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    aria-label="ছবি আপলোড"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">ছবি আপলোড</span>
                  </button>
                  <button
                    type="button"
                    aria-label="ভয়েস ইনপুট"
                    aria-pressed={isListening}
                    onClick={handleVoiceInput}
                    disabled={sending}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium transition-colors ${
                      isListening
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Mic className={`h-3.5 w-3.5 ${isListening ? "animate-pulse" : ""}`} />
                    <span className="hidden sm:inline">
                      {isListening ? "শুনছি... থামান" : "ভয়েস ইনপুট"}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="পাঠান"
                    onClick={handleSend}
                    disabled={sending || !text.trim()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-[var(--primary-dark)]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-2 hidden max-w-3xl text-center text-[11px] leading-relaxed text-muted-foreground sm:block">
            Krishok.ai কখনোই 100% নিখুঁততা দিতে পারে না। এটি AI-ভিত্তিক পরামর্শ, চূড়ান্ত সিদ্ধান্ত
            নেওয়ার আগে কৃষি বিশেষজ্ঞের পরামর্শ নিন।
          </div>
        </div>
      </main>
    </div>
  );
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: { transcript: string } | undefined;
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}
