import { X } from "lucide-react";

import Button from "./Button.jsx";


export default function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <section className="w-full max-w-lg rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <Button aria-label="Close modal" icon={X} onClick={onClose} variant="ghost" />
        </div>
        {children}
      </section>
    </div>
  );
}
