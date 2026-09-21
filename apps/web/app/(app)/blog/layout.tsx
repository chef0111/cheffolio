export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex w-full flex-1 flex-col">{children}</div>;
}
