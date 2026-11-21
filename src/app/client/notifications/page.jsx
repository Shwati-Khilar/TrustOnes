import NotificationHero from "@/components/client/NotificationContents/NotificationHero";
import NotificationStats from "@/components/client/NotificationContents/NotificationStats";
import NotificationCenter from "@/components/client/NotificationContents/NotificationCenter";
import NotificationSidebar from "@/components/client/NotificationContents/NotificationSidebar";

export default function NotificationsPage() {
  return (
    <>
      <NotificationHero />

      <div className="mt-6">
        <NotificationStats />
      </div>

      <div className="grid lg:grid-cols-[2fr_0.9fr] gap-6 mt-6">
        <NotificationCenter />
        <NotificationSidebar />
      </div>
    </>
  );
}
