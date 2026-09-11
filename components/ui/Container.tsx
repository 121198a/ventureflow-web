export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={"mx-auto w-full px-5 " + className}>{children}</div>;
}
