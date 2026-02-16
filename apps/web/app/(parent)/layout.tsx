/**
 * Parent area layout. Route group (parent) — no URL segment.
 * Guards and nav can be added here when parent auth is implemented.
 */
export default function ParentGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
