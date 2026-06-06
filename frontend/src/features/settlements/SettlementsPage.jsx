import toast from "react-hot-toast";

import SettlementCard from "../../components/cards/SettlementCard.jsx";
import Card from "../../components/common/Card.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Loader from "../../components/common/Loader.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { useApi } from "../../hooks/useApi.js";
import { confirmSettlement, listMoneyIOwe, listMoneyOwedToMe, markSettlementPaid, rejectSettlement } from "./settlementService.js";


export default function SettlementsPage() {
  const oweApi = useApi(listMoneyIOwe, [], { initialData: [] });
  const owedApi = useApi(listMoneyOwedToMe, [], { initialData: [] });

  const reload = () => {
    oweApi.reload();
    owedApi.reload();
  };

  const markPaid = async (id, payload) => {
    await markSettlementPaid(id, payload);
    toast.success("Settlement marked as paid.");
    reload();
  };

  const confirm = async (id) => {
    await confirmSettlement(id);
    toast.success("Settlement confirmed.");
    reload();
  };

  const reject = async (id) => {
    await rejectSettlement(id, "Payment proof rejected from frontend review.");
    toast.success("Settlement rejected.");
    reload();
  };

  return (
    <>
      <PageHeader description="Track what you owe, what others owe you, and payment proof review." eyebrow="Settlements" title="Settlements" />
      <div className="grid gap-5 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Money I owe</h2>
          {oweApi.isLoading ? <Loader label="Loading settlements" /> : null}
          <div className="space-y-3">
            {!oweApi.isLoading && oweApi.data?.length ? oweApi.data.map((settlement) => (
              <SettlementCard canMarkPaid key={settlement.id} onMarkPaid={markPaid} settlement={settlement} />
            )) : null}
          </div>
          {!oweApi.isLoading && !oweApi.data?.length ? <EmptyState description="You do not owe any pending settlements." title="Nothing pending" /> : null}
        </section>
        <section>
          <h2 className="mb-3 text-lg font-bold text-ink">Money owed to me</h2>
          {owedApi.isLoading ? <Loader label="Loading received settlements" /> : null}
          <div className="space-y-3">
            {!owedApi.isLoading && owedApi.data?.length ? owedApi.data.map((settlement) => (
              <SettlementCard canConfirm key={settlement.id} onConfirm={confirm} onReject={reject} settlement={settlement} />
            )) : null}
          </div>
          {!owedApi.isLoading && !owedApi.data?.length ? <EmptyState description="No one currently owes you through active settlements." title="All settled" /> : null}
        </section>
      </div>
      {oweApi.error || owedApi.error ? <Card className="mt-5 text-sm text-red-600">{oweApi.error || owedApi.error}</Card> : null}
    </>
  );
}
