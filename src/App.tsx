/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  ChevronRight, 
  CheckCircle2, 
  Loader2, 
  CreditCard, 
  Receipt,
  ArrowLeft,
  Info
} from 'lucide-react';
import { POSItem, POSTable } from './types';

export default function App() {
  const [step, setStep] = useState<'scan' | 'items' | 'payment-mock' | 'success'>('scan');
  const [table, setTable] = useState<POSTable | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Mock table fetching
  const fetchCheck = async (tableId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/check/${tableId}`);
      if (!res.ok) throw new Error("Table not found");
      const data = await res.json();
      setTable(data);
      setStep('items');
    } catch (err) {
      alert("Could not load table. Please ensure the QR is correct.");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePay = async () => {
    setProcessingPayment(true);
    // Simulate API call to split-payment
    try {
      const res = await fetch('/api/split-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_id: table?.id, item_ids: selectedItemIds })
      });
      const data = await res.json();
      
      // Simulate POS Webhook delay
      setTimeout(async () => {
        await fetch('/api/payment-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table_id: table?.id, item_ids: selectedItemIds })
        });
        setStep('success');
        setProcessingPayment(false);
      }, 2000);

    } catch (err) {
      setProcessingPayment(false);
      alert("Payment failed simulation.");
    }
  };

  const totalSelected = table?.items
    .filter(i => selectedItemIds.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0) || 0;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col max-w-md mx-auto shadow-xl ring-1 ring-black/5">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight">ServeMe</h1>
        </div>
        {table && (
          <div className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-medium text-zinc-600">
            Table {table.id}
          </div>
        )}
      </header>

      <main className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 'scan' && (
            <motion.div 
              key="scan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Welcome to Bistro 24</h2>
              <p className="text-zinc-500 mb-8 max-w-[240px] mx-auto leading-relaxed">
                Scan the QR code on your table to see your bill and pay.
              </p>
              <button 
                onClick={() => fetchCheck("T12")}
                disabled={loading}
                className="w-full bg-zinc-900 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                id="btn-scan-sim"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Simulate QR Scan (Table 12) <ChevronRight className="w-5 h-5" /></>
                )}
              </button>
            </motion.div>
          )}

          {step === 'items' && table && (
            <motion.div 
              key="items"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-display text-2xl font-bold">Split Check</h2>
                <p className="text-zinc-500 text-sm">Select the items you'd like to pay for.</p>
              </div>

              <div className="space-y-3">
                {table.items.map((item) => (
                  <motion.button
                    key={item.id}
                    disabled={item.paid}
                    onClick={() => toggleItem(item.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      item.paid 
                        ? 'bg-zinc-50 border-transparent opacity-60 cursor-not-allowed'
                        : selectedItemIds.includes(item.id)
                          ? 'bg-indigo-50 border-indigo-200'
                          : 'bg-white border-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.paid 
                          ? 'bg-emerald-500 border-emerald-500'
                          : selectedItemIds.includes(item.id)
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-zinc-200'
                      }`}>
                        {(item.paid || selectedItemIds.includes(item.id)) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`font-medium ${item.paid ? 'line-through text-zinc-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-zinc-700">
                      ${item.price.toFixed(2)}
                    </span>
                  </motion.button>
                ))}
              </div>

              {table.items.every(i => i.paid) && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p>All items have been paid. Enjoy the rest of your day!</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold mb-3 text-zinc-900">Paid!</h2>
              <p className="text-zinc-500 mb-8 max-w-[280px] mx-auto leading-relaxed">
                Thank you for your payment of <span className="font-bold text-zinc-900">${totalSelected.toFixed(2)}</span>. 
                The kitchen staff has been notified.
              </p>
              
              <div className="bg-white rounded-2xl p-6 border border-zinc-100 text-left mb-8 shadow-sm">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Receipt Details</p>
                {selectedItemIds.map(id => {
                  const item = table?.items.find(i => i.id === id);
                  return (
                    <div key={id} className="flex justify-between py-2 text-sm">
                      <span className="text-zinc-600">{item?.name}</span>
                      <span className="font-medium">${item?.price.toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalSelected.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => setStep('items')}
                className="w-full bg-zinc-100 text-zinc-900 rounded-2xl py-4 font-semibold hover:bg-zinc-200 transition-colors"
              >
                Return to Table
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Payment Bar */}
      {step === 'items' && selectedItemIds.length > 0 && (
        <motion.footer 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-white border-t border-zinc-100 p-6 space-y-4 shadow-2xl"
        >
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">{selectedItemIds.length} items selected</span>
            <div className="text-right">
              <span className="block text-zinc-400 text-[10px] uppercase font-bold tracking-wider leading-none">Total Due</span>
              <span className="text-2xl font-display font-bold text-zinc-900">${totalSelected.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={processingPayment}
            className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-400 active:scale-[0.98] transition-all"
            id="btn-pay"
          >
            {processingPayment ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>Pay with Apple Pay <CreditCard className="w-5 h-5" /></>
            )}
          </button>
          
          <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3" /> Secure checkout powered by ServeMe
          </p>
        </motion.footer>
      )}

      {/* Back button simulation */}
      {step === 'items' && (
        <button 
          onClick={() => setStep('scan')}
          className="absolute top-5 left-4 p-2 text-zinc-400 hover:text-zinc-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
