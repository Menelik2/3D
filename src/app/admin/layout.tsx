import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin | META Pictures",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
