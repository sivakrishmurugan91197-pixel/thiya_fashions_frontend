import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import { useState, useEffect } from 'react';

export default function StatsSection(data) {
  const reinsurer_summary = data?.reinsurerDashboard?.reinsurer_summary;
  const insurer_summary = data?.reinsurerDashboard?.totalinsurer;
  const underwriters_summary = data?.reinsurerDashboard?.totalunderwriter;
  const quotations_summary = data?.reinsurerDashboard?.quotations_count;
  const quoted_summary = data?.quotationsResults?.quotation_status_count;

  const total = quoted_summary?.overall_count;

  const percentages = {
    quoted: ((quoted_summary?.quoted_count / total) * 100).toFixed(2),
    inprogress: ((quoted_summary?.inprogress_count / total) * 100).toFixed(2),
    pending: ((quoted_summary?.pending_approval_count / total) * 100).toFixed(2),
    negative: ((quoted_summary?.negative_declared_count / total) * 100).toFixed(2),
    paid: ((quoted_summary?.paid_count / total) * 100).toFixed(2),
    insured: ((quoted_summary?.insured_count / total) * 100).toFixed(2),
    reject: ((quoted_summary?.reject_count / total) * 100).toFixed(2),
  };

  
  const reinsurerTotal = reinsurer_summary?.reinsurer_total ?? 0;
  const reinsurerActive = reinsurer_summary?.reinsurer_active ?? 0;
  const reinsurerInactive = reinsurer_summary?.reinsurer_inactive ?? 0;

  const insurerTotal = insurer_summary?.insurer_total ?? 0;
  const insurerActive = insurer_summary?.insurer_active ?? 0;
  const insurerInactive = insurer_summary?.insurer_inactive ?? 0;

  const underwritersTotal = underwriters_summary?.underwriter_total ?? 0;
  const underwritersActive = underwriters_summary?.underwriter_active ?? 0;
  const underwritersInactive = underwriters_summary?.underwriter_inactive ?? 0;

  const quotationCount = quotations_summary?.overall_count ?? 0;
  const quotedCount = percentages?.quoted ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <Link href="">
        <StatCard
          title="Total Reinsurers"
          value={reinsurerTotal}
          trend="5▲"
          subtext="Active entities in the system"
          reinsurerstatus={`${reinsurerActive} Active · ${reinsurerInactive} Inactive`}
          active
        />
      </Link>
      <Link href="">
        <StatCard
          title="Total Insurers"
          value={insurerTotal}
          trend="6▲"
          subtext="Active entities in the system"
          reinsurerstatus={`${insurerActive} Active · ${insurerInactive} Inactive`}
        />
      </Link>
      <Link href="">
        <StatCard
          title="Total Underwriters"
          value={underwritersTotal}
          trend="2▲"
          subtext="Active users across platform"
          reinsurerstatus={`${underwritersActive} Active · ${underwritersInactive} Inactive`}
        />
      </Link>
      <Link href="">
        <StatCard
          title="Total Leads"
          value={quotationCount}
          trend="On Discuss"
          subtext="All quotations ever created"
          reinsurerstatus={`${quotedCount} % Quoted`}
        />
      </Link>
    </div>
  );
}
