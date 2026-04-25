'use client';

import type { ElementType } from 'react';
import { CheckCircle, XCircle, Clock, ExternalLink, X } from 'lucide-react';
import { BRADBURY_EXPLORER } from '@/lib/constants';
import type { TxStatus } from '@/lib/types';

interface TransactionStatusProps {
  status: TxStatus;
  txHash: string | null;
  txError: string | null;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  Exclude<TxStatus, 'idle'>,
  { icon: ElementType; color: string; bg: string; label: string }
> = {
  pending:   { icon: Clock,        color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', label: 'Waiting for wallet…'       },
  submitted: { icon: Clock,        color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20', label: 'Transaction submitted'       },
  finalized: { icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', label: 'Prices updated on-chain!' },
  error:     { icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20',      label: 'Transaction failed'          },
};

export default function TransactionStatus({
  status,
  txHash,
  txError,
  onClose,
}: TransactionStatusProps) {
  if (status === 'idle') return null;
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <div className={`fixed bottom-6 right-6 max-w-sm w-full border rounded-xl p-4 shadow-2xl z-50 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</p>
          {txHash && (
            <a
              href={`${BRADBURY_EXPLORER}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mt-1 truncate"
            >
              {txHash.slice(0, 20)}…
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          )}
          {txError && (
            <p className="text-xs text-red-400/70 mt-1 truncate">{txError}</p>
          )}
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-400 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
