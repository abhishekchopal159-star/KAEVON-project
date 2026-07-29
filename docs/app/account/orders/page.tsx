import AccountLayout from "@/components/account/AccountLayout";
import OrdersTable from "@/components/account/OrdersTable";

export default function OrdersPage() {
  return (
    <AccountLayout pageTitle="Orders">
      <OrdersTable />
    </AccountLayout>
  );
}
