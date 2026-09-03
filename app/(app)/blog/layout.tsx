export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto h-12 border-x md:max-w-4xl" />
      {children}
    </>
  );
}
