import React, { useState } from 'react';
import { StudioAnalyticsData } from '../../api/client.ts';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Download,
  Filter,
  Sparkles,
  Award,
  Film,
} from 'lucide-react';

interface Props {
  analytics: StudioAnalyticsData | null;
  onRefresh?: () => void;
  onNavigateToInquiries?: () => void;
}

export const AdminAnalyticsSection: React.FC<Props> = ({
  analytics,
  onRefresh,
  onNavigateToInquiries,
}) => {
  const [timeRange, setTimeRange] = useState<'all' | 'q3q4' | 'month'>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!analytics) {
    return (
      <div className="p-12 text-center text-neutral-400 space-y-3">
        <BarChart3 className="w-8 h-8 mx-auto text-[#c5a059] animate-pulse" />
        <p className="text-sm">Loading studio analytics and financial pipeline...</p>
      </div>
    );
  }

  const { funnel, revenue, services, geography, leadChannels, operationalKpis } = analytics;

  // Max inquiry in monthly trends for chart scaling
  const maxMonthlyCount = Math.max(...funnel.monthlyTrends.map((t) => t.inquiries), 1);

  const handleExportSummary = () => {
    const summaryText = `SHIFA PRODUCTIONS - STUDIO ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}
------------------------------------------------
1. LEAD & PIPELINE FUNNEL:
- Total Inquiries: ${funnel.total}
- Conversion Rate: ${funnel.conversionRate}%
- In Discussion: ${funnel.inDiscussion}
- Confirmed/Completed: ${funnel.bookedTotal}

2. FINANCIAL PIPELINE (PKR):
- Total Estimated Pipeline: PKR ${revenue.totalPipelinePkr.toLocaleString()}
- Realized Booked Revenue: PKR ${revenue.realizedRevenuePkr.toLocaleString()}
- Average Deal Size: PKR ${revenue.avgDealSizePkr.toLocaleString()}

3. SERVICE DEMAND:
${services.map((s) => `- ${s.service}: ${s.count} requests (${s.pct}%) - Volume: PKR ${s.volumePkr.toLocaleString()}`).join('\n')}

4. GEOGRAPHIC DISTRIBUTION:
${geography.map((g) => `- ${g.city}: ${g.count} inquiries (${g.pct}%)`).join('\n')}

5. LEAD CHANNELS:
${leadChannels.map((c) => `- ${c.channel}: ${c.count} (${c.pct}%)`).join('\n')}
`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ================= HEADER & CONTROLS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
              Business Intelligence & Reporting
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              5 Core Dimensions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-brand mt-1">
            Studio Performance & Market Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Real-time intelligence on Pakistani inquiry conversions, PKR revenue pipeline, service demand, provincial city distribution, and communication channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range toggle */}
          <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeRange === 'all' ? 'bg-[#c5a059] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeRange('q3q4')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeRange === 'q3q4' ? 'bg-[#c5a059] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              H2 2026
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                timeRange === 'month' ? 'bg-[#c5a059] text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportSummary}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            title="Copy formatted summary to clipboard"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>{copiedSummary ? 'Copied to Clipboard!' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* ================= EXECUTIVE KPI HIGHLIGHTS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-neutral-800/90 relative overflow-hidden group hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Lead Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-brand tabular-nums">
            {funnel.conversionRate}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1.5">
            <CheckCircle2 className="w-3 h-3" />
            <span>{funnel.bookedTotal} of {funnel.total} inquiries booked</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-neutral-800/90 relative overflow-hidden group hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Total PKR Pipeline</span>
            <DollarSign className="w-4 h-4 text-[#c5a059]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#c5a059] font-brand tabular-nums">
            PKR {(revenue.totalPipelinePkr / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">
            Realized: <strong className="text-white">PKR {(revenue.realizedRevenuePkr / 1000000).toFixed(1)}M</strong>
          </div>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#c5a059]/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-neutral-800/90 relative overflow-hidden group hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Avg Deal Size (PKR)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-brand tabular-nums">
            PKR {(revenue.avgDealSizePkr / 1000).toFixed(0)}K
          </div>
          <div className="text-[11px] text-neutral-400 mt-1.5">
            Top demand: <span className="text-neutral-300">{operationalKpis.topServiceRequested}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-[#111111] border border-neutral-800/90 relative overflow-hidden group hover:border-[#c5a059]/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span>Primary Inbound Channel</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-brand tabular-nums">
            WhatsApp
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1.5">
            {leadChannels[0]?.pct}% of incoming inquiries
          </div>
        </div>
      </div>

      {/* ================= 1. LEAD & PIPELINE FUNNEL ANALYTICS ================= */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
              Type 1 · Lead & Inquiries Funnel
            </div>
            <h2 className="text-lg font-bold text-white font-brand">
              Inquiry Pipeline Velocity & Monthly Trends
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#c5a059]" />
              <span>Inquiries Received</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Confirmed / Booked</span>
            </span>
          </div>
        </div>

        {/* Funnel Progress Step Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">1. Total Inquiries</div>
            <div className="text-2xl font-bold text-white font-brand mt-1 tabular-nums">{funnel.total}</div>
            <div className="text-[10px] text-neutral-500 mt-1">100% of lead traffic</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="text-[11px] uppercase tracking-wider text-amber-400">2. In Discussion</div>
            <div className="text-2xl font-bold text-amber-400 font-brand mt-1 tabular-nums">{funnel.inDiscussion}</div>
            <div className="text-[10px] text-neutral-400 mt-1">Active client pitching</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="text-[11px] uppercase tracking-wider text-emerald-400">3. Confirmed Shoots</div>
            <div className="text-2xl font-bold text-emerald-400 font-brand mt-1 tabular-nums">{funnel.confirmed}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">Contract / Advance in hand</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div className="text-[11px] uppercase tracking-wider text-cyan-400">4. Delivered Films</div>
            <div className="text-2xl font-bold text-cyan-400 font-brand mt-1 tabular-nums">{funnel.completed}</div>
            <div className="text-[10px] text-cyan-400/80 mt-1">Master 4K released</div>
          </div>
        </div>

        {/* 6-Month Visual Bar Chart */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-neutral-300">
            Monthly Inquiries vs Confirmed Productions (May - Oct 2026)
          </div>
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            {funnel.monthlyTrends.map((trend) => {
              const inqHeight = Math.max(Math.round((trend.inquiries / maxMonthlyCount) * 100), 12);
              const bookedHeight = Math.max(Math.round((trend.booked / maxMonthlyCount) * 100), 8);
              return (
                <div key={trend.month} className="flex flex-col items-center justify-end h-full gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-28">
                    {/* Inquiries bar */}
                    <div
                      style={{ height: `${inqHeight}%` }}
                      className="w-3.5 sm:w-5 bg-[#c5a059] rounded-t hover:bg-[#d4af37] transition-all relative group-hover:shadow-md group-hover:shadow-[#c5a059]/20"
                      title={`${trend.month}: ${trend.inquiries} inquiries`}
                    >
                      <div className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black border border-neutral-700 text-[10px] text-[#c5a059] font-mono whitespace-nowrap z-10">
                        {trend.inquiries} inq
                      </div>
                    </div>
                    {/* Booked bar */}
                    <div
                      style={{ height: `${bookedHeight}%` }}
                      className="w-3.5 sm:w-5 bg-emerald-500 rounded-t hover:bg-emerald-400 transition-all relative group-hover:shadow-md group-hover:shadow-emerald-500/20"
                      title={`${trend.month}: ${trend.booked} booked`}
                    >
                      <div className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black border border-neutral-700 text-[10px] text-emerald-400 font-mono whitespace-nowrap z-10">
                        {trend.booked} booked
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white transition-colors">
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. REVENUE & BUDGET PIPELINE (FINANCIAL IN PKR) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-neutral-800 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
              Type 2 · Financial Analytics
            </div>
            <h2 className="text-lg font-bold text-white font-brand mt-0.5">
              Revenue & Budget Tier Distribution (PKR)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Project budgets submitted by Pakistani clients across production tiers.
            </p>
          </div>

          {/* Realization Progress Bar */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Realized vs Estimated Pipeline</span>
              <span className="text-[#c5a059] font-bold font-mono">
                {revenue.totalPipelinePkr > 0
                  ? Math.round((revenue.realizedRevenuePkr / revenue.totalPipelinePkr) * 100)
                  : 0}
                % Converted
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden flex">
              <div
                style={{
                  width: `${
                    revenue.totalPipelinePkr > 0
                      ? Math.min((revenue.realizedRevenuePkr / revenue.totalPipelinePkr) * 100, 100)
                      : 0
                  }%`,
                }}
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>Booked: PKR {revenue.realizedRevenuePkr.toLocaleString()}</span>
              <span>Pipeline: PKR {revenue.totalPipelinePkr.toLocaleString()}</span>
            </div>
          </div>

          {/* Budget Brackets */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-300">
              Inquiries by Budget Bracket:
            </div>
            <div className="space-y-2.5">
              {revenue.budgetBrackets.map((bracket, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-medium">{bracket.label}</span>
                    <span className="text-neutral-400 font-mono">
                      {bracket.count} inquiries ({bracket.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      style={{ width: `${bracket.pct}%` }}
                      className={`h-full rounded-full ${
                        idx === 3
                          ? 'bg-[#c5a059]'
                          : idx === 2
                          ? 'bg-amber-400'
                          : idx === 1
                          ? 'bg-sky-400'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 3. SERVICE DEMAND & POPULARITY ================= */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
                Type 3 · Service Demand
              </div>
              <h2 className="text-lg font-bold text-white font-brand mt-0.5">
                Most Requested Production Services
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
              {services.length} Active Formats
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {services.map((item, index) => (
              <div
                key={item.service}
                className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-white">{item.service}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#c5a059] shrink-0">
                    PKR {(item.volumePkr / 1000).toFixed(0)}K
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{item.count} client inquiries</span>
                    <span>{item.pct}% share</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${item.pct}%` }}
                      className="h-full bg-[#c5a059] rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 4 & 5. GEOGRAPHY & LEAD CHANNELS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Pakistani Cities Distribution */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
                Type 4 · Geographic Distribution
              </div>
              <h2 className="text-lg font-bold text-white font-brand mt-0.5">
                Client Demand Across Pakistan
              </h2>
            </div>
            <MapPin className="w-5 h-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {geography.map((geo) => (
              <div key={geo.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                    <span>{geo.city}</span>
                  </span>
                  <span className="text-neutral-400 font-mono">
                    {geo.count} shoots ({geo.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                  <div
                    style={{ width: `${geo.pct}%` }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
            <span>Primary Operational Hub</span>
            <strong className="text-white font-brand">Lahore & Islamabad Studios</strong>
          </div>
        </div>

        {/* 5. Communication Channels & Operational KPIs */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#101010] border border-neutral-800 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
              Type 5 · Lead Acquisition & Response
            </div>
            <h2 className="text-lg font-bold text-white font-brand mt-0.5">
              Client Contact Channels & KPIs
            </h2>
          </div>

          <div className="space-y-3">
            {leadChannels.map((channel) => {
              const isWa = channel.key === 'whatsapp';
              const isPh = channel.key === 'phone';
              return (
                <div
                  key={channel.channel}
                  className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isWa
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          : isPh
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                          : 'bg-sky-950/80 text-sky-400 border border-sky-800/80'
                      }`}
                    >
                      {isWa ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : isPh ? (
                        <Phone className="w-4 h-4" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{channel.channel}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        {channel.count} inquiries ({channel.pct}% share)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#c5a059] font-mono">
                    {channel.pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Operational KPIs */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#c5a059]" />
                <span>Avg Response Speed</span>
              </div>
              <div className="text-base font-bold text-white font-brand">1.6 Hours</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>Peak Booking Month</span>
              </div>
              <div className="text-base font-bold text-white font-brand">October 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
