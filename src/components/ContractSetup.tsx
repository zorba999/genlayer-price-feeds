'use client';

import { useState } from 'react';
import { Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { BRADBURY_EXPLORER } from '@/lib/constants';

interface ContractSetupProps {
  contractAddress: string;
  loading: boolean;
  onAddressChange: (addr: string) => void;
  onRefresh: () => void;
}

export default function ContractSetup({
  contractAddress,
  loading,
  onAddressChange,
  onRefresh,
}: ContractSetupProps) {
  const [draft, setDraft] = useState(contractAddress);
  const [open, setOpen] = useState(!contractAddress || contractAddress === '0x');

  const handleSave = () => {
    onAddressChange(draft.trim());
    setOpen(false);
  };

  const explorerUrl = contractAddress && contractAddress.length > 10
    ? `${BRADBURY_EXPLORER}/address/${contractAddress}`
    : null;

  return (
    <div className="mb-8 bg-[#0d1117] border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-400 font-medium">Contract Address</span>
          {contractAddress && contractAddress.length > 10 && (
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              Connected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onRefresh}
            disabled={loading || !contractAddress || contractAddress.length < 10}
            className="text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            {open ? 'Close' : 'Edit'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="0x… contract address on Bradbury"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            onClick={handleSave}
            disabled={!draft.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      )}

      {!open && contractAddress && contractAddress.length > 10 && (
        <p className="mt-2 text-xs text-slate-600 font-mono truncate">{contractAddress}</p>
      )}
    </div>
  );
}
