import React, { useRef, useState } from 'react';
import { useAppStore } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { Upload, Download } from 'lucide-react';

export function InputCapaian() {
  const { students, subjects, scores, setScores } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.code);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getScoreObj = (studentNis: string) => {
    let s = scores.find(x => x.studentNis === studentNis && x.subjectCode === selectedSubject);
    if (!s) {
      s = { studentNis, subjectCode: selectedSubject, value: null, cp1: '', cp2: '', cp3: '', cp4: '' };
    }
    return s;
  };

  const handleCpChange = (studentNis: string, cpIndex: 1|2|3|4, val: string) => {
    const existingScores = [...scores];
    const index = existingScores.findIndex(s => s.studentNis === studentNis && s.subjectCode === selectedSubject);

    if (index >= 0) {
      existingScores[index][`cp${cpIndex}`] = val;
    } else {
      const newScore: any = { studentNis, subjectCode: selectedSubject, value: null, cp1: '', cp2: '', cp3: '', cp4: '' };
      newScore[`cp${cpIndex}`] = val;
      existingScores.push(newScore);
    }
    setScores(existingScores);
  };

  const currentSubjectObj = subjects.find(s => s.code === selectedSubject);

  const handleDownloadTemplate = () => {
    const templateData = students.map(s => ({
      NIS: s.nis,
      Nama: s.name,
      'CP 1 (Penguasaan Baik)': getScoreObj(s.nis).cp1 || '',
      'CP 2 (Perlu Bantuan)': getScoreObj(s.nis).cp2 || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format_Capaian");
    XLSX.writeFile(wb, `Format_Capaian_${currentSubjectObj?.name || 'Mapel'}.xlsx`);
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
        const existingScores = [...scores];

        data.forEach((row: any) => {
          const nis = row['NIS'] ? String(row['NIS']) : undefined;
          
          if (nis) {
            const cp1 = row['CP 1 (Penguasaan Baik)'] ? String(row['CP 1 (Penguasaan Baik)']) : '';
            const cp2 = row['CP 2 (Perlu Bantuan)'] ? String(row['CP 2 (Perlu Bantuan)']) : '';
            
            const index = existingScores.findIndex(s => s.studentNis === nis && s.subjectCode === selectedSubject);
            if (index >= 0) {
              if (row['CP 1 (Penguasaan Baik)'] !== undefined) existingScores[index].cp1 = cp1;
              if (row['CP 2 (Perlu Bantuan)'] !== undefined) existingScores[index].cp2 = cp2;
            } else {
              existingScores.push({
                studentNis: nis, subjectCode: selectedSubject, value: null, cp1, cp2, cp3: '', cp4: ''
              });
            }
            successCount++;
          }
        });

        setScores(existingScores);
        setToastMessage(`Berhasil mengimpor data capaian untuk ${successCount} siswa.`);
        setTimeout(() => setToastMessage(''), 3000);
        
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan formatnya sesuai template.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = () => {
    setToastMessage(`Capaian disimpan untuk ${currentSubjectObj?.name}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Capaian Pembelajaran (CP)</h2>
          <p className="text-gray-500 text-sm mt-1">Silakan isi max 2 CP per siswa untuk mapel ini.</p>
        </div>
        
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

          <div className="flex items-center gap-2 border-l pl-3 ml-1">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Mata Pelajaran:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm p-2 border"
            >
              {subjects.map((subject) => (
                <option key={subject.code} value={subject.code}>{subject.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm shrink-0">
          {toastMessage}
        </div>
      )}

      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left border-collapse border border-gray-200 min-w-[max-content]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 shadow-sm border-b z-10">
            <tr>
              <th className="px-3 py-2 border-r w-10 text-center">No</th>
              <th className="px-3 py-2 border-r w-48">Nama Siswa</th>
              <th className="px-3 py-2 border-r w-64">CP 1 (Penguasaan Baik)</th>
              <th className="px-3 py-2 w-64">CP 2 (Perlu Bantuan)</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const scoreObj = getScoreObj(student.nis);
              return (
                <tr key={student.nis} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border-r text-center">{index + 1}</td>
                  <td className="px-3 py-2 border-r font-medium text-gray-900 truncate max-w-[12rem]">{student.name}</td>
                  <td className="px-2 py-2 border-r">
                    <textarea className="w-full text-xs border border-gray-300 rounded p-1" rows={2} value={scoreObj.cp1} onChange={(e) => handleCpChange(student.nis, 1, e.target.value)} />
                  </td>
                  <td className="px-2 py-2">
                    <textarea className="w-full text-xs border border-gray-300 rounded p-1" rows={2} value={scoreObj.cp2} onChange={(e) => handleCpChange(student.nis, 2, e.target.value)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end shrink-0">
        <button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Simpan CP
        </button>
      </div>
    </div>
  );
}
