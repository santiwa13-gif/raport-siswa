import React, { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { getPredicate, getScoreColor } from '../utils';

// We just ignore the props since we migrated to AppContext. We will fix the API call.
export function RekapNilai({}: any) {
  const { students, subjects, scores, schoolInfo } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.nis.includes(searchQuery)
  );

  const getScoreValue = (nis: string, code: string) => {
    return scores.find(s => s.studentNis === nis && s.subjectCode === code)?.value ?? null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Leger Raport Kelas</h2>
          <p className="text-gray-500 text-sm mt-1">Total {filteredStudents.length} siswa ditampilkan</p>
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Cari nama atau NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border"
          />
        </div>
      </div>

      <div className="overflow-auto flex-1 border border-gray-200">
        <table className="min-w-[1200px] w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-3 border bg-gray-50 text-center sticky left-0 z-20">No</th>
              <th className="px-3 py-3 border bg-gray-50 sticky left-10 z-20">NIS</th>
              <th className="px-3 py-3 border bg-gray-50 sticky left-24 z-20">Nama Siswa</th>
              
              {subjects.map((subject) => (
                <th key={subject.code} className="px-2 py-3 border bg-gray-50 text-center w-12" title={subject.name}>
                  <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>{subject.code}</div>
                </th>
              ))}
              
              <th className="px-4 py-3 border bg-gray-200 font-bold text-center sticky right-0 z-20">Rata²</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={subjects.length + 4} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada siswa.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                let totalScore = 0;
                let subjectsWithScore = 0;

                return (
                  <tr key={student.nis} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border bg-white text-center sticky left-0 z-10">{index + 1}</td>
                    <td className="px-3 py-2 border bg-white font-mono text-xs sticky left-10 z-10">{student.nis}</td>
                    <td className="px-3 py-2 border bg-white font-medium text-gray-900 truncate max-w-[200px] sticky left-24 z-10" title={student.name}>{student.name}</td>
                    
                    {subjects.map((subject) => {
                      const score = getScoreValue(student.nis, subject.code);
                      if (score !== null) {
                        totalScore += score;
                        subjectsWithScore++;
                      }
                      const subjectKkm = subject.kkm ?? 70;
                      const predicate = score !== null ? getPredicate(score, subjectKkm) : null;
                      
                      return (
                        <td key={subject.code} className="px-1 py-1 border text-center group relative text-xs">
                          <span className={getScoreColor(score, subjectKkm)}>
                            {score !== null ? score : '-'}
                          </span>
                        </td>
                      );
                    })}
                    
                    <td className="px-3 py-2 border bg-gray-100 text-gray-900 text-center font-bold sticky right-0 z-10">
                      {subjectsWithScore > 0 ? (totalScore / subjectsWithScore).toFixed(1) : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
