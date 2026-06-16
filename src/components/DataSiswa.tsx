import React, { useRef, useState } from 'react';
import { useAppStore } from '../context/AppContext';
import type { Student } from '../types';
import { Settings, Pencil, Trash2, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export function DataSiswa() {
  const { students, setStudents } = useAppStore();
  const [editingNis, setEditingNis] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (student: Student) => {
    setEditingNis(student.nis);
    setFormData(student);
  };

  const cancelEdit = () => {
    setEditingNis(null);
    setFormData({});
  };

  const handleSave = () => {
    if (!formData.nis || !formData.name) return alert('NIS dan Nama wajib diisi');
    
    if (editingNis === 'NEW') {
      if (students.some(s => s.nis === formData.nis)) return alert('NIS sudah ada');
      setStudents([...students, formData as Student]);
    } else {
      setStudents(students.map(s => s.nis === editingNis ? (formData as Student) : s));
    }
    cancelEdit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addStudent = () => {
    setEditingNis('NEW');
    setFormData({ gender: 'L' }); // defaults
  };

  const [deletingNis, setDeletingNis] = useState<string | null>(null);

  const deleteStudent = (nis: string) => {
    setStudents(students.filter(s => s.nis !== nis));
    setDeletingNis(null);
  };

  const handleDownloadTemplate = () => {
    const templateData = students.map(s => ({
      'NIS': s.nis,
      'NISN': s.nisn,
      'Nama Lengkap': s.name,
      'Jenis Kelamin (L/P)': s.gender,
      'Tempat Lahir': s.tempatLahir || '',
      'Tanggal Lahir': s.tanggalLahir || '',
      'Agama': s.agama || '',
      'Status Dalam Keluarga': s.statusDalamKeluarga || '',
      'Anak Ke': s.anakKe || '',
      'Alamat Peserta Didik': s.alamat || '',
      'No Telpon / HP': s.noTelp || '',
      'Sekolah Asal': s.asalSekolah || '',
      'Tanggal Diterima': s.tanggalDiterima || '',
      'Nama Ayah': s.namaAyah || '',
      'Pekerjaan Ayah': s.pekerjaanAyah || '',
      'Nama Ibu': s.namaIbu || '',
      'Pekerjaan Ibu': s.pekerjaanIbu || '',
      'Nama Wali': s.namaWali || '',
      'Pekerjaan Wali': s.pekerjaanWali || '',
      'Alamat Wali': s.alamatWali || '',
      'No Telpon / HP Wali': s.noTelpWali || ''
    }));
    
    // Add one empty row example if no students
    if (templateData.length === 0) {
      templateData.push({
        'NIS': '1234',
        'NISN': '0012345678',
        'Nama Lengkap': 'Contoh Siswa',
        'Jenis Kelamin (L/P)': 'L',
        'Tempat Lahir': 'Jakarta',
        'Tanggal Lahir': '01-01-2010',
        'Agama': 'Islam',
        'Status Dalam Keluarga': 'Anak Kandung',
        'Anak Ke': '1',
        'Alamat Peserta Didik': 'Jl. Contoh Raya No.1',
        'No Telpon / HP': '081234567890',
        'Sekolah Asal': 'SMP N 1 Contoh',
        'Tanggal Diterima': '12-07-2023',
        'Nama Ayah': 'Bapak',
        'Pekerjaan Ayah': 'Wiraswasta',
        'Nama Ibu': 'Ibu',
        'Pekerjaan Ibu': 'Ibu Rumah Tangga',
        'Nama Wali': '',
        'Pekerjaan Wali': '',
        'Alamat Wali': '',
        'No Telpon / HP Wali': ''
      });
    }

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Siswa");
    XLSX.writeFile(wb, `Format_Data_Siswa.xlsx`);
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
        let existingStudents = [...students];

        data.forEach((row: any) => {
          const nis = row['NIS'] ? String(row['NIS']).trim() : undefined;
          
          if (nis) {
            const getStr = (key: string) => row[key] !== undefined && row[key] !== null ? String(row[key]).trim() : undefined;
            
            const studentData: Partial<Student> = {
              nis,
              nisn: getStr('NISN') || '',
              name: getStr('Nama Lengkap') || '',
              gender: getStr('Jenis Kelamin (L/P)') || 'L',
              tempatLahir: getStr('Tempat Lahir'),
              tanggalLahir: getStr('Tanggal Lahir'),
              agama: getStr('Agama'),
              statusDalamKeluarga: getStr('Status Dalam Keluarga'),
              anakKe: getStr('Anak Ke'),
              alamat: getStr('Alamat Peserta Didik'),
              noTelp: getStr('No Telpon / HP'),
              asalSekolah: getStr('Sekolah Asal'),
              tanggalDiterima: getStr('Tanggal Diterima'),
              namaAyah: getStr('Nama Ayah'),
              pekerjaanAyah: getStr('Pekerjaan Ayah'),
              namaIbu: getStr('Nama Ibu'),
              pekerjaanIbu: getStr('Pekerjaan Ibu'),
              namaWali: getStr('Nama Wali'),
              pekerjaanWali: getStr('Pekerjaan Wali'),
              alamatWali: getStr('Alamat Wali'),
              noTelpWali: getStr('No Telpon / HP Wali')
            };

            const index = existingStudents.findIndex(s => s.nis === nis);
            if (index >= 0) {
              existingStudents[index] = { ...existingStudents[index], ...studentData } as Student;
            } else {
              existingStudents.push(studentData as Student);
            }
            successCount++;
          }
        });

        setStudents(existingStudents);
        setToastMessage(`Berhasil mengimpor ${successCount} data siswa.`);
        setTimeout(() => setToastMessage(''), 3000);
        
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan formatnya sesuai template.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)] relative">
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-10 shadow-sm transition-opacity duration-300">
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Manajemen Data Siswa ({students.length})</h2>
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

          <button onClick={addStudent} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm transition-colors border border-green-700 ml-2">
            + Tambah Siswa
          </button>
        </div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left border-collapse min-w-[max-content]">
          <thead className="bg-gray-50 sticky top-0 z-10 text-xs uppercase text-gray-700 border-y whitespace-nowrap">
            <tr>
              <th className="px-4 py-3 sticky left-0 z-20 bg-gray-50 border-r">Aksi</th>
              <th className="px-4 py-3">NIS / NISN</th>
              <th className="px-4 py-3 min-w-[200px]">Nama Lengkap</th>
              <th className="px-4 py-3">L/P</th>
              <th className="px-4 py-3">Tempat Lahir</th>
              <th className="px-4 py-3">Tanggal Lahir</th>
              <th className="px-4 py-3">Agama</th>
              <th className="px-4 py-3">Status Keluarga</th>
              <th className="px-4 py-3">Anak Ke</th>
              <th className="px-4 py-3 min-w-[200px]">Alamat Peserta Didik</th>
              <th className="px-4 py-3">No Telpon / HP</th>
              <th className="px-4 py-3">Sekolah Asal</th>
              <th className="px-4 py-3">Tanggal Diterima</th>
              <th className="px-4 py-3">Nama Ayah</th>
              <th className="px-4 py-3">Pekerjaan Ayah</th>
              <th className="px-4 py-3">Nama Ibu</th>
              <th className="px-4 py-3">Pekerjaan Ibu</th>
              <th className="px-4 py-3">Nama Wali</th>
              <th className="px-4 py-3">Pekerjaan Wali</th>
              <th className="px-4 py-3 min-w-[200px]">Alamat Wali</th>
              <th className="px-4 py-3">No Telpon / HP Wali</th>
            </tr>
          </thead>
          <tbody>
            {editingNis === 'NEW' && (
              <tr className="bg-yellow-50 border-b">
                 <td className="px-4 py-2 sticky left-0 z-20 bg-yellow-50 border-r">
                   <button onClick={handleSave} className="text-green-600 font-bold mr-2">Simpan</button>
                   <button onClick={cancelEdit} className="text-gray-500">Batal</button>
                 </td>
                 <td className="px-4 py-2 flex flex-col gap-1">
                   <input type="text" name="nis" placeholder="NIS" value={formData.nis || ''} onChange={handleChange} className="border p-1 w-24 text-xs" />
                   <input type="text" name="nisn" placeholder="NISN" value={formData.nisn || ''} onChange={handleChange} className="border p-1 w-24 text-xs" />
                 </td>
                 <td className="px-4 py-2">
                   <input type="text" name="name" placeholder="Nama Lengkap" value={formData.name || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" />
                 </td>
                 <td className="px-4 py-2">
                   <select name="gender" value={formData.gender || 'L'} onChange={handleChange} className="border p-1 text-xs">
                     <option value="L">L</option>
                     <option value="P">P</option>
                   </select>
                 </td>
                 <td className="px-4 py-2"><input type="text" name="tempatLahir" value={formData.tempatLahir || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="tanggalLahir" value={formData.tanggalLahir || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="agama" value={formData.agama || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="statusDalamKeluarga" value={formData.statusDalamKeluarga || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="anakKe" value={formData.anakKe || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[60px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="alamat" value={formData.alamat || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="noTelp" value={formData.noTelp || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="asalSekolah" value={formData.asalSekolah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="tanggalDiterima" value={formData.tanggalDiterima || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="namaAyah" value={formData.namaAyah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="pekerjaanAyah" value={formData.pekerjaanAyah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="namaIbu" value={formData.namaIbu || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="pekerjaanIbu" value={formData.pekerjaanIbu || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="namaWali" value={formData.namaWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="pekerjaanWali" value={formData.pekerjaanWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="alamatWali" value={formData.alamatWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" /></td>
                 <td className="px-4 py-2"><input type="text" name="noTelpWali" value={formData.noTelpWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
              </tr>
            )}
            {students.map(student => (
              editingNis === student.nis ? (
                <tr key={student.nis} className="bg-yellow-50 border-b">
                   <td className="px-4 py-2 sticky left-0 z-20 bg-yellow-50 border-r">
                     <button onClick={handleSave} className="text-green-600 font-bold mr-2 text-xs">Simpan</button>
                     <button onClick={cancelEdit} className="text-gray-500 text-xs">Batal</button>
                   </td>
                   <td className="px-4 py-2 flex flex-col gap-1">
                     <input type="text" name="nis" value={formData.nis || ''} onChange={handleChange} readOnly className="border p-1 w-24 text-xs bg-gray-100" />
                     <input type="text" name="nisn" value={formData.nisn || ''} onChange={handleChange} className="border p-1 w-24 text-xs" />
                   </td>
                   <td className="px-4 py-2">
                     <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" />
                   </td>
                   <td className="px-4 py-2">
                     <select name="gender" value={formData.gender || 'L'} onChange={handleChange} className="border p-1 text-xs">
                       <option value="L">L</option>
                       <option value="P">P</option>
                     </select>
                   </td>
                   <td className="px-4 py-2"><input type="text" name="tempatLahir" value={formData.tempatLahir || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="tanggalLahir" value={formData.tanggalLahir || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="agama" value={formData.agama || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="statusDalamKeluarga" value={formData.statusDalamKeluarga || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="anakKe" value={formData.anakKe || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[60px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="alamat" value={formData.alamat || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="noTelp" value={formData.noTelp || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="asalSekolah" value={formData.asalSekolah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="tanggalDiterima" value={formData.tanggalDiterima || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="namaAyah" value={formData.namaAyah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="pekerjaanAyah" value={formData.pekerjaanAyah || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="namaIbu" value={formData.namaIbu || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="pekerjaanIbu" value={formData.pekerjaanIbu || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="namaWali" value={formData.namaWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="pekerjaanWali" value={formData.pekerjaanWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[120px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="alamatWali" value={formData.alamatWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[150px]" /></td>
                   <td className="px-4 py-2"><input type="text" name="noTelpWali" value={formData.noTelpWali || ''} onChange={handleChange} className="border p-1 w-full text-xs min-w-[100px]" /></td>
                </tr>
              ) : (
                <tr key={student.nis} className="border-b hover:bg-gray-50 bg-white">
                  <td className="px-4 py-2 flex gap-2 sticky left-0 z-20 bg-inherit border-r">
                    <button onClick={() => startEdit(student)} className="text-blue-600 hover:text-blue-800"><Pencil size={16}/></button>
                    <button onClick={() => setDeletingNis(student.nis)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs whitespace-nowrap">{student.nis}<br/><span className="text-gray-400">{student.nisn}</span></td>
                  <td className="px-4 py-2 font-medium whitespace-nowrap">{student.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{student.gender}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.tempatLahir}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.tanggalLahir}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.agama}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.statusDalamKeluarga}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.anakKe}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.alamat}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.noTelp}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.asalSekolah}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.tanggalDiterima}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.namaAyah}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.pekerjaanAyah}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.namaIbu}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.pekerjaanIbu}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.namaWali}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.pekerjaanWali}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.alamatWali}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{student.noTelpWali}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {deletingNis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Hapus Data Siswa?</h3>
            <p className="text-sm text-gray-600 mb-4">Apakah Anda yakin ingin menghapus siswa ini? Semua nilai terkait juga akan terhapus.</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded" onClick={() => setDeletingNis(null)}>Batal</button>
              <button className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded" onClick={() => deleteStudent(deletingNis)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
