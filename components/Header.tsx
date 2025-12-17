import React from "react";

type HeaderProps = {
  currentView: "user" | "admin";
  setView: (view: "user" | "admin") => void;
  onAdminClick: () => void;
};

export default function Header({ currentView, setView, onAdminClick }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3">
      <div className="font-bold">PRENOTAZIONE RISTORANTE</div>

      <div className="flex gap-2">
        <button onClick={() => setView("user")}>
          Prenota
        </button>

        <button onClick={onAdminClick}>
          Gestione
        </button>
      </div>
    </header>
  );
}
