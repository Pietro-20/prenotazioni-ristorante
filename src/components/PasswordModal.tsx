import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string | null;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit, error }) => {
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-gray-800 rounded-xl shadow-2xl shadow-black/50 border border-amber-500/30 p-8 w-full max-w-sm m-4 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-amber-400 text-center mb-4 font-serif">Accesso Admin</h2>
        <p className="text-gray-400 text-center mb-6">Inserisci la password per continuare.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded-md outline-none focus:border-amber-400 transition-colors"
              placeholder="Password"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button type="submit" className="w-full py-3 px-4 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-all duration-300 ease-in-out transform hover:scale-105">
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;