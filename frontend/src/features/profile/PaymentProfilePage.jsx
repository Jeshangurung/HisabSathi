import toast from "react-hot-toast";

import Card from "../../components/common/Card.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import PaymentProfileForm from "../../components/forms/PaymentProfileForm.jsx";
import { useApi } from "../../hooks/useApi.js";
import { getPaymentProfile, updatePaymentProfile } from "./profileService.js";


export default function PaymentProfilePage() {
  const paymentApi = useApi(getPaymentProfile, []);

  const submit = async (payload) => {
    if (!paymentApi.data?.id) {
      toast.error("Payment profile was not found.");
      return;
    }
    await updatePaymentProfile(paymentApi.data.id, payload);
    toast.success("Payment profile updated.");
    paymentApi.reload();
  };

  if (paymentApi.isLoading) return <Loader label="Loading payment profile" />;

  return (
    <>
      <PageHeader description="Add phone, wallet, bank, and QR details for faster settlements." eyebrow="Profile" title="Payment profile" />
      <Card className="max-w-3xl">
        <PaymentProfileForm initialValues={paymentApi.data ?? {}} onSubmit={submit} />
      </Card>
    </>
  );
}
