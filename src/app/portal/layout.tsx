import PortalLayoutWrapper from "@/components/portal/PortalLayoutWrapper";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayoutWrapper>{children}</PortalLayoutWrapper>;
}
