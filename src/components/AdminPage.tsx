import React, { useState, useMemo } from 'react';
import { Reservation, ReservationStatus, Occasion, AreaPreference } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CancelIcon } from './icons/CancelIcon';
import { SearchIcon } from './icons/SearchIcon';

interface AdminPageProps {
    reservations: Reservation[];
    onUpdateReservation: (reservation: Reservation) => void;
    onDeleteReservation: (id: string) => void;
}

// Helper components for the dashboard
const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="bg-dark-800/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold-500/30 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-gold-500">{icon}</div>
        <h4 className="text-gray-400 text-sm font-medium tracking-wider uppercase">{title}</h4>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-serif">{value}</span>
            {trend && <span className="text-xs text-green-400">{trend}</span>}
        </div>
    </div>
);

export const AdminPage: React.FC<AdminPageProps> = ({ reservations, onUpdateReservation, onDeleteReservation }) => {
    const [viewMode, setViewMode] = useState<'list' | 'floor'>('list');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

    // Filter States
    const [dateFilter, setDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [areaFilter, setAreaFilter] = useState<AreaPreference | 'Tutti'>('Tutti');

    // Dashboard Stats Calculation
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysReservations = reservations.filter(r => r.date === today);
        const totalCovers = todaysReservations.reduce((sum, r) => sum + (r.status !== ReservationStatus.Cancelled ? r.guests : 0), 0);
        const pendingCount = reservations.filter(r => r.status === ReservationStatus.Pending).length;

        return {
            coversToday: totalCovers,
            pending: pendingCount,
            activeTables: todaysReservations.filter(r => r.status === ReservationStatus.Seated).length
        };
    }, [reservations]);

    const filteredReservations = useMemo(() => {
        return reservations
            .filter(res => {
                const matchDate = dateFilter ? res.date === dateFilter : true;
                const matchName = res.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchArea = areaFilter === 'Tutti' || res.area === areaFilter;
                return matchDate && matchName && matchArea;
            })
            .sort((a, b) => {
                if (a.date !== b.date) return a.date.localeCompare(b.date);
                return a.time.localeCompare(b.time);
            });
    }, [reservations, dateFilter, searchQuery, areaFilter]);

    const handleEdit = (reservation: Reservation) => {
        setEditingId(reservation.id);
        setCurrentReservation({ ...reservation });
    };

    const handleSave = () => {
        if (currentReservation) {
            onUpdateReservation(currentReservation);
        }
        setEditingId(null);
        setCurrentReservation(null);
    };

    const getStatusColor = (status: ReservationStatus) => {
        switch (status) {
            case ReservationStatus.Pending: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case ReservationStatus.Confirmed: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case ReservationStatus.Seated: return 'bg-green-500/20 text-green-300 border-green-500/30';
            case ReservationStatus.Completed: return 'bg-gray-700/50 text-gray-400 border-gray-600';
            case ReservationStatus.Cancelled: return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-800 text-gray-300';
        }
    };

    const getOccasionIcon = (occasion: Occasion) => {
        switch (occasion) {
            case 'Compleanno': return '🎂';
            case 'Cena Romantica': return '❤️';
            case 'Anniversario': return '🥂';
            case 'Lavoro': return '💼';
            default: return '🍽️';
        }
    };

    const areas: (AreaPreference | 'Tutti')[] = ['Tutti', 'Sala Principale', 'Terrazza Panoramica', 'Privé Esclusivo'];

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Top Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Coperti Oggi"
                    value={stats.coversToday}
                    icon={<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>}
                />
                <StatCard
                    title="Richieste Pendenti"
                    value={stats.pending}
                    trend={stats.pending > 0 ? "Richiede Azione" : "Tutto pulito"}
                    icon={<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>}
                />
                <StatCard
                    title="Tavoli Attivi"
                    value={stats.activeTables}
                    icon={<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z" /></svg>}
                />
            </div>

            {/* Search and Date Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-2 bg-dark-800/50 p-2 rounded-xl border border-white/5 flex items-center gap-3 px-4 focus-within:border-gold-400/50 focus-within:bg-dark-800 transition-all">
                    <SearchIcon className="text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cerca cliente (es. Mario)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 h-10"
                    />
                </div>

                {/* Date Picker */}
                <div className="bg-dark-800/50 p-2 rounded-xl border border-white/5 flex flex-col justify-center relative">
                    <label className="absolute top-1 left-4 text-[10px] text-gray-500 uppercase tracking-wider">Filtra Data</label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="bg-transparent text-white border-none outline-none text-center w-full font-sans h-10 mt-2 cursor-pointer [color-scheme:dark]"
                    />
                    {dateFilter && (
                        <button
                            onClick={() => setDateFilter('')}
                            className="absolute right-2 top-3 text-xs text-gray-500 hover:text-white"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Area & View Mode Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-dark-800/30 p-4 rounded-xl border border-white/5">

                <div className="flex flex-wrap gap-2">
                    {areas.map(area => {
                        const isSelected = areaFilter === area;
                        let activeClass = "bg-white text-black border-white";
                        if (area === 'Terrazza Panoramica') activeClass = "bg-gold-500 text-black border-gold-500";
                        if (area === 'Privé Esclusivo') activeClass = "bg-purple-500 text-white border-purple-500";

                        return (
                            <button
                                key={area}
                                onClick={() => setAreaFilter(area)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected ? activeClass : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {area}
                            </button>
                        )
                    })}
                </div>

                <div className="flex bg-dark-900 p-1 rounded-lg border border-gray-700 shrink-0">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('floor')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'floor' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Vista Sala
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {viewMode === 'list' ? (
                <div className="bg-dark-800 rounded-xl border border-white/10 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-dark-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data & Ora</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Occasione</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Area</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stato</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-dark-800/50">
                                {filteredReservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                                        {editingId === res.id && currentReservation ? (
                                            // Edit Mode List
                                            <>
                                                <td className="px-6 py-4"><input className="w-full bg-dark-900 text-white p-2 rounded border border-gray-700" value={currentReservation.name} onChange={e => setCurrentReservation({ ...currentReservation, name: e.target.value })} /></td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-2">
                                                        <input type="date" className="w-full bg-dark-900 text-white p-1 rounded border border-gray-700 [color-scheme:dark]" value={currentReservation.date} onChange={e => setCurrentReservation({ ...currentReservation, date: e.target.value })} />
                                                        <input type="time" className="w-full bg-dark-900 text-white p-1 rounded border border-gray-700 [color-scheme:dark]" value={currentReservation.time} onChange={e => setCurrentReservation({ ...currentReservation, time: e.target.value })} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 italic">Non modificabile</td>
                                                <td className="px-6 py-4 text-gray-500 italic">Non modificabile</td>
                                                <td className="px-6 py-4">
                                                    <select className="bg-dark-900 text-white p-2 rounded border border-gray-700 w-full" value={currentReservation.status} onChange={e => setCurrentReservation({ ...currentReservation, status: e.target.value as ReservationStatus })}>
                                                        {Object.values(ReservationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={handleSave} className="text-green-400 p-1 hover:bg-green-500/10 rounded"><SaveIcon /></button>
                                                        <button onClick={() => setEditingId(null)} className="text-gray-400 p-1 hover:bg-white/10 rounded"><CancelIcon /></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // View Mode List
                                            <>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-white text-lg">{res.name}</span>
                                                        <span className="text-sm text-gray-500">{res.phone}</span>
                                                        {res.depositAmount > 0 && (
                                                            <span className="text-xs text-green-400 font-bold mt-1 bg-green-900/20 px-2 py-0.5 rounded w-fit border border-green-500/20">
                                                                Acconto: -€{res.depositAmount}
                                                            </span>
                                                        )}
                                                        {res.notes && <span className="text-xs text-red-300 mt-1 bg-red-900/20 px-2 py-1 rounded w-fit">⚠️ {res.notes}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-300">
                                                        <div className="font-bold">{res.date}</div>
                                                        <div className="font-mono text-gold-500">{res.time}</div>
                                                        <div className="text-xs text-gray-500 mt-1">{res.guests} ospiti</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                        <span>{getOccasionIcon(res.occasion)}</span>
                                                        {res.occasion}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${res.area === 'Privé Esclusivo' ? 'text-purple-400' :
                                                        res.area === 'Terrazza Panoramica' ? 'text-gold-400' : 'text-gray-400'
                                                        }`}>
                                                        {res.area}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(res.status)}`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => handleEdit(res)} className="text-gray-400 hover:text-gold-400 transition-colors"><EditIcon /></button>
                                                        <button onClick={() => onDeleteReservation(res.id)} className="text-gray-400 hover:text-red-400 transition-colors"><DeleteIcon /></button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {filteredReservations.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center gap-2">
                                            <SearchIcon className="w-8 h-8 text-gray-700" />
                                            <span>Nessuna prenotazione trovata.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // Visual Floor Plan View
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {areas.filter(a => a !== 'Tutti').map(area => (
                        (areaFilter === 'Tutti' || areaFilter === area) && (
                            <div key={area} className="bg-dark-800/80 border border-white/10 rounded-2xl p-6">
                                <h3 className={`text-xl border-b border-white/5 pb-4 mb-4 flex justify-between items-center font-serif ${area === 'Privé Esclusivo' ? 'text-purple-400' :
                                    area === 'Terrazza Panoramica' ? 'text-gold-400' : 'text-gray-200'
                                    }`}>
                                    {area}
                                    <span className="text-xs font-sans text-gray-500 uppercase tracking-wide">Zona</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredReservations.filter(r => r.area === area).map(res => (
                                        <div key={res.id} className={`p-4 rounded-xl border transition-all ${editingId === res.id ? 'bg-dark-900 border-gold-500 ring-1 ring-gold-500' :
                                            res.status === ReservationStatus.Seated ? 'bg-green-900/20 border-green-500/50' : 'bg-dark-900 border-gray-700 hover:border-gold-500/50'
                                            }`}>
                                            {editingId === res.id && currentReservation ? (
                                                // Edit Mode CARD
                                                <div className="space-y-3">
                                                    <div className="text-xs uppercase text-gold-500 font-bold mb-2">Modifica Rapida</div>
                                                    <input
                                                        className="w-full bg-black/50 text-white p-2 rounded border border-gray-700 text-sm"
                                                        value={currentReservation.name}
                                                        onChange={e => setCurrentReservation({ ...currentReservation, name: e.target.value })}
                                                        placeholder="Nome"
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <input type="date" className="bg-black/50 text-white p-1 rounded border border-gray-700 text-xs [color-scheme:dark]" value={currentReservation.date} onChange={e => setCurrentReservation({ ...currentReservation, date: e.target.value })} />
                                                        <input type="time" className="bg-black/50 text-white p-1 rounded border border-gray-700 text-xs [color-scheme:dark]" value={currentReservation.time} onChange={e => setCurrentReservation({ ...currentReservation, time: e.target.value })} />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-black/50 text-white p-2 rounded border border-gray-700 text-sm"
                                                        value={currentReservation.guests}
                                                        onChange={e => setCurrentReservation({ ...currentReservation, guests: parseInt(e.target.value) || 0 })}
                                                        placeholder="Ospiti"
                                                    />
                                                    <select className="w-full bg-black/50 text-white p-2 rounded border border-gray-700 text-xs" value={currentReservation.status} onChange={e => setCurrentReservation({ ...currentReservation, status: e.target.value as ReservationStatus })}>
                                                        {Object.values(ReservationStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <div className="flex justify-end gap-2 mt-2 border-t border-white/10 pt-2">
                                                        <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-500">Salva</button>
                                                        <button onClick={() => setEditingId(null)} className="bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600">Annulla</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode CARD
                                                <>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-2xl">{getOccasionIcon(res.occasion)}</span>
                                                        <div className="text-right">
                                                            <div className="font-mono text-sm text-gold-500">{res.time}</div>
                                                            <div className="text-[10px] text-gray-500">{res.date}</div>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-white truncate">{res.name}</div>
                                                    <div className="text-sm text-gray-400 mb-2">{res.guests} ospiti</div>

                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {res.notes && <div className="text-xs text-red-300 bg-red-900/10 p-1 rounded line-clamp-1 w-full">⚠️ {res.notes}</div>}
                                                        {res.depositAmount > 0 && <div className="text-[10px] text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-500/20 w-fit">€{res.depositAmount} Pagati</div>}
                                                    </div>

                                                    <div className="flex gap-2 mt-2">
                                                        {res.status !== ReservationStatus.Seated && res.status !== ReservationStatus.Completed && (
                                                            <button
                                                                onClick={() => onUpdateReservation({ ...res, status: ReservationStatus.Seated })}
                                                                className="flex-1 bg-green-600/20 text-green-400 text-xs py-1.5 rounded hover:bg-green-600/30 transition-colors"
                                                            >
                                                                Accomoda
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleEdit(res)}
                                                            className="bg-gray-700 text-gray-300 p-1.5 rounded hover:bg-gray-600 flex-shrink-0"
                                                            title="Modifica"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {filteredReservations.filter(r => r.area === area).length === 0 && (
                                        <div className="col-span-1 sm:col-span-2 py-8 text-center border-2 border-dashed border-gray-800 rounded-xl text-gray-600 text-sm">
                                            Nessuna prenotazione in questa zona.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
};
