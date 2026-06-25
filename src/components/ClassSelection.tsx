import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Users, Plus, LogOut, Code } from 'lucide-react';

export function ClassSelection() {
  const { classes, createNewClass, joinClass, setCurrentClassId, user, logout } = useAppStore();
  const [newClassName, setNewClassName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    await createNewClass(newClassName);
    setNewClassName('');
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      await joinClass(joinCode);
      setJoinCode('');
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">E-Raport Dashboard</h1>
            <p className="text-gray-600">Masuk sebagai {user?.email}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-bold mb-4">Kelas Anda</h2>
            {classes.length === 0 ? (
              <p className="text-gray-500 italic mb-4">Belum ada kelas.</p>
            ) : (
              <ul className="space-y-3 mb-6">
                {classes.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => setCurrentClassId(c.id)}
                      className="w-full flex items-center justify-between p-4 border rounded hover:bg-green-50 hover:border-green-500 transition-colors text-left"
                    >
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          {c.ownerId === user?.uid ? 'Wali Kelas (Pemilik)' : `Guru Mapel (Milik ${c.ownerEmail})`}
                        </div>
                      </div>
                      <Users size={18} className="text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={20} /> Buat Kelas Baru</h2>
              <p className="text-sm text-gray-600 mb-4">Sebagai Wali Kelas, Anda dapat membuat kelas baru dan mengundang guru mapel.</p>
              <form onSubmit={handleCreate} className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border rounded px-3 py-2 text-sm" 
                  placeholder="Nama Kelas (Misal: 11 TKR 4 - Genap)"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                />
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm">Buat</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Code size={20} /> Gabung Kelas</h2>
              <p className="text-sm text-gray-600 mb-4">Sebagai Guru Mapel, masukkan ID Kelas yang diberikan oleh Wali Kelas.</p>
              <form onSubmit={handleJoin} className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 border rounded px-3 py-2 text-sm" 
                    placeholder="ID Kelas"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value)}
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Gabung</button>
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
