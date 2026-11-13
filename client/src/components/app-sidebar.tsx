"use client";

import { Link, useNavigate, useRouterState } from "@/lib/router-adapter";
import { useEffect, useState } from "react";
import {
  Sprout,
  Plus,
  MessageSquare,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { ConversationSummary } from "@/store/api";
import { clearCurrentUser, getCurrentUserId } from "@/lib/current-user";

const sidebarNav = [{ icon: MessageSquare, label: "AI চ্যাট", to: "/" }];

export function AppSidebar({
  conversations,
  activeConversationId,
  onNewChat,
}: {
  conversations?: ConversationSummary[];
  activeConversationId?: string;
  onNewChat?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [showDesktopOpenButton, setShowDesktopOpenButton] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getCurrentUserId());
    const handleUserChange = (event: Event) => {
      setLoggedIn(!!(event as CustomEvent<string | null>).detail);
    };
    window.addEventListener("krishok-user-changed", handleUserChange);
    return () => window.removeEventListener("krishok-user-changed", handleUserChange);
  }, []);

  useEffect(() => {
    if (desktopOpen) {
      setShowDesktopOpenButton(false);
      return;
    }
    const timer = window.setTimeout(() => setShowDesktopOpenButton(true), 300);
    return () => window.clearTimeout(timer);
  }, [desktopOpen]);

  const logout = () => {
    clearCurrentUser();
    setLoggedIn(false);
    setMobileOpen(false);
    navigate({ to: "/", search: { thread: undefined } });
  };
  return (
    <>
      <div
        className={`relative hidden shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out md:block ${
          desktopOpen ? "w-[280px]" : "w-0"
        }`}
      >
        <aside
          className={`paper-panel flex h-full w-[280px] flex-col border-r border-border bg-white transition-transform duration-300 ease-in-out ${
            desktopOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Sprout className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="handwritten-title whitespace-nowrap text-[21px] leading-tight text-foreground">
                  Krishok.ai
                </div>
                <div className="mt-0.5 truncate whitespace-nowrap text-[10px] leading-tight text-muted-foreground">
                  কৃষকের ডিজিটাল সহকারী
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDesktopOpen(false)}
              aria-label="Sidebar বন্ধ করুন"
              title="Sidebar বন্ধ করুন"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 pb-5">
            {onNewChat ? (
              <button
                onClick={onNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-[var(--primary-dark)]"
              >
                <Plus className="h-4 w-4" />
                নতুন চ্যাট
              </button>
            ) : (
              <Link
                to="/"
                search={{ thread: undefined }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-[var(--primary-dark)]"
              >
                <Plus className="h-4 w-4" />
                নতুন চ্যাট
              </Link>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
              প্রধান
            </div>
            {sidebarNav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.label}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-[var(--tile-green)] text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      active ? "bg-white/70" : "bg-secondary/70"
                    }`}
                  >
                    <n.icon className="h-4 w-4 shrink-0" />
                  </span>
                  {n.label}
                </Link>
              );
            })}

            {conversations && (
              <div className="mt-6 border-t border-border px-1 pt-5">
                <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
                  সাম্প্রতিক চ্যাট
                </div>
                <div className="space-y-1">
                  {conversations.map((c) => (
                    <Link
                      key={c.id}
                      to="/"
                      search={{ thread: c.id }}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[12px] transition-colors ${
                        activeConversationId === c.id
                          ? "bg-[var(--tile-green)] text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className="truncate pr-2">{c.title}</span>
                      <span className="shrink-0 text-[10px] opacity-70">
                        {formatConversationTime(c.updatedAt)}
                      </span>
                    </Link>
                  ))}
                  {conversations.length === 0 && (
                    <div className="px-2 py-2 text-[11px] text-muted-foreground">
                      এখনও কোনো chat history নেই
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          <div className="shrink-0 border-t border-border p-3">
            {loggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                লগআউট
              </button>
            ) : (
              <Link
                to="/settings"
                className={`flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-[13px] font-semibold transition-colors ${
                  pathname === "/settings"
                    ? "bg-[var(--tile-green)] text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <LogIn className="h-4 w-4 shrink-0" />
                লগইন
              </Link>
            )}
          </div>
        </aside>
      </div>
      {showDesktopOpenButton && (
        <button
          type="button"
          onClick={() => {
            setShowDesktopOpenButton(false);
            setDesktopOpen(true);
          }}
          aria-label="Sidebar খুলুন"
          title="Sidebar খুলুন"
          className="fixed left-3 top-20 z-40 hidden h-10 w-10 animate-in fade-in slide-in-from-left-2 items-center justify-center rounded-xl border border-border bg-white text-foreground shadow-md transition-colors hover:bg-secondary md:flex"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Menu খুলুন"
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground shadow-md md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Menu বন্ধ করুন"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/45"
          />
          <aside className="paper-panel relative flex h-full w-[min(86vw,320px)] flex-col border-r border-border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <div className="handwritten-title text-[20px]">Krishok.ai</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    কৃষকের ডিজিটাল সহকারী
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Sidebar বন্ধ করুন"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  if (onNewChat) onNewChat();
                  else navigate({ to: "/", search: { thread: undefined } });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> নতুন চ্যাট
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
                প্রধান
              </div>
              {sidebarNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold ${
                    pathname === item.to
                      ? "bg-[var(--tile-green)] text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}

              {conversations && conversations.length > 0 && (
                <div className="pt-4">
                  <div className="mb-2 px-2 text-[11px] font-semibold uppercase text-muted-foreground">
                    সাম্প্রতিক চ্যাট
                  </div>
                  {conversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      to="/"
                      search={{ thread: conversation.id }}
                      onClick={() => setMobileOpen(false)}
                      className="block truncate rounded-lg px-2 py-2 text-[12px] text-muted-foreground hover:bg-secondary"
                    >
                      {conversation.title}
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            <div className="border-t border-border p-3">
              {loggedIn ? (
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-red-700"
                >
                  <LogOut className="h-4 w-4" /> লগআউট
                </button>
              ) : (
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-primary"
                >
                  <LogIn className="h-4 w-4" /> লগইন
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("krishok-theme");
    const prefers = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : !!prefers;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("krishok-theme", next ? "dark" : "light");
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-colors hover:bg-accent"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="paper-panel flex min-h-16 shrink-0 items-center justify-between gap-2 border-b-2 border-border bg-white py-3 pl-16 pr-4 sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tile-green)]">
          <Icon className="h-5 w-5" style={{ color: "var(--icon-green)" }} />
        </div>
        <div className="min-w-0">
          <div className="handwritten-title truncate text-[19px] text-foreground">{title}</div>
          {subtitle && (
            <div className="hidden truncate text-[12px] text-muted-foreground sm:block">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-[52%] shrink-0 items-center gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}

function formatConversationTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("bn-BD", { month: "short", day: "numeric" });
}
