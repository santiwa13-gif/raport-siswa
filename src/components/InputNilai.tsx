import React, { useRef, useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { getPredicate } from '../utils';
import * as XLSX from 'xlsx';
import { Upload, Download } from 'lucide-react';
import { Score } from '../types';

export function InputNilai() {
  const { students, subjects, scores, setScores } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.code);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubjectObj = subjects.find(s => s.code === selectedSubject);

  const getScoreObj = (studentNis: string) => {
    return scores.find(x => x.studentNis === studentNis && x.subjectCode === selectedSubject);
  };

  const calculateNA = (cp1?: number|null, cp2?: number|null, cp3?: number|null, cp4?: number|null, asts?: number|null, asas?: number|null) => {
    const cps = [cp1, cp2, cp3, cp4].filter(x => typeof x === 'number') as number[];
    if (cps.length === 0 && (typeof asts !== 'number') && (typeof asas !== 'number')) return null;

    const rataCp = cps.length > 0 ? cps.reduce((a, b) => a + b, 0) / cps.length : 0;
    const astsVal = asts || 0;
    const asasVal = asas || 0;

    return Math.round(((2 * rataCp) + astsVal + asasVal) / 4);
  };

  const handleScoreChange = (studentNis: string, field: keyof Score, val: string) => {
    const numValue = val === '' ? null : parseInt(val, 10);
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 100)) return;

    const existingScores = [...scores];
    const index = existingScores.findIndex(s => s.studentNis === studentNis && s.subjectCode === selectedSubject);

    if (index >= 0) {
      if (field !== 'value' && field !== 'studentNis' && field !== 'subjectCode' && field !== 'cp1' && field !== 'cp2' && field !== 'cp3' && field !== 'cp4') {
        (existingScores[index] as any)[field] = numValue;
      }
      existingScores[index].value = calculateNA(
        existingScores[index].cp1Score,
        existingScores[index].cp2Score,
        existingScores[index].cp3Score,
        existingScores[index].cp4Score,
        existingScores[index].astsScore,
        existingScores[index].asasScore
      );
    } else {
      const newScore: Score = {
        studentNis, subjectCode: selectedSubject, value: null, cp1: '', cp2: '', cp3: '', cp4: ''
      };
      if (field !== 'value' && field !== 'studentNis' && field !== 'subjectCode' && field !== 'cp1' && field !== 'cp2' && field !== 'cp3' && field !== 'cp4') {
        (newScore as any)[field] = numValue;
      }
      newScore.value = calculateNA(newScore.cp1Score, newScore.cp2Score, newScore.cp3Score, newScore.cp4Score, newScore.astsScore, newScore.asasScore);
      existingScores.push(newScore);
    }
    setScores(existingScores);
  };

  const handleSave = () => {
    setToastMessage(`Berhasil menyimpan nilai ${currentSubjectObj?.name}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDownloadTemplate = () => {
    const templateData = students.map(s => {
      const obj = getScoreObj(s.nis);
      return {
        NIS: s.nis,
        Nama: s.name,
        'CP 1': obj?.cp1Score ?? '',
        'CP 2': obj?.cp2Score ?? '',
        'CP 3': obj?.cp3Score ?? '',
        'CP 4': obj?.cp4Score ?? '',
        'ASTS': obj?.astsScore ?? '',
        'ASAS': obj?.asasScore ?? '',
      }
    });
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Format_Nilai");
    XLSX.writeFile(wb, `Format_Nilai_${currentSubjectObj?.name || 'Mapel'}.xlsx`);
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
          const nis = String(row['NIS']);
          if (!nis || nis === 'undefined') return;

          const parseVal = (v: any) => (v === '' || v === undefined || v === null) ? null : parseInt(v, 10);
          const cp1Score = parseVal(row['CP 1']);
          const cp2Score = parseVal(row['CP 2']);
          const cp3Score = parseVal(row['CP 3']);
          const cp4Score = parseVal(row['CP 4']);
          const astsScore = parseVal(row['ASTS']);
          const asasScore = parseVal(row['ASAS'] ?? row['ASAT']);

          const isValid = (n: number|null) => n === null || (!isNaN(n) && n >= 0 && n <= 100);
          
          if (isValid(cp1Score) && isValid(cp2Score) && isValid(cp3Score) && isValid(cp4Score) && isValid(astsScore) && isValid(asasScore)) {
            let index = existingScores.findIndex(s => s.studentNis === nis && s.subjectCode === selectedSubject);
            
            if (index < 0) {
              existingScores.push({
                studentNis: nis, subjectCode: selectedSubject, value: null, cp1: '', cp2: '', cp3: '', cp4: ''
              });
              index = existingScores.length - 1;
            }
            
            if (row['CP 1'] !== undefined) existingScores[index].cp1Score = cp1Score;
            if (row['CP 2'] !== undefined) existingScores[index].cp2Score = cp2Score;
            if (row['CP 3'] !== undefined) existingScores[index].cp3Score = cp3Score;
            if (row['CP 4'] !== undefined) existingScores[index].cp4Score = cp4Score;
            if (row['ASTS'] !== undefined) existingScores[index].astsScore = astsScore;
            if (row['ASAS'] !== undefined || row['ASAT'] !== undefined) existingScores[index].asasScore = asasScore;

            existingScores[index].value = calculateNA(
              existingScores[index].cp1Score,
              existingScores[index].cp2Score,
              existingScores[index].cp3Score,
              existingScores[index].cp4Score,
              existingScores[index].astsScore,
              existingScores[index].asasScore
            );
            successCount++;
          }
        });

        setScores(existingScores);
        setToastMessage(`Berhasil mengimpor ${successCount} data nilai melalui Excel`);
        setTimeout(() => setToastMessage(''), 3000);
        
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan formatnya sesuai template.");
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Input Nilai Akademik</h2>
          <p className="text-gray-500 text-sm mt-1">Standar KKM: {currentSubjectObj?.kkm ?? 70}</p>
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
              className="border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 block w-full md:w-auto sm:text-sm p-2 border"
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
        <table className="w-full text-sm text-left text-gray-500 border-collapse border border-gray-200 min-w-[max-content]">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm border-b">
            <tr>
              <th className="px-3 py-3 border-r w-12 text-center bg-gray-50">No</th>
              <th className="px-3 py-3 border-r w-24 bg-gray-50">NIS</th>
              <th className="px-3 py-3 border-r bg-gray-50">Nama Siswa</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">CP 1</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">CP 2</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">CP 3</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">CP 4</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">ASTS</th>
              <th className="px-2 py-3 border-r w-20 text-center bg-gray-50">ASAS</th>
              <th className="px-3 py-3 border-r w-20 text-center bg-blue-50 text-blue-900 font-bold">Rata CP</th>
              <th className="px-3 py-3 border-r w-24 text-center bg-green-50 text-green-900 font-bold">Nilai Akhir (NR)</th>
              <th className="px-3 py-3 w-20 text-center bg-gray-50">Predikat</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const obj = getScoreObj(student.nis);
              const subjectKkm = currentSubjectObj?.kkm ?? 70;
              const predicate = obj?.value != null ? getPredicate(obj.value, subjectKkm) : null;
              
              const cps = [obj?.cp1Score, obj?.cp2Score, obj?.cp3Score, obj?.cp4Score].filter(x => typeof x === 'number') as number[];
              const rataCp = cps.length > 0 ? cps.reduce((a, b) => a + b, 0) / cps.length : null;

              const renderInput = (field: keyof Score, val: number|null|undefined) => (
                <input
                  type="number" min="0" max="100"
                  className="w-full text-center border-gray-300 rounded px-1 min-w-[3rem] py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={val ?? ''}
                  onChange={(e) => handleScoreChange(student.nis, field, e.target.value)}
                  placeholder="-"
                />
              );

              return (
                <tr key={student.nis} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border-r text-center">{index + 1}</td>
                  <td className="px-3 py-2 border-r font-mono text-xs">{student.nis}</td>
                  <td className="px-3 py-2 border-r font-medium text-gray-900 truncate max-w-[15rem]">{student.name}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('cp1Score', obj?.cp1Score)}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('cp2Score', obj?.cp2Score)}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('cp3Score', obj?.cp3Score)}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('cp4Score', obj?.cp4Score)}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('astsScore', obj?.astsScore)}</td>
                  <td className="px-1 py-1 border-r text-center bg-white">{renderInput('asasScore', obj?.asasScore)}</td>
                  <td className="px-3 py-2 border-r text-center bg-blue-50 font-mono text-blue-900">{typeof rataCp === 'number' ? Math.round(rataCp) : '-'}</td>
                  <td className={`px-3 py-2 border-r text-center font-bold text-lg ${obj?.value != null && obj.value < subjectKkm ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {obj?.value ?? '-'}
                  </td>
                  <td className="px-3 py-2 text-center font-bold">
                    {predicate ? <span className={obj?.value != null && obj.value >= subjectKkm ? 'text-green-600' : 'text-red-500'}>{predicate.letter}</span> : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end shrink-0">
        <button onClick={handleSave} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors">
          Simpan Data
        </button>
      </div>
    </div>
  );
}

