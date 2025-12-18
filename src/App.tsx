import React, { useState } from "react";
import Header from "./components/Header";
import UserPage from "./components/UserPage";
import AdminPage from "./components/AdminPage";
import PasswordModal from "./components/PasswordModal";

type View = "user" | "admin";
const ADMIN_PASSWORD = "admin";

export default function App() {
  const [view, setView] = useState<View>("user");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const onAdminClick = () => {
    setIsPasswordModalOpen(true);
    setPasswordError(null);
  };

  const onPasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setView("admin");
      setIsPasswordModalOpen(false);
      setPasswordError(null);
    } else {
      setPasswordError("Password errata");
    }
  };

  return (
    <div>
      <Header
        currentView={view}
        setView={setView}
        onAdminClick={onAdminClick}
      />

      {view === "user" ? <UserPage /> : <AdminPage />}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        error={passwordError}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={onPasswordSubmit}
      />
    </div>
  );
}
