import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';

export function CatatanWaliKelas() {
  const { students, attendances, setAttendances } = useAppStore();
  const [selectedNis, setSelectedNis] = useState(students[0]?.nis);

  const RANDOM_NOTES = [
    "Belajar adalah kunci kesuksesan, oleh karena itu terus tingkatkan motivasi belajarmu untuk mengejar masa depanmu yang lebih baik.",
    "Semangat belajar, terus berkarya dan selalu bersyukur kepada Tuhan Yang Maha Esa di setiap kegiatan yang kamu lakukan.",
    "Selamat atas prestasi baik yang kamu raih di semester ini, semoga kedepannya kamu tetap bisa mempertahankan dan menjadi pribadi yang lebih baik lagi.",
    "Belajarlah dengan sungguh-sungguh untuk bisa mendapatkan prestasi yang lebih baik lagi di semester berikutnya.",
    "Terus tingkatkan cara belajarmu supaya bisa mendapatkan nilai dan prestasi yang lebih baik lagi.",
    "Terus tingkatkan motivasi belajarmu supaya bisa menjadi siswa yang berprestasi dan memanggakan orang tua.",
    "Pertahankan prestasi yang kamu dapatkan. Semangatmu dalam belajar selama ini sangat membanggakan para guru dan juga orang tuamu.",
    "Jadilah siswa yang berprestasi dan membanggakan, hindari perilaku yang bisa merugikan orang lain dan dirimu sendiri. Bapak Ibu guru sangat menghargaimu!",
    "Tunjukkan semangat lebih dalam belajar, jaga kesehatanmu dan patuhi orang-orang yang ada disekitarmu",
    "Jangan terlalu banyak bermain, teruslah belajar agar menjadi pribadi yang sukses di masa depan."
  ];

  const handleRandomize = () => {
    const randomNote = RANDOM_NOTES[Math.floor(Math.random() * RANDOM_NOTES.length)];
    handleChange('catatanWaliKelas', randomNote);
  };

  const handleRandomizeAll = () => {
    const newAttendances = [...attendances];
    
    students.forEach(student => {
      const idx = newAttendances.findIndex(a => a.studentNis === student.nis);
      const randomNote = RANDOM_NOTES[Math.floor(Math.random() * RANDOM_NOTES.length)];
      
      if (idx >= 0) {
        newAttendances[idx] = { ...newAttendances[idx], catatanWaliKelas: randomNote };
      } else {
        newAttendances.push({
          studentNis: student.nis,
          sakit: 0,
          izin: 0,
          tanpaKeterangan: 0,
          catatanWaliKelas: randomNote,
          naikKelas: 'XII. TKR-4'
        });
      }
    });
    
    setAttendances(newAttendances);
  };
  const getAttendance = (nis: string) => {
    return attendances.find(a => a.studentNis === nis) || { sakit: 0, izin: 0, tanpaKeterangan: 0, catatanWaliKelas: '', naikKelas: 'XII. TKR-4' };
  };

  const handleChange = (field: string, value: string | number) => {
    let existing = [...attendances];
    const index = existing.findIndex(a => a.studentNis === selectedNis);
    
    if (index >= 0) {
      existing[index] = { ...existing[index], [field]: value };
    } else {
      existing.push({ 
        studentNis: selectedNis, 
        sakit: field==='sakit'?Number(value):0, 
        izin: field==='izin'?Number(value):0, 
        tanpaKeterangan: field==='tanpaKeterangan'?Number(value):0, 
        catatanWaliKelas: field==='catatanWaliKelas'?String(value):'',
        naikKelas: field==='naikKelas'?String(value):'XII. TKR-4'
      });
    }
    setAttendances(existing);
  };

  const data = getAttendance(selectedNis);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Catatan Wali Kelas & Ketidakhadiran</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Siswa</label>
        <select value={selectedNis} onChange={(e) => setSelectedNis(e.target.value)} className="border-gray-300 rounded p-2 border focus:ring-green-500 w-full md:w-2/3">
          {students.map(s => <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-gray-200 rounded p-4">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Ketidakhadiran</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label>Sakit</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={data.sakit} onChange={e => handleChange('sakit', e.target.value)} className="border p-1 w-16 text-center rounded" />
                <span className="text-sm">Hari</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label>Izin</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={data.izin} onChange={e => handleChange('izin', e.target.value)} className="border p-1 w-16 text-center rounded" />
                <span className="text-sm">Hari</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label>Tanpa Keterangan</label>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={data.tanpaKeterangan} onChange={e => handleChange('tanpaKeterangan', e.target.value)} className="border p-1 w-16 text-center rounded" />
                <span className="text-sm">Hari</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 flex flex-col">
          <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Catatan/Kenaikan</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kenaikan Kelas Tujuan</label>
            <input type="text" placeholder="Cth: XII TKR 4 / Tidak Naik" value={data.naikKelas} onChange={e => handleChange('naikKelas', e.target.value)} className="border p-2 w-full rounded focus:ring-green-500" />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Catatan Wali Kelas</label>
              <div className="space-x-2">
                <button onClick={handleRandomize} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded">Isi Acak (Siswa Ini)</button>
              </div>
            </div>
            <textarea value={data.catatanWaliKelas} onChange={e => handleChange('catatanWaliKelas', e.target.value)} className="border p-2 w-full rounded focus:ring-green-500 flex-1 min-h-[100px]" placeholder="Masukkan catatan..."></textarea>
            <div className="mt-2 text-right">
              <button onClick={handleRandomizeAll} className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 py-1 px-2 rounded">Isi Acak (Semua Siswa)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
