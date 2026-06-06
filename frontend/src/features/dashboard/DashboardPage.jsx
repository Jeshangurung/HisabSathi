import { CreditCard, Landmark, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardStatCard from "../../components/cards/DashboardStatCard.jsx";
import ExpenseCard from "../../components/cards/ExpenseCard.jsx";
import ReminderCard from "../../components/cards/ReminderCard.jsx";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { getDashboardSummary } from "./dashboardService.js";


export default function DashboardPage() {
  const { data, error, isLoading } = useApi(getDashboardSummary, []);

  if (isLoading) return <Loader label="Loading dashboard" />;

  return (
    <>
      <PageHeader
        actions={<Link to="/expenses/new"><Button icon={Receipt}>Add expense</Button></Link>}
        description="Live totals from your groups, settlements, loans, and reminders."
        eyebrow="Overview"
        title="Dashboard"
      />
      {error ? <Card className="mb-5 text-sm text-red-600">{error}</Card> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard icon={TrendingDown} label="I owe" value={formatCurrency(data?.total_amount_i_owe)} />
        <DashboardStatCard icon={TrendingUp} label="I am owed" value={formatCurrency(data?.total_amount_i_am_owed)} />
        <DashboardStatCard icon={CreditCard} label="Pending settlements" value={data?.pending_settlement_count ?? 0} />
        <DashboardStatCard icon={Landmark} label="Loans borrowed" value={data?.active_loans_borrowed_count ?? 0} />
        <DashboardStatCard icon={Landmark} label="Loans given" value={data?.active_loans_given_count ?? 0} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Recent expenses</h2>
          {data?.recent_expenses?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.recent_expenses.map((expense) => <ExpenseCard expense={expense} key={expense.id} />)}
            </div>
          ) : (
            <EmptyState description="Create your first group expense to see activity here." title="No recent expenses" />
          )}
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Reminders</h2>
          <div className="space-y-3">
            {data?.recent_reminders?.length ? data.recent_reminders.map((reminder) => (
              <ReminderCard key={reminder.id} onMarkRead={() => {}} reminder={reminder} />
            )) : <EmptyState description="No pending reminders right now." title="All clear" />}
          </div>
        </section>
      </div>
    </>
  );
}
