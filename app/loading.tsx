import { Brand } from '@/components/cheffolio/brand';

export default function AppLoading() {
  return (
    <main className="relative flex h-dvh w-screen flex-col items-center justify-center">
      <Brand className="h-32 -translate-y-8" />
      <footer className="text-muted-foreground font-pixel-square absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center text-sm">
        &copy; 2026 giabao.dev, built by chef0111
      </footer>
    </main>
  );
}
