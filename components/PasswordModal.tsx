import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => void;
  error?: string;
};

export default function PasswordModal({
  isOpen,
  onClose,
  password,
  setPassword,
  onSubmit,
  error,
}: Props) {
  if (!isOpen) return null;

  return (
    <div style={{ padding: 16, border: "1px solid #333", margin: 16 }}>
      <h3>Password</h3>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Inserisci password"
      />
      <button onClick={onSubmit} style={{ marginLeft: 8 }}>Entra</button>
      <button onClick={onClose} style={{ marginLeft: 8 }}>Chiudi</button>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
}
