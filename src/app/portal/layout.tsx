import PortalLayoutWrapper from "@/components/portal/layout/PortalLayoutWrapper";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayoutWrapper>{children}</PortalLayoutWrapper>;
}
