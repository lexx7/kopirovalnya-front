import "./admin.css";
import { AuthProvider } from "@/lib/admin/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="admin-root">{children}</div>
    </AuthProvider>
  );
}
