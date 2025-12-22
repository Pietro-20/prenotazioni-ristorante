import React, { useState } from "react";

import Header from "./components/Header";
import UserPage from "./components/UserPage";
import AdminPage from "./components/AdminPage";
import PasswordModal from "./components/PasswordModal";

// ✅ usa il tuo nome file reale
import { useReservations } from "./hooks/userReservations";

type View = "user" | "admin";

const ADMIN_PASSWORD = "admin"; // cambia dopo

const App: React.FC = () => {
  const [view, setView] = useState<View>("user");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // hook
  const {
    reservations,
    addReservation,
    updateReservation,
    deleteReservation,
  } = useReservations();

  const handleAdminClick = () => {
    setPasswordError(null);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsPasswordModalOpen(false);
      setPasswordError(null);
      setView("admin");
    } else {
      setPasswordError("Password errata");
    }
  };

  return (
    <>
      <Header currentView={view} setView={setView} onAdminClick={handleAdminClick} />

      {view === "user" ? (
        <UserPage
          reservations={reservations}
          addReservation={addReservation}
        />
      ) : (
        <AdminPage
          reservations={reservations}
          updateReservation={updateReservation}
          deleteReservation={deleteReservation}
        />
      )}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        error={passwordError}
      />
    </>
  );
};

export default App;

  
