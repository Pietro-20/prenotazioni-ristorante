import React, { useState } from "react";

import Header from "./components/Header";
import UserPage from "./components/UserPage";
import AdminPage from "./components/AdminPage";
import PasswordModal from "./components/PasswordModal";

import { useReservations } from "./hooks/useReservations";

type View = "user" | "admin";

const ADMIN_PASSWORD = "admin";

export default function App() {
  const [view, setView] = useState<View>("user");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    reservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservations();

  const handleAdminAccess = () => {
    setIsPasswordModalOpen(true);
    setPasswordError(null);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setView("admin");
      setIsPasswordModalOpen(false);
      setPasswordError(null);
      return;
    }
    setPasswordError("Password errata");
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError(null);
  };

  return (
    <div>
      <Header
        onUserClick={() => setView("user")}
        onAdminClick={handleAdminAccess}
      />

      {view === "user" ? (
        <UserPage onSubmit={addReservation} />
      ) : (
        <AdminPage
          reservations={reservations}
          onUpdate={updateReservation}
          onDelete={deleteReservation}
        />
      )}

      {isPasswordModalOpen && (
        <PasswordModal
          error={passwordError}
          onSubmit={handlePasswordSubmit}
          onClose={handleClosePasswordModal}
        />
      )}
    </div>
  );
}
