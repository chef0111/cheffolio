export default function AppLayoutWide({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="layout-wide"
      className="container mx-auto flex w-full flex-1 flex-col"
    >
      {children}
    </div>
  );
}
