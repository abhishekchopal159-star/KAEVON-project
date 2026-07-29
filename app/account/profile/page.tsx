import AccountLayout from "@/components/account/AccountLayout";
import ProfileCard from "@/components/account/ProfileCard";
import ProfileForm from "@/components/account/ProfileForm";

export default function ProfilePage() {
  return (
    <AccountLayout pageTitle="My Profile">
      <div className="grid items-start gap-7 2xl:grid-cols-[360px_minmax(0,1fr)]">
        <ProfileCard />
        <ProfileForm />
      </div>
    </AccountLayout>
  );
}
