import { requireOperator } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { AdminHeader, AdminMain } from "@/components/admin/AdminChrome";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Hours & contact", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  await requireOperator();
  const settings = await getSettings();

  return (
    <>
      <AdminHeader title="Hours & contact" back={{ href: "/admin", label: "Back" }} />
      <AdminMain>
        <SettingsForm settings={settings} />
      </AdminMain>
    </>
  );
}
