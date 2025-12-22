import React, { useState, useEffect } from 'react';
import type { Reservation, Occasion, AreaPreference } from '../types';
import { CalendarCheckIcon } from './icons/CalendarCheckIcon';

interface UserPageProps {
  onAddReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => string;
}

const WEBHOOK_URL: string = '';
const PAYPAL_BASE_LINK = 'https://www.paypal.com/ncp/payment/ZB2TVB9ESTVMG';

const getPaypalUrl = (depositAmount: number): string => {
  const separator = PAYPAL_BASE_LINK.includes('?') ? '&' : '?';
  // Aggiunge il parametro amount all'URL base
  return `${PAYPAL_BASE_LINK}${separator}amount=${depositAmount}`;
};

const OCCASIONS: Occasion[] = ['Cena Romantica', 'Compleanno', 'Anniversario', 'Lavoro', 'Casual'];

// Configuration for the 3 Experience Levels
interface ExperiencePackage {
  id: AreaPreference;
  levelName: string;
  title: string;
  priceDisplay: string;
  description: string;
  features: string[];
  color: string;
}

const PACKAGES: ExperiencePackage[] = [
  {
    id: 'Sala Principale',
    levelName: 'Standard Level',
    title: 'Classic Dining',
    priceDisplay: 'Incluso',
    description: 'La nostra elegante sala interna. Perfetta per godersi la cucina senza distrazioni.',
    features: ['Tavolo assegnato all\'arrivo', 'Atmosfera accogliente', 'Servizio Standard'],
    color: 'border-gray-600'
  },
  {
    id: 'Terrazza Panoramica',
    levelName: 'Premium Level',
    title: 'Gold View',
    priceDisplay: '+ 20€ p.p.',
    description: 'Un tavolo garantito in prima fila sulla terrazza con vista mozzafiato sulla città.',
    features: ['Vista garantita', 'Tavolo all\'aperto', 'Calice di benvenuto'],
    color: 'border-gold-400'
  },
  {
    id: 'Privé Esclusivo',
    levelName: 'Exclusive Level',
    title: 'Diamond Club',
    priceDisplay: '+ 50€ p.p.',
    description: 'La massima privacy in un\'area riservata. Un\'esperienza di lusso senza compromessi.',
    features: ['Area Riservata', 'Cameriere dedicato', 'Chef Surprise', 'Privacy assoluta'],
    color: 'border-purple-400'
  }
];

// --- Toast Component for In-App Notifications ---
interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: 'reminder' | 'info' | 'cancel' | 'whatsapp' | 'success';
    actions?: { label: string; onClick: () => void; variant: 'primary' | 'danger' | 'whatsapp' }[];
}

