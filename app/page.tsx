import { Header } from '@/modules/navbar';
import { HeroSection } from '@/modules/hero';
import { LogosSection } from '@/modules/hero/logos-section';
import IntegrationsSection from '@/modules/integration';
import { cn } from '@/lib/utils';

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
      <Header />
      <main
        className={cn(
          'relative mx-auto max-w-4xl grow',
          'before:bg-border before:absolute before:-inset-y-14 before:-left-px before:w-px',
          'after:bg-border after:absolute after:-inset-y-14 after:-right-px after:w-px'
        )}
      >
        <HeroSection />
        <LogosSection />
        <IntegrationsSection />
      </main>
    </div>
  );
}
