import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { getPredicate } from '../utils';
import { PrintCover } from './PrintCover';
import { PrintIdentitas } from './PrintIdentitas';
import { PrintNilai } from './PrintNilai';

export function RaportSiswa({}: any) {
  const { students } = useAppStore();
  const [selectedNis, setSelectedNis] = useState(students[0]?.nis);
  
  const student = students.find(s => s.nis === selectedNis);

  const handlePrint = () => {
    window.print();
  };

  if (!student) return <div className="p-4">Belum ada data siswa.</div>;

  return (
    <div className="space-y-4">
      {/* Print Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Pilih Siswa:</label>
          <select
            value={selectedNis}
            onChange={(e) => setSelectedNis(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 border p-2 w-full sm:w-64 text-sm"
          >
            {students.map((s) => (
              <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>
            ))}
          </select>
        </div>
        <button onClick={handlePrint} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Cetak Raport Lengkap
        </button>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col gap-8 print:gap-0 font-['Times_New_Roman',serif]">
        
        {/* Halaman 1: Cover */}
        <div className="bg-white shadow-md mx-auto p-12 print:shadow-none print:p-0 w-[210mm] min-h-[297mm] print:w-full print:min-h-0 break-after-page">
          <PrintCover student={student} />
        </div>

        {/* Halaman 2: Identitas Peserta Didik */}
        <div className="bg-white shadow-md mx-auto p-12 print:shadow-none print:p-0 w-[210mm] min-h-[297mm] print:w-full print:min-h-0 break-after-page">
          <PrintIdentitas student={student} />
        </div>

        {/* Halaman 3+: Raport / Nilai */}
        <div className="bg-white shadow-md mx-auto p-10 print:shadow-none print:p-0 w-[210mm] min-h-[297mm] print:w-full print:min-h-0">
          <PrintNilai student={student} />
        </div>

      </div>
    </div>
  );
}
