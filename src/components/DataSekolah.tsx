import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { fileToBase64 } from '../utils';

export function DataSekolah() {
  const { schoolInfo, setSchoolInfo } = useAppStore();
  const [formData, setFormData] = useState({ ...schoolInfo });
  const [toast, setToast] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'kkm' ? Number(value) : value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData((prev) => ({ ...prev, logo: base64 }));
    }
  };

  const handleSave = () => {
    setSchoolInfo(formData);
    setToast('Data sekolah berhasil disimpan!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-4xl">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Manajemen Data Sekolah</h2>
      
      {toast && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Sekolah</label>
            <div className="flex items-center gap-4">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border rounded text-xs text-gray-400">No Logo</div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NSS</label>
              <input type="text" name="nss" value={formData.nss} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NPSN</label>
              <input type="text" name="npsn" value={formData.npsn} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kepala Sekolah</label>
              <input type="text" name="headmaster" value={formData.headmaster} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NBM / NIP Ka. Sekolah</label>
              <input type="text" name="headmasterNbm" value={formData.headmasterNbm} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wali Kelas</label>
              <input type="text" name="homeroomTeacher" value={formData.homeroomTeacher} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NBM / NIP Wali Kelas</label>
              <input type="text" name="homeroomTeacherNbm" value={formData.homeroomTeacherNbm} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pelajaran</label>
              <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input type="text" name="semester" value={formData.semester} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
              <input type="text" name="className" value={formData.className} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fase</label>
              <input type="text" name="phase" value={formData.phase} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kurikulum</label>
              <input type="text" name="curriculum" value={formData.curriculum} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Raport</label>
              <input type="text" name="reportDate" value={formData.reportDate} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standar KKM Default</label>
              <input type="number" name="kkm" value={formData.kkm} onChange={handleChange} className="w-full border-gray-300 rounded p-2 border focus:ring-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Simpan Data Sekolah
        </button>
      </div>
    </div>
  );
}
