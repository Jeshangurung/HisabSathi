import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Card from "../../components/common/Card.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import LoanForm from "../../components/forms/LoanForm.jsx";
import { createLoan } from "./loanService.js";


export default function AddLoanPage() {
  const navigate = useNavigate();

  const submit = async (payload) => {
    await createLoan(payload);
    toast.success("Loan created.");
    navigate("/loans");
  };

  return (
    <>
      <PageHeader description="Record lender, borrower, amount, reason, and due date." eyebrow="Loans" title="Add loan" />
      <Card className="max-w-3xl">
        <LoanForm onSubmit={submit} />
      </Card>
    </>
  );
}
