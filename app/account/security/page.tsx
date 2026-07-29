import AccountLayout from "@/components/account/AccountLayout";
import SecurityForm from "@/components/account/SecurityForm";

export default function SecurityPage() {
  return (
    <AccountLayout pageTitle="Security">
      <SecurityForm />
    </AccountLayout>
  );
}
