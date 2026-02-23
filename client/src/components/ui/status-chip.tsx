import type { ApplicationStatus, CampaignStatus, PaymentStatus } from "@/src/lib/types";
import { cn } from "@/src/lib/utils";

type Status = ApplicationStatus | CampaignStatus | PaymentStatus;

const toneMap: Record<Status, string> = {
  open: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  influencer_selected: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  funded: "bg-cyan-500/15 text-cyan-300 ring-cyan-500/30",
  active: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  completed: "bg-green-500/15 text-green-300 ring-green-500/30",
  cancelled: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  applied: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  selected: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  rejected: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  withdrawn: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  proof_submitted: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  failed_proof: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  disputed: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
  released: "bg-teal-500/15 text-teal-300 ring-teal-500/30",
  refunded: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  none: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
  requires_payment: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  processing: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
  succeeded: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
  requires_capture: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
  captured: "bg-cyan-500/15 text-cyan-300 ring-cyan-500/30",
  canceled: "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20",
};

const dotMap: Record<Status, string> = {
  open: "bg-emerald-400",
  influencer_selected: "bg-violet-400",
  funded: "bg-cyan-400",
  active: "bg-blue-400",
  completed: "bg-green-400",
  cancelled: "bg-zinc-400",
  applied: "bg-blue-400",
  selected: "bg-violet-400",
  rejected: "bg-rose-400",
  withdrawn: "bg-zinc-400",
  proof_submitted: "bg-amber-400",
  approved: "bg-emerald-400",
  failed_proof: "bg-rose-400",
  disputed: "bg-orange-400",
  released: "bg-teal-400",
  refunded: "bg-zinc-400",
  none: "bg-zinc-400",
  requires_payment: "bg-amber-400",
  processing: "bg-blue-400",
  succeeded: "bg-emerald-400",
  failed: "bg-rose-400",
  requires_capture: "bg-violet-400",
  captured: "bg-cyan-400",
  canceled: "bg-zinc-400",
};

export function StatusChip({ status, dot }: { status: Status; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize",
        toneMap[status]
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[status])} />}
      {status.replaceAll("_", " ")}
    </span>
  );
}