import { DashboardOverview } from "@/features/dashboard/dashboard-overview";
import { getDashboardSnapshot } from "@/mocks/admin-repositories";
import { parseDemoScenario } from "@/mocks/scenarios";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string | string[] }>;
}) {
  const { scenario } = await searchParams;
  const snapshot = await getDashboardSnapshot(parseDemoScenario(scenario));

  return <DashboardOverview snapshot={snapshot} />;
}
