import React, { useState } from 'react';
import { useAppStore } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { DataSekolah } from './components/DataSekolah';
import { DataSiswa } from './components/DataSiswa';
import { DataMapel } from './components/DataMapel';
import { InputNilai } from './components/InputNilai';
import { InputCapaian } from './components/InputCapaian';
import { InputEkskul } from './components/InputEkskul';
import { InputKokurikuler } from './components/InputKokurikuler';
import { InputPKL } from './components/InputPKL';
import { CatatanWaliKelas } from './components/CatatanWaliKelas';
import { RekapNilai } from './components/RekapNilai';
import { RaportSiswa } from './components/RaportSiswa';
import { Login } from './components/Login';
import { ClassSelection } from './components/ClassSelection';
import { LayoutDashboard, Users, Building, BookOpen, Book, Star, FileEdit, FileText, Activity, Trophy, Briefcase, MessageSquare, Table, Printer, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function App() {
  const { schoolInfo, resetAllData, user, loading, logout, currentClassId, setCurrentClassId, classes } = useAppStore();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Memuat aplikasi...</div>;
  }

  if (!user) {
    return <Login />;
  }

  if (!currentClassId) {
    return <ClassSelection />;
  }

  const currentClass = classes.find(c => c.id === currentClassId);

  const NavigationItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => {
        setCurrentView(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors text-sm font-medium
        ${currentView === id 
          ? 'bg-green-800 text-white shadow-inner' 
          : 'text-green-100 hover:bg-green-800/50 hover:text-white'}`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header Menu Toggle */}
      <div className="md:hidden bg-[#1B5E20] text-white p-4 flex items-center justify-between shadow-md z-20 print:hidden">
        <div className="flex items-center gap-3">
          {schoolInfo.logo && <img src={schoolInfo.logo} alt="Logo" className="w-8 h-8 rounded-full" />}
          <h1 className="font-bold text-lg truncate flex-1">Raport Digital</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-green-800 rounded focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* SidebarNavigation */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-[#1B5E20] shadow-xl text-white transition-transform duration-300 ease-in-out z-10 flex flex-col shrink-0
        print:hidden
      `}>
        <div className="p-6 pb-2 text-center items-center flex flex-col border-b border-green-800/50 mb-2">
          {schoolInfo.logo && <img src={schoolInfo.logo} alt="Logo" className="w-20 h-20 bg-white p-1 rounded-full mb-3 object-contain" />}
          <h1 className="text-xl font-bold tracking-tight">{currentClass?.name || 'E-Raport SMK'}</h1>
          <p className="text-green-200 text-[10px] mt-1 uppercase tracking-widest bg-green-900/50 p-1.5 rounded truncate w-full" title={schoolInfo.name}>{schoolInfo.name}</p>
          <div className="mt-2 text-xs opacity-75">ID Kelas: {currentClassId}</div>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          <NavigationItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          
          <div className="text-xs uppercase text-green-400 font-bold tracking-wider mt-4 mb-2 px-3 pt-2">Data Master</div>
          <NavigationItem id="sekolah" label="Data Sekolah" icon={Building} />
          <NavigationItem id="siswa" label="Data Siswa" icon={Users} />
          <NavigationItem id="mapel" label="Data Mapel" icon={Book} />
          
          <div className="text-xs uppercase text-green-400 font-bold tracking-wider mt-4 mb-2 px-3 pt-2">Akademik</div>
          <NavigationItem id="input" label="Input Nilai" icon={FileEdit} />
          <NavigationItem id="capaian" label="Capaian Pembelajaran" icon={FileText} />
          
          <div className="text-xs uppercase text-green-400 font-bold tracking-wider mt-4 mb-2 px-3 pt-2">Non-Akademik</div>
          <NavigationItem id="ekskul" label="Extrakurikuler" icon={Activity} />
          <NavigationItem id="kokurikuler" label="Kokurikuler" icon={Trophy} />
          <NavigationItem id="pkl" label="Praktek PKL" icon={Briefcase} />
          <NavigationItem id="catatan" label="Catatan & Presensi" icon={MessageSquare} />
          
          <div className="text-xs uppercase text-green-400 font-bold tracking-wider mt-4 mb-2 px-3 pt-2">Laporan</div>
          <NavigationItem id="leger" label="Leger Raport" icon={Table} />
          <NavigationItem id="cetak" label="Cetak Raport" icon={Printer} />
        </nav>

        <div className="p-4 border-t border-green-800 space-y-2">
          <div className="text-green-300 text-xs px-2 py-1 bg-green-900/30 rounded truncate" title={user.email || ''}>
            👤 {user.email}
          </div>
          <button
            onClick={() => setCurrentClassId(null)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-left text-white hover:bg-green-800/50 transition-colors text-sm"
          >
            <span className="flex items-center gap-3"><ArrowLeft size={18} /> Ganti Kelas</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-left text-white hover:bg-green-800/50 transition-colors text-sm"
          >
            <span className="flex items-center gap-3"><LogOut size={18} /> Logout</span>
          </button>
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-red-300 hover:bg-red-900/50 transition-colors text-sm"
          >
            <Settings size={18} />
            Reset Data
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 print:bg-white print:overflow-visible flex flex-col">
        {/* Dynamic Views */}
        <main className="p-4 md:p-6 print:p-0 flex-1">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'sekolah' && <DataSekolah />}
          {currentView === 'siswa' && <DataSiswa />}
          {currentView === 'mapel' && <DataMapel />}
          {currentView === 'input' && <InputNilai />}
          {currentView === 'capaian' && <InputCapaian />}
          {currentView === 'ekskul' && <InputEkskul />}
          {currentView === 'kokurikuler' && <InputKokurikuler />}
          {currentView === 'pkl' && <InputPKL />}
          {currentView === 'catatan' && <CatatanWaliKelas />}
          {currentView === 'leger' && <RekapNilai getScore={() => 0} />}
          {currentView === 'cetak' && <RaportSiswa getScoreObj={() => null} />}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex-col flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Reset Data?</h3>
            <p className="text-sm text-gray-600 mb-4">Apakah Anda yakin ingin mereset semua data aplikasi ke format awal? Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded" onClick={() => setShowConfirmReset(false)}>Batal</button>
              <button className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded" onClick={() => { resetAllData(); setShowConfirmReset(false); }}>Ya, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


