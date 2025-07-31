import OpportunityCard from "../../../components/opportunities/OpportunityCard";
export default function OpportunityList({ opportunities }) {
  // Lista de oportunidades
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
