import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';

export function InputPKL() {
  const { students, pkls, setPkls } = useAppStore();
  const [selectedNis, setSelectedNis] = useState(students[0]?.nis);

  const studentPkl = pkls.filter(e => e.studentNis === selectedNis);

  const generateKeterangan = (nilai: string) => {
    if (!nilai || !nilai.trim()) return '';
    const n = parseFloat(nilai.replace(',', '.'));
    if (isNaN(n)) return '';
    if (n >= 91) return 'Istimewa';
    if (n >= 90) return 'Sangat Kompeten';
    if (n >= 80) return 'Kompeten';
    if (n >= 70) return 'Cukup Kompeten';
    if (n >= 60) return 'Tidak Kompeten';
    return 'Tidak Kompeten';
  };

  const handleChange = (no: number, field: string, value: string) => {
    let existing = [...pkls];
    const index = existing.findIndex(e => e.studentNis === selectedNis && e.no === no);
    
    if (index >= 0) {
      const updated = { ...existing[index], [field]: value };
      if (field === 'nilai') {
        updated.keterangan = generateKeterangan(updated.nilai);
      }
      existing[index] = updated;
    } else {
      const mitra = field === 'mitra' ? value : '';
      const lokasi = field === 'lokasi' ? value : '';
      const lamanya = field === 'lamanya' ? value : '';
      const nilai = field === 'nilai' ? value : '';
      const keterangan = generateKeterangan(nilai);
      existing.push({ studentNis: selectedNis, no, mitra, lokasi, lamanya, nilai, keterangan });
    }
    setPkls(existing);
  };

  const getPkl = (no: number) => {
    return studentPkl.find(e => e.no === no) || { mitra:'', lokasi:'', lamanya:'', nilai:'', keterangan:'' };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-5xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Praktek Kerja Lapangan (PKL)</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Siswa</label>
        <select value={selectedNis} onChange={(e) => setSelectedNis(e.target.value)} className="border-gray-300 rounded p-2 border focus:ring-green-500 w-full md:w-1/2">
          {students.map(s => <option key={s.nis} value={s.nis}>{s.name} ({s.nis})</option>)}
        </select>
      </div>

      <table className="w-full text-sm text-left border-collapse border border-gray-200">
        <thead className="bg-gray-50 text-gray-700 border-b text-xs uppercase">
          <tr>
            <th className="px-2 py-2 border-r w-10 text-center">No</th>
            <th className="px-2 py-2 border-r">Mitra / DU / DI</th>
            <th className="px-2 py-2 border-r w-32">Lokasi</th>
            <th className="px-2 py-2 border-r w-20 text-center">Lama(Bulan)</th>
            <th className="px-2 py-2 border-r w-16 text-center">Nilai</th>
            <th className="px-2 py-2">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(3, studentPkl.length + 1) }, (_, i) => i + 1).map(no => {
            const data = getPkl(no);
            return (
              <tr key={no} className="border-b">
                <td className="px-2 py-2 text-center border-r">{no}</td>
                <td className="px-2 py-2 border-r">
                  <input type="text" className="w-full border p-1" value={data.mitra} onChange={(e) => handleChange(no, 'mitra', e.target.value)} />
                </td>
                <td className="px-2 py-2 border-r">
                  <input type="text" className="w-full border p-1" value={data.lokasi} onChange={(e) => handleChange(no, 'lokasi', e.target.value)} />
                </td>
                <td className="px-2 py-2 border-r">
                  <input type="text" className="w-full border p-1 text-center" value={data.lamanya} onChange={(e) => handleChange(no, 'lamanya', e.target.value)} />
                </td>
                <td className="px-2 py-2 border-r">
                  <input type="text" className="w-full border p-1 text-center" value={data.nilai} onChange={(e) => handleChange(no, 'nilai', e.target.value)} />
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
