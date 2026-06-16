import React from 'react';
import { useAppStore } from '../context/AppContext';

export function Dashboard() {
  const { students, subjects, scores, schoolInfo } = useAppStore();
  
  const totalStudents = students.length;
  const totalSubjects = subjects.length;
  const totalPossibleScores = totalStudents * totalSubjects;
  
  const inputtedScores = scores.filter(s => s.value !== null).length;
  const completionPercentage = totalPossibleScores === 0 ? 0 : Math.round((inputtedScores / totalPossibleScores) * 100);

  let totalScoreValue = 0;
  scores.forEach(s => {
    if (s.value !== null) totalScoreValue += s.value;
  });
  const averageScore = inputtedScores === 0 ? 0 : (totalScoreValue / inputtedScores).toFixed(2);

  const scoresBelowKkm = scores.filter(s => s.value !== null && s.value < schoolInfo.kkm).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-1">Total Siswa</div>
          <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-1">Rata-rata Kelas</div>
          <div className="text-3xl font-bold text-green-700">{averageScore}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-1">Nilai &lt; KKM ({schoolInfo.kkm})</div>
          <div className="text-3xl font-bold text-red-600">{scoresBelowKkm}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-sm text-gray-500 mb-1">Progress Input Nilai</div>
          <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Status Pengisian per Mata Pelajaran</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Kelompok</th>
                <th className="px-4 py-3">Mata Pelajaran</th>
                <th className="px-4 py-3 text-center">Terisi</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                const filledCount = scores.filter(s => s.subjectCode === subject.code && s.value !== null).length;
                const isComplete = filledCount === totalStudents;
                return (
                  <tr key={subject.code} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 text-xs">{subject.group}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{subject.name}</td>
                    <td className="px-4 py-3 text-center">
                      {filledCount} / {totalStudents}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isComplete ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Lengkap</span>
                      ) : filledCount > 0 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Draft</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Kosong</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
