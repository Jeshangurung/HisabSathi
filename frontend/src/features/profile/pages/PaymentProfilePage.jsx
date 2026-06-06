import Button from "../../../components/common/Button.jsx";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";
import PageHeader from "../../../components/common/PageHeader.jsx";


export default function PaymentProfilePage() {
  return (
    <>
      <PageHeader
        description="Save eSewa, Khalti, bank details, and QR information for smoother settlement."
        eyebrow="Profile"
        title="Payment profile"
      />
      <Card className="max-w-3xl">
        <form className="grid gap-4 md:grid-cols-2">
          <Input label="eSewa number" />
          <Input label="Khalti number" />
          <Input label="Bank name" />
          <Input label="Bank account number" />
          <Input label="Account holder name" />
          <Input label="Payment QR" type="file" />
          <div className="md:col-span-2">
            <Button>Save payment profile</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
