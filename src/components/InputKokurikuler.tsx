import React, { useRef, useState } from 'react';
import { useAppStore } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { Upload, Download } from 'lucide-react';

export function InputKokurikuler() {
  const { students, kokurikulers, setKokurikulers } = useAppStore();
  const [selectedNis, setSelectedNis] = useState(students[0]?.nis);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const studentKokurikuler = kokurikulers.filter(e => e.studentNis === selectedNis);

  const handleChange = (no: number, deskripsi: string) => {
    let existing = [...kokurikulers];
    const index = existing.findIndex(e => e.studentNis === selectedNis && e.no === no);
    
    if (index >= 0) {
      existing[index] = { ...existing[index], deskripsi };
    } else {
      existing.push({ studentNis: selectedNis, no, deskripsi });
    }
    setKokurikulers(existing);
  };

  const getKoku = (no: number) => {
    return studentKokurikuler.find(e => e.no === no) || { deskripsi: '' };
  };

  const getMaxDeskripsiCount = () => {
    // Determine the max number of deskripsi to show in template. At least 8.
    let max = 8;
    kokurikulers.forEach(k => {
      if (k.no > max) max = k.no;
    });
    return max;
  };

  const handleDownloadTemplate = () => {
    const maxNo = getMaxDeskripsiCount();
    const templateData = students.map(s => {
      const studentData: any = { NIS: s.nis, Nama: s.name };
      const kokuUmum = kokurikulers.find(e => e.studentNis === s.nis && e.no === 0);
      studentData['Deskripsi Umum'] = kokuUmum?.deskripsi || '';
      for (let i = 1; i <= Math.max(8, maxNo); i++) {
        const koku = kokurikulers.find(e => e.studentNis === s.nis && e.no === i);
        studentData[`Deskripsi ${i}`] = koku?.deskripsi || '';
      }
      return studentData;
    });
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format_Kokurikuler");
    XLSX.writeFile(wb, `Format_Kokurikuler.xlsx`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        let successCount = 0;
        let existingKokus = [...kokurikulers];

        data.forEach((row: any) => {
          const nis = row['NIS'] ? String(row['NIS']).trim() : undefined;
          
          if (nis) {
            // Check all columns
            Object.keys(row).forEach(originalKey => {
              const key = originalKey.trim();
              if (key === 'Deskripsi Umum') {
                const deskripsi = row[originalKey] ? String(row[originalKey]).trim() : '';
                const index = existingKokus.findIndex(e => e.studentNis === nis && e.no === 0);
                if (index >= 0) {
                  existingKokus[index].deskripsi = deskripsi;
                } else if (deskripsi) {
                  existingKokus.push({ studentNis: nis, no: 0, deskripsi });
                }
              } else if (key.startsWith('Deskripsi ')) {
                const noStr = key.replace('Deskripsi ', '');
                const no = parseInt(noStr, 10);
                if (!isNaN(no) && no > 0) {
                  const deskripsi = row[originalKey] ? String(row[originalKey]).trim() : '';
                  
                  const index = existingKokus.findIndex(e => e.studentNis === nis && e.no === no);
                  if (index >= 0) {
                    existingKokus[index].deskripsi = deskripsi;
                  } else if (deskripsi) {
                    existingKokus.push({ studentNis: nis, no, deskripsi });
                  }
                }
              }
            });
            successCount++;
          }
        });

        setKokurikulers(existingKokus);
        setToastMessage(`Berhasil mengimpor data kokurikuler untuk ${successCount} siswa.`);
        setTimeout(() => setToastMessage(''), 3000);
        
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan formatnya sesuai template.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl relative">
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-10 shadow-sm transition-opacity duration-300">
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Kegiatan Kokurikuler (P5)</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            <Download size={16} /> Template
          </button>
          
          <div className="relative">
            <input 
              type="file" 
              accept=".xlsx,.xls"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
            >
              <Upload size={16} /> Import Excel
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Siswa</label>
        <select value={selectedNis} onChange={(e) => setSelectedNis(e.target.value)} className="border-gray-300 rounded p-2 border focus:ring-green-500 w-full md:w-1/2">
          {students.map(s => <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>)}
        </select>
      </div>

      <div className="space-y-4">
        <div className="border rounded-md p-3 mb-4 bg-blue-50 border-blue-200">
          <label className="block text-sm font-medium text-blue-800 mb-1">Deskripsi Umum (Atas)</label>
          <textarea 
            className="w-full border-gray-300 rounded p-2 text-sm focus:ring-blue-500 border outline-none bg-white" 
            rows={3} 
            value={getKoku(0).deskripsi} 
            onChange={(e) => handleChange(0, e.target.value)}
            placeholder="Contoh: Ananda ... menunjukan capaian yang baik dalam kokurikuler di sekolah..."
          />
        </div>

        {Array.from({ length: Math.max(8, studentKokurikuler.filter(e => e.no > 0).length) }, (_, i) => i + 1).map(no => {
          const data = getKoku(no);
          return (
            <div key={no} className="border rounded-md p-3 bg-gray-50 flex gap-3 text-sm">
              <div className="flex-none font-medium text-gray-500 w-6 pt-2 text-right">{no}.</div>
              <div className="flex-1">
                <textarea 
                  className="w-full border-gray-300 rounded p-2 text-sm focus:ring-green-500 border outline-none" 
                  rows={2} 
                  value={data.deskripsi} 
                  onChange={(e) => handleChange(no, e.target.value)}
                  placeholder={`Deskripsi kompetensi / kegiatan ke-${no}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
