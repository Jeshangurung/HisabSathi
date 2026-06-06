import { useState } from "react";

import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";


export default function PaymentProfileForm({ initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    bank_account_name: initialValues.bank_account_name ?? "",
    bank_account_number: initialValues.bank_account_number ?? "",
    bank_name: initialValues.bank_name ?? "",
    esewa_number: initialValues.esewa_number ?? "",
    khalti_number: initialValues.khalti_number ?? "",
    payment_qr: null,
    phone_number: initialValues.phone_number ?? "",
  });
  const [preview, setPreview] = useState(initialValues.payment_qr ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Phone number" name="phone_number" onChange={update} value={form.phone_number} />
        <Input label="eSewa number" name="esewa_number" onChange={update} value={form.esewa_number} />
        <Input label="Khalti number" name="khalti_number" onChange={update} value={form.khalti_number} />
        <Input label="Bank name" name="bank_name" onChange={update} value={form.bank_name} />
        <Input label="Bank account number" name="bank_account_number" onChange={update} value={form.bank_account_number} />
        <Input label="Account holder name" name="bank_account_name" onChange={update} value={form.bank_account_name} />
      </div>
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">Payment QR</span>
        <input
          className="mt-2 block w-full text-sm text-zinc-600"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setForm((current) => ({ ...current, payment_qr: file }));
            setPreview(file ? URL.createObjectURL(file) : "");
          }}
          type="file"
        />
      </label>
      {preview ? <img alt="Payment QR preview" className="h-40 w-40 rounded-lg border border-zinc-200 object-cover" src={preview} /> : null}
      <Button isLoading={isLoading} type="submit">
        Save payment profile
      </Button>
    </form>
  );
}
