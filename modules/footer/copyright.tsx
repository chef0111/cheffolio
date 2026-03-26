'use client';

export function FooterCopyright() {
  return (
    <p className="text-muted-foreground text-center font-mono text-sm">
      &copy; {new Date().getFullYear()} Cheffolio, built by{' '}
      <a
        href="https://github.com/chef0111"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-color underline underline-offset-4"
      >
        Chef0111
      </a>
    </p>
  );
}
