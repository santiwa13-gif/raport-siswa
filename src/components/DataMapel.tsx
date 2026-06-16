import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Subject } from '../types';

export function DataMapel() {
  const { subjects, setSubjects } = useAppStore();
  
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Subject>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState<Subject>({
    code: '',
    name: '',
    group: 'A. Kelompok Umum',
    kkm: 70
  });

  const subjectGroups = [
    "A. Kelompok Umum",
    "B. Kelompok Kejuruan",
    "C. Muatan Lokal"
  ];

  const handleEdit = (subject: Subject) => {
    setEditingCode(subject.code);
    setEditForm(subject);
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editForm.group || !editForm.code || editForm.kkm === undefined) return;
    
    // If code was changed (e.g. they wanted to change the ID/code), it's a bit tricky since it acts as ID. 
    // Usually we shouldn't allow changing code easily if it ties to scores, but this is a simple app.
    // For now we assume we just update the specific item by previous code
    
    setSubjects(subjects.map(s => s.code === editingCode ? { 
      code: editForm.code!, 
      name: editForm.name!, 
      group: editForm.group!, 
      kkm: Number(editForm.kkm) 
    } : s));
    
    setEditingCode(null);
  };

  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const handleDelete = (code: string) => {
    setSubjects(subjects.filter(s => s.code !== code));
    setDeletingCode(null);
  };

  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      alert("Kode dan Nama mata pelajaran harus diisi.");
      return;
    }
    if (subjects.some(s => s.code === newSubject.code)) {
      alert("Mata pelajaran dengan kode tersebut sudah ada.");
      return;
    }
    
    setSubjects([...subjects, { ...newSubject, kkm: Number(newSubject.kkm) }]);
    setIsAdding(false);
    setNewSubject({
      code: '',
      name: '',
      group: 'A. Kelompok Umum',
      kkm: 70
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Data Mata Pelajaran & KKM</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola data mata pelajaran beserta KKM masing-masing</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Tambah Mapel</span>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-black uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3 w-16 text-center">No</th>
                <th className="px-4 py-3">Kelompok</th>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Mata Pelajaran</th>
                <th className="px-4 py-3 w-24 text-center">KKM</th>
                <th className="px-4 py-3 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <tr className="bg-green-50/50 border-b border-gray-200">
                  <td className="px-4 py-3 text-center text-gray-500 font-medium">+</td>
                  <td className="px-4 py-2">
                    <select
                      className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={newSubject.group}
                      onChange={(e) => setNewSubject({...newSubject, group: e.target.value})}
                    >
                      {subjectGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Misal: MAT"
                      className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Nama Mapel"
                      className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-16 border border-gray-300 rounded p-1.5 text-sm text-center focus:ring-2 focus:ring-green-500 outline-none"
                      value={newSubject.kkm}
                      onChange={(e) => setNewSubject({...newSubject, kkm: Number(e.target.value)})}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={handleAddSubject} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Simpan">
                        <Check size={16} />
                      </button>
                      <button onClick={() => setIsAdding(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors" title="Batal">
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {subjects.map((subject, index) => {
                const isEditing = editingCode === subject.code;
                
                return (
                  <tr key={subject.code} className="border-b border-gray-200 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-center text-gray-500 font-medium">{index + 1}</td>
                    
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <select
                            className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            value={editForm.group}
                            onChange={(e) => setEditForm({...editForm, group: e.target.value})}
                          >
                            {subjectGroups.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            value={editForm.code}
                            onChange={(e) => setEditForm({...editForm, code: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-16 border border-gray-300 rounded p-1.5 text-sm text-center focus:ring-2 focus:ring-green-500 outline-none"
                            value={editForm.kkm}
                            onChange={(e) => setEditForm({...editForm, kkm: Number(e.target.value)})}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={handleSaveEdit} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Simpan">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingCode(null)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors" title="Batal">
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{subject.group}</td>
                        <td className="px-4 py-3 font-mono text-gray-600">{subject.code}</td>
                        <td className="px-4 py-3 font-medium">{subject.name}</td>
                        <td className="px-4 py-3 text-center">{subject.kkm ?? 70}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleEdit(subject)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => setDeletingCode(subject.code)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {subjects.length === 0 && !isAdding && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Belum ada data mata pelajaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {deletingCode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Hapus Mata Pelajaran?</h3>
            <p className="text-sm text-gray-600 mb-4">Apakah Anda yakin ingin menghapus mata pelajaran ini?</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded" onClick={() => setDeletingCode(null)}>Batal</button>
              <button className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded" onClick={() => handleDelete(deletingCode)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
