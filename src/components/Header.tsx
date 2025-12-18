import React from "react";

type View = "user" | "admin";
type Props = {
  currentView: View;
  setView: (v: View) => void;
  onAdminClick: () => void;
};

export default function Header({ setView, onAdminClick }: Props) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
      <strong>Prenotazioni Ristorante</strong>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setView("user")}>Prenota</button>
        <button onClick={onAdminClick}>Gestione</button>
      </div>
    </header>
  );
}
