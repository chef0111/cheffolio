import { Brand } from '@/components/cheffolio/brand';

export default function AppLoading() {
  return (
    <main className="relative flex h-dvh w-screen flex-col items-center justify-center">
      <Brand className="h-32 -translate-y-8" />
      <p className="text-muted-foreground absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center font-mono text-sm">
        &copy; 2026 cheffolio, built by chef0111
      </p>
    </main>
  );
}
