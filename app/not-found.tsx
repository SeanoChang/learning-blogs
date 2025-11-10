import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-6xl font-semibold tracking-tight">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>
    </Container>
  );
}
