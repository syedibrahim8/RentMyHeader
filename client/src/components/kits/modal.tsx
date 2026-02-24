"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ open, onClose, children, title }: ModalProps) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-card relative z-10 w-full max-w-lg rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            {title && <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{title}</h2>}
            <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition-colors">
              <X size={20} className="text-white/60" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
