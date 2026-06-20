"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

type NavigateOptions = {
  to?: string;
  search?: Record<string, unknown>;
  replace?: boolean;
};

function buildHref(
  to: string,
  params?: Record<string, string>,
  search?: Record<string, unknown>,
) {
  let path = to
    .replace("$section", params?.section ?? "")
    .replace("$id", params?.id ?? "");
  const query = new URLSearchParams();
  Object.entries(search ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString();
  if (suffix) path += `?${suffix}`;
  return path;
}

export function Link({
  to,
  params,
  search,
  children,
  ...props
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  children: ReactNode;
} & Omit<ComponentProps<typeof NextLink>, "href">) {
  return (
    <NextLink href={buildHref(to, params, search)} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate(_options?: unknown) {
  const router = useRouter();
  const pathname = usePathname();
  return async (options: NavigateOptions) => {
    const href = buildHref(options.to ?? pathname, undefined, options.search);
    if (options.replace) router.replace(href);
    else router.push(href);
  };
}

export function useRouterState<T>({
  select,
}: {
  select: (state: { location: { pathname: string } }) => T;
}) {
  return select({ location: { pathname: usePathname() } });
}
