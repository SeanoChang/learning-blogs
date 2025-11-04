export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Tailwind CSS, and minimal design principles.
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
