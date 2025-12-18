import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

export default function PasswordModal({ isOpen, error, onClose, onSubmit }: Props) {
  const [pwd, setPwd] = useState("");

  if (!isOpen) return null;

  return (
    <div style={{ padding: 16, borderTop: "1px solid #ddd" }}>
      <h3>Password admin</h3>
      <input
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        placeholder="password"
      />
      <button onClick={() => onSubmit(pwd)} style={{ marginLeft: 8 }}>
        Entra
      </button>
      <button onClick={onClose} style={{ marginLeft: 8 }}>
        Chiudi
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
