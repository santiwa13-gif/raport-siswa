import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';

export function InputEkskul() {
  const { students, ekskuls, setEkskuls } = useAppStore();
  const [selectedNis, setSelectedNis] = useState(students[0]?.nis);

  const studentEkskuls = ekskuls.filter(e => e.studentNis === selectedNis);

  const handleChange = (no: number, field: string, value: string) => {
    let existing = [...ekskuls];
    const index = existing.findIndex(e => e.studentNis === selectedNis && e.no === no);
    
    if (index >= 0) {
      const updated = { ...existing[index], [field]: value };
      if (field === 'kegiatan' || field === 'nilai') {
        const valForDesc = field === 'nilai' ? value : updated.nilai;
        updated.keterangan = !updated.kegiatan || !valForDesc ? '' : `Melaksanakan kegiatan ${updated.kegiatan.trim()} dengan ${valForDesc}`;
      }
      existing[index] = updated;
    } else {
      const kegiatan = field === 'kegiatan' ? value : '';
      const nilai = field === 'nilai' ? value : '';
      const keterangan = !kegiatan || !nilai ? '' : `Melaksanakan kegiatan ${kegiatan.trim()} dengan ${nilai}`;
      existing.push({ studentNis: selectedNis, no, kegiatan, nilai, keterangan });
    }
    setEkskuls(existing);
  };

  const getEskul = (no: number) => {
    return studentEkskuls.find(e => e.no === no) || { kegiatan: '', nilai: '', keterangan: '' };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Kegiatan Ekstrakurikuler</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Siswa</label>
        <select value={selectedNis} onChange={(e) => setSelectedNis(e.target.value)} className="border-gray-300 rounded p-2 border focus:ring-green-500 w-full md:w-1/2">
          {students.map(s => <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>)}
        </select>
      </div>

      <table className="w-full text-sm text-left border-collapse border border-gray-200">
        <thead className="bg-gray-50 text-gray-700 border-b">
          <tr>
            <th className="px-4 py-2 border-r w-12 text-center">No</th>
            <th className="px-4 py-2 border-r">Kegiatan Ekstrakurikuler</th>
            <th className="px-4 py-2 border-r w-24">Nilai</th>
            <th className="px-4 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(3, studentEkskuls.length + 1) }, (_, i) => i + 1).map(no => {
            const data = getEskul(no);
            return (
              <tr key={no} className="border-b">
                <td className="px-4 py-2 text-center border-r">{no}</td>
                <td className="px-2 py-2 border-r">
                  <input type="text" className="w-full border p-1" value={data.kegiatan} onChange={(e) => handleChange(no, 'kegiatan', e.target.value)} />
                </td>
                <td className="px-2 py-2 border-r">
                  <select className="w-full border p-1 text-center bg-white" value={data.nilai} onChange={(e) => handleChange(no, 'nilai', e.target.value)}>
                    <option value="">-</option>
                    <option value="Sangat baik">Sangat baik</option>
                    <option value="Baik">Baik</option>
                    <option value="Cukup baik">Cukup baik</option>
                    <option value="Kurang baik">Kurang baik</option>
                  </select>
                </td>
                <td className="px-2 py-2">
                  <input type="text" className="w-full border p-1 bg-gray-50 text-gray-600" value={data.keterangan} readOnly disabled />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
