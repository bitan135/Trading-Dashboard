'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, AlertTriangle } from 'lucide-react'

interface MarketClosedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MarketClosedModal({ isOpen, onClose }: MarketClosedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] px-4"
          >
            <div className="panel p-8 bg-[#0f0f0f] border-[#ffaa00]/30 shadow-[0_0_50px_rgba(255,170,0,0.1)] relative">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-[#555] hover:text-[#e0e0e0] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] animate-pulse">
                  <Clock size={32} />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-[#ffaa00] uppercase tracking-wider">
                    Market Is Closed
                  </h3>
                  <p className="text-sm text-[#888] leading-relaxed">
                    The trading session is currently inactive. You cannot modify the journal until the market re-opens.
                  </p>
                </div>

                <div className="w-full bg-[#ffaa00]/5 border border-[#ffaa00]/10 p-4 rounded-sm flex items-start gap-3 text-left">
                  <AlertTriangle size={18} className="text-[#ffaa00] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#ffaa00] uppercase tracking-wider">Next Session</span>
                    <span className="text-xs text-[#888]">Sunday at 10:00 PM London time</span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-3 border border-[#ffaa00] text-[#ffaa00] text-xs font-bold uppercase tracking-widest hover:bg-[#ffaa00]/10 transition-all rounded-sm"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
