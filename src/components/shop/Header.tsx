import { LockClosedIcon } from "@heroicons/react/24/outline";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="font-display text-base font-bold tracking-tight">A MÁQUINA</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <LockClosedIcon className="h-3.5 w-3.5" />
          Pagamento seguro
        </span>
      </div>
    </header>
  );
}
