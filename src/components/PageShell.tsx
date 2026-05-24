import { Nav } from "./Nav";

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageShell({
  children,
  title,
  subtitle,
  action,
}: PageShellProps) {
  return (
    <>
      <main className="page-shell mx-auto w-full max-w-lg">
        {(title || action) && (
          <header className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 break-words text-sm text-zinc-500">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
        )}
        {children}
      </main>
      <Nav />
    </>
  );
}
