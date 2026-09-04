export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto border-x pt-24 md:max-w-4xl">{children}</div>;
}
