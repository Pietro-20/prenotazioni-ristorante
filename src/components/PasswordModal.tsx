import React, { useState } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    error: string | null;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                <h2 className="text-xl font-serif text-gold-500 mb-4">Area Riservata</h2>
                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="Inserisci password admin..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-white focus:border-gold-500/50 outline-none transition-colors"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-2 justify-end pt-2">
                        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                            Annulla
                        </button>
                        <button
                            onClick={() => onSubmit(password)}
                            className="bg-gold-500 text-black px-6 py-2 rounded-xl font-medium hover:bg-gold-400 transition-colors"
                        >
                            Accedi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

