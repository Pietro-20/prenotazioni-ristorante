import React, { useState } from 'react';
import Header from './components/Header';
import UserPage from './components/UserPage.tsx';
import AdminPage from './components/AdminPage';
import PasswordModal from './components/PasswordModal';
import { useReservations } from './hooks/useReservations';

type View = 'user' | 'admin';

const ADMIN_PASSWORD = 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const { reservations, addReservation, updateReservation, deleteReservation } = useReservations();

  const handleAdminAccess = () => {
    setIsPasswordModalOpen(true);
    setPasswordError(null);
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setView('admin');
      setIsPasswordModalOpen(false);
    } else {
      setPasswordError('Password errata. Riprova.');
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Header 
        currentView={view} 
        setView={setView} 
        onAdminClick={handleAdminAccess} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {view === 'user' ? (
          <UserPage 
            onAddReservation={addReservation} 
          />
        ) : (
          <AdminPage 
            reservations={reservations}
            onUpdateReservation={updateReservation}
            onDeleteReservation={deleteReservation}
          />
        )}
      </main>
      {isPasswordModalOpen && (
        <PasswordModal 
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
        />
      )}
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Ristorante Oro Nero. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
};

export default App;
