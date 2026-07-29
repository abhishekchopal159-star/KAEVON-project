import AccountLayout from "@/components/account/AccountLayout";
import NotificationSwitch from "@/components/account/NotificationSwitch";

export default function NotificationsPage() {
  return (
    <AccountLayout pageTitle="Notifications">
      <NotificationSwitch />
    </AccountLayout>
  );
}