const Toast: React.FC<{ toast: ToastNotification; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        if (toast.type === 'cancel' || toast.type === 'success') {
            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-[95%] max-w-sm animate-fade-in-up">
            <div className={`backdrop-blur-xl border shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex flex-col gap-3 ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/30' : 'bg-dark-800/90 border-gold-500/30'}`}>
                <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-gradient-to-br from-gold-400 to-yellow-600'}`}>
                         <span className="text-lg">
                            {toast.type === 'reminder' ? '🥂' : toast.type === 'cancel' ? '👋' : toast.type === 'success' ? '✓' : 'ℹ️'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-serif font-bold text-base">{toast.title}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed mt-1">{toast.message}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">&times;</button>
                </div>
                
                {toast.actions && toast.actions.length > 0 && (
                    <div className="flex gap-2 mt-1 pt-2 border-t border-white/10">
                        {toast.actions.map((action, idx) => (
                            <button 
                                key={idx}
                                onClick={action.onClick}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    action.variant === 'primary' 
                                    ? 'bg-gold-500 text-black hover:bg-gold-400' 
                                    : action.variant === 'whatsapp'
                                    ? 'bg-[#25D366] text-black hover:bg-[#1DA851]'
                                    : 'bg-white/5 text-gray-300 hover:bg-red-900/30 hover:text-red-400 border border-white/10'
                                }`}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
// ---------------------------------------------

const InputField = ({ id, label, type, value, onChange, required = false, min, max, placeholder = ' ' }: any) => (
  <div className="relative group">
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      placeholder={placeholder}
      className="block px-4 pb-2.5 pt-5 w-full text-sm text-white bg-white/5 rounded-lg border border-white/10 appearance-none focus:outline-none focus:ring-0 focus:border-gold-400 peer transition-all duration-300 [color-scheme:dark] hover:bg-white/10"
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] left-4 peer-focus:text-gold-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 font-sans tracking-wide"
    >
      {label}
    </label>
  </div>
);

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SelectionChip: React.FC<SelectionChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
      selected 
        ? 'bg-gold-500 text-black border-gold-500 shadow-[0_0_10px_rgba(217,119,6,0.4)] transform scale-105' 
        : 'bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white'
    }`}
  >
    {label}
  </button>
);

interface PackageCardProps {
  pkg: ExperiencePackage;
  selected: boolean;
  onClick: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative cursor-pointer group flex flex-col h-full p-5 rounded-xl border transition-all duration-300 ${
      selected 
        ? `bg-white/10 ${pkg.color} shadow-[0_0_20px_rgba(0,0,0,0.5)] transform scale-[1.02]` 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
    }`}
  >
    <div className={`absolute top-4 right-4 h-4 w-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-gold-400 bg-gold-400' : 'border-gray-500'}`}>
      {selected && <div className="h-2 w-2 bg-black rounded-full" />}
    </div>

    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ${
      pkg.id === 'Privé Esclusivo' ? 'text-purple-400' : 
      pkg.id === 'Terrazza Panoramica' ? 'text-gold-400' : 'text-gray-400'
    }`}>
      {pkg.levelName}
    </span>

    <div className="flex justify-between items-end mb-3">
      <h3 className={`text-lg font-serif font-bold ${selected ? 'text-white' : 'text-gray-300'}`}>{pkg.title}</h3>
    </div>
    
    <p className="text-xs text-gray-400 mb-4 leading-relaxed min-h-[40px]">{pkg.description}</p>
    
    <div className="mt-auto space-y-2 border-t border-white/10 pt-3">
      {pkg.features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
          <span className="text-gold-500">✓</span> {feature}
        </div>
      ))}
    </div>

    <div className={`mt-4 pt-2 text-right text-sm font-bold ${pkg.priceDisplay === 'Incluso' ? 'text-green-400' : 'text-gold-400'}`}>
      {pkg.priceDisplay}
    </div>
  </div>
);

const UserPage: React.FC<UserPageProps> = ({ onAddReservation }) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [occasion, setOccasion] = useState<Occasion>('Casual');
  const [area, setArea] = useState<AreaPreference>('Sala Principale');
  const [reminderPreference, setReminderPreference] = useState<'none' | '1h' | '2h' | '3h'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !guests || !date || !time || !phone) { 
        alert('Per favore, compila tutti i campi obbligatori.');
        return;
    }
    setStep('payment');
  };

  const resetForm = () => {
    setName('');
    setGuests('');
    setDate('');
    setTime('');
    setPhone('');
    setNotes('');
    setOccasion('Casual');
    setArea('Sala Principale');
    setReminderPreference('none');
    setStep('form');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !guests || !date || !time || !phone) {
      alert('Per favore, compila tutti i campi obbligatori.');
      return;
    }

    setIsProcessing(true);

    const depositAmount = guests ? parseInt(guests, 10) * 10 : 0;

    const reservationData = {
      name,
      guests: parseInt(guests, 10),
      date,
      time,
      phone,
      notes,
      occasion,
      area,
      depositAmount,
      reminderPreference,
      status: 'pending_payment' as const,
    };

    // 1. Salva nel pannello admin
    onAddReservation(reservationData);

    // 2. (Opzionale) Invia a Make
    if (WEBHOOK_URL && WEBHOOK_URL.startsWith('http')) {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationData),
        });
      } catch (err) {
        console.error('Errore invio a Make:', err);
      }
    }

    // 3. Apri PayPal in una nuova scheda
    if (PAYPAL_BASE_LINK) {
      const paypalUrl = getPaypalUrl(depositAmount);
      window.open(paypalUrl, '_blank');
      setIsProcessing(false);
      setStep('success');
      return;
    }

    setIsProcessing(false);
    setStep('success');
  };
  
  const today = new Date().toISOString().split('T')[0];
  const depositAmount = guests ? parseInt(guests, 10) * 10 : 0;

  return (
    <>
      {activeToast && <Toast toast={activeToast} onClose={() => setActiveToast(null)} />}

      {step === 'success' && (
        <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
          <div className="max-w-md w-full bg-dark-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gold-500/30 text-center shadow-[0_0_50px_rgba(217,119,6,0.2)]">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold-500/40">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Grazie, {name}</h2>
            <p className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-6">Pagamento Depositato con Successo</p>
            
            <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <div className="text-gray-300 text-sm leading-relaxed space-y-3">
                    <p>Hai assicurato il tuo tavolo versando <span className="text-white font-bold">€{depositAmount}</span>.</p>
                    <div className="h-px bg-white/10 w-1/2 mx-auto my-3"></div>
                    <p className="text-xs text-gray-400 italic">
                        "L'importo versato verrà interamente detratto dal conto finale se vi presenterete all'appuntamento. In caso di mancata presenza (no-show) l'importo verrà trattenuto."
                    </p>
                </div>
            </div>
            
            <p className="text-xs text-green-400 mb-6 flex items-center justify-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Riceverai una conferma su WhatsApp a breve.
            </p>

            <button 
              onClick={resetForm}
              className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
            >
              Torna alla Home
            </button>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in-up">
          <div className="max-w-md w-full bg-dark-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2"
              >
                <span>← Modifica dati</span>
              </button>
              <div className="text-xs uppercase tracking-widest text-gold-500 font-bold">
                Pagamento Sicuro
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-white">Conferma &amp; Acconto</h2>
              <p className="text-gray-400 text-sm mt-2">
                Per garantire la tua presenza, richiediamo un piccolo deposito che verrà detratto dal conto finale.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 flex justify-between items-center">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Ospiti</div>
                <div className="text-white font-bold">{guests} persone</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Totale Acconto</div>
                <div className="text-gold-400 font-bold text-xl">€{depositAmount}</div>
                <div className="text-[10px] text-gray-500">(€10 a persona)</div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <p className="text-sm text-gray-300">
                Cliccando sul pulsante qui sotto verrai reindirizzato a{' '}
                <span className="font-bold">PayPal</span> per completare il pagamento
                dell’acconto.
              </p>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-[#FFC439] text-black font-semibold hover:bg-[#FFB020] transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Reindirizzamento in corso...' : 'Paga acconto con PayPal'}
              </button>
            </form>
             <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500">
               <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
               Pagamento crittografato SSL a 256-bit
             </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-12 animate-fade-in-up">
          <div className="w-full max-w-4xl relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="p-6 sm:p-10 bg-dark-800/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
              <div className="text-center mb-10">
                <h3 className="text-gold-500 font-sans text-xs tracking-[0.3em] uppercase mb-2">Prenotazione Online</h3>
                <h2 className="text-4xl sm:text-5xl font-bold text-white font-serif">Crea la tua Esperienza</h2>
                <p className="mt-4 text-gray-400 font-light max-w-lg mx-auto">
                  Scegli il livello di esclusività che desideri per il tuo evento.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-10">
                <div className="space-y-4">
                   <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3 text-center">Seleziona il Pacchetto Esperienza</label>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PACKAGES.map((pkg) => (
                        <PackageCard 
                          key={pkg.id} 
                          pkg={pkg} 
                          selected={area === pkg.id} 
                          onClick={() => setArea(pkg.id)} 
                        />
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField id="name" label="Nome completo" type="text" value={name} onChange={(e: any) => setName(e.target.value)} required />
                  <InputField id="phone" label="Telefono" type="tel" value={phone} onChange={(e: any) => setPhone(e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField id="date" label="Data" type="date" value={date} onChange={(e: any) => setDate(e.target.value)} min={today} required />
                  <InputField id="time" label="Ora" type="time" value={time} onChange={(e: any) => setTime(e.target.value)} required />
                  <InputField id="guests" label="Ospiti" type="number" value={guests} onChange={(e: any) => setGuests(e.target.value)} min="1" max="12" required />
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Occasione Speciale</label>
                    <div className="flex flex-wrap gap-3">
                      {OCCASIONS.map(occ => (
                        <SelectionChip key={occ} label={occ} selected={occasion === occ} onClick={() => setOccasion(occ)} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Vuoi ricevere un promemoria prima della prenotazione?</label>
                    <div className="relative">
                       <select
                         value={reminderPreference}
                         onChange={(e) => setReminderPreference(e.target.value as any)}
                         className="block px-4 py-3 w-full text-sm text-white bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-0 focus:border-gold-400 appearance-none hover:bg-white/10 transition-all cursor-pointer"
                       >
                          <option value="none" className="bg-dark-800 text-gray-300">Nessun promemoria</option>
                          <option value="1h" className="bg-dark-800 text-gray-300">1 ora prima</option>
                          <option value="2h" className="bg-dark-800 text-gray-300">2 ore prima</option>
                          <option value="3h" className="bg-dark-800 text-gray-300">3 ore prima</option>
                       </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-3">Note Aggiuntive</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Allergie, intolleranze o richieste speciali..."
                      className="block px-4 py-3 w-full text-sm text-white bg-white/5 rounded-lg border border-white/10 focus:outline-none focus:ring-0 focus:border-gold-400 transition-all duration-300 min-h-[100px] resize-none hover:bg-white/10"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gold-400 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] flex justify-center items-center gap-2 group"
                >
                  <CalendarCheckIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  Procedi al Pagamento
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;