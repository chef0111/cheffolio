export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full flex-1 flex-col md:max-w-4xl">
      {children}
    </div>
  );
}
