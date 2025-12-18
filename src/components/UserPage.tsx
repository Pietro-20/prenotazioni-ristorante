import React from "react";

export default function UserPage() {
  return (
    <div>
      <h2>Prenota un tavolo</h2>

      <form style={{ maxWidth: 400 }}>
        <label>Nome</label>
        <input type="text" style={{ width: "100%", marginBottom: 8 }} />

        <label>Telefono</label>
        <input type="text" style={{ width: "100%", marginBottom: 8 }} />

        <label>Data</label>
        <input type="date" style={{ width: "100%", marginBottom: 8 }} />

        <label>Orario</label>
        <input type="time" style={{ width: "100%", marginBottom: 8 }} />

        <label>Numero persone</label>
        <input type="number" min={1} style={{ width: "100%", marginBottom: 12 }} />

        <button type="button">Invia prenotazione</button>
      </form>
    </div>
  );
}
