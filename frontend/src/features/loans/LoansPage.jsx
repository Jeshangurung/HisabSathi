import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import LoanCard from "../../components/cards/LoanCard.jsx";
import Button from "../../components/common/Button.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { confirmLoanPaid, listLoansBorrowed, listLoansGiven, listOverdueLoans, markLoanPaid } from "./loanService.js";


export default function LoansPage() {
  const givenApi = useApi(listLoansGiven, [], { initialData: [] });
  const borrowedApi = useApi(listLoansBorrowed, [], { initialData: [] });
  const overdueApi = useApi(listOverdueLoans, [], { initialData: [] });

  const reload = () => {
    givenApi.reload();
    borrowedApi.reload();
    overdueApi.reload();
  };

  const markPaid = async (id) => {
    await markLoanPaid(id);
    toast.success("Loan marked as paid.");
    reload();
  };

  const confirmPaid = async (id) => {
    await confirmLoanPaid(id);
    toast.success("Loan payment confirmed.");
    reload();
  };

  return (
    <>
      <PageHeader
        actions={<Link to="/loans/new"><Button icon={Plus}>Add loan</Button></Link>}
        description="Track personal loans separately from group expense settlements."
        eyebrow="Loans"
        title="Loan tracker"
      />
      {overdueApi.data?.length ? (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold text-ink">Overdue</h2>
          <div className="space-y-3">
            {overdueApi.data.map((loan) => <LoanCard key={loan.id} loan={loan} onConfirmPaid={confirmPaid} onMarkPaid={markPaid} showConfirm showMarkPaid />)}
          </div>
        </section>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Loans I gave</h2>
          {givenApi.isLoading ? <Loader label="Loading loans" /> : null}
          <div className="space-y-3">
            {!givenApi.isLoading && givenApi.data?.map((loan) => (
              <LoanCard key={loan.id} loan={loan} onConfirmPaid={confirmPaid} showConfirm={loan.status === "marked_paid"} />
            ))}
          </div>
          {!givenApi.isLoading && !givenApi.data?.length ? <EmptyState description="Loans you give will appear here." title="No loans given" /> : null}
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Loans I borrowed</h2>
          {borrowedApi.isLoading ? <Loader label="Loading borrowed loans" /> : null}
          <div className="space-y-3">
            {!borrowedApi.isLoading && borrowedApi.data?.map((loan) => (
              <LoanCard key={loan.id} loan={loan} onMarkPaid={markPaid} showMarkPaid={loan.status === "active"} />
            ))}
          </div>
          {!borrowedApi.isLoading && !borrowedApi.data?.length ? <EmptyState description="Loans you borrow will appear here." title="No borrowed loans" /> : null}
        </section>
      </div>
    </>
  );
}
