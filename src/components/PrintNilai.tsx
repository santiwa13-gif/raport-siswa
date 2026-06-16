import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Student } from '../types';

export function PrintNilai({ student }: { student: Student }) {
  const { schoolInfo, subjects, scores, pkls, ekskuls, kokurikulers, attendances } = useAppStore();
  
  const getScoreObj = (code: string) => scores.find(s => s.studentNis === student.nis && s.subjectCode === code);
  
  const studentPkl = pkls.filter(p => p.studentNis === student.nis && (p.mitra || '').trim().length > 0);
  const studentEkskul = ekskuls.filter(e => e.studentNis === student.nis && (e.kegiatan || '').trim().length > 0);
  const studentKoku = kokurikulers.filter(k => k.studentNis === student.nis && (k.deskripsi || '').trim().length > 0);
  const att = attendances.find(a => a.studentNis === student.nis) || { sakit: 0, izin: 0, tanpaKeterangan: 0, catatanWaliKelas: '', naikKelas: 'XII. TKR-4' };

  // Group subjects
  const groupedSubjects = subjects.reduce((acc, curr) => {
    if (!acc[curr.group]) acc[curr.group] = [];
    acc[curr.group].push(curr);
    return acc;
  }, {} as Record<string, typeof subjects>);

  return (
    <div className="pt-4 text-black text-[13px]">
      <h2 className="text-xl font-bold text-center uppercase mb-8">LAPORAN HASIL BELAJAR</h2>

      <div className="flex justify-between mb-6 text-sm gap-2">
        <table className="w-[60%]">
          <tbody>
            <tr><td className="py-1 w-[120px]">Nama</td><td className="w-2">:</td><td className="font-bold">{student.name}</td></tr>
            <tr><td className="py-1">NIS / NISN</td><td>:</td><td>{student.nis} / {student.nisn}</td></tr>
            <tr><td className="py-1 whitespace-nowrap">Nama Sekolah</td><td>:</td><td className="whitespace-nowrap">{schoolInfo.name}</td></tr>
            <tr><td className="py-1 align-top">Alamat</td><td className="align-top">:</td><td className="align-top">{schoolInfo.address}</td></tr>
          </tbody>
        </table>
        <table className="w-[40%]">
          <tbody>
            <tr><td className="py-1 w-[110px]">Kelas</td><td className="w-2">:</td><td>{schoolInfo.className}</td></tr>
            <tr><td className="py-1">Fase</td><td>:</td><td>{schoolInfo.phase}</td></tr>
            <tr><td className="py-1">Semester</td><td>:</td><td>{schoolInfo.semester}</td></tr>
            <tr><td className="py-1 whitespace-nowrap">Tahun Pelajaran</td><td>:</td><td>{schoolInfo.academicYear}</td></tr>
          </tbody>
        </table>
      </div>

      <table className="w-full border-collapse border border-black mb-8 page-break-inside-auto">
        <thead className="bg-gray-100 font-bold text-center">
          <tr>
            <th className="border border-black py-2 w-10">No</th>
            <th className="border border-black py-2 w-[35%] text-left px-2">Mata Pelajaran</th>
            <th className="border border-black py-2 w-16">Nilai<br/>Akhir</th>
            <th className="border border-black py-2 text-left px-2">Capaian Kompetensi</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedSubjects).map(([groupName, groupSubjects], groupIndex) => (
            <React.Fragment key={groupName}>
              <tr>
                <td colSpan={4} className="border border-black py-1 px-2 font-bold bg-gray-50">
                  {groupName}
                </td>
              </tr>
              {groupSubjects.map((sub, idx) => {
                const sObj = getScoreObj(sub.code);
                const score = sObj?.value !== null && sObj?.value !== undefined ? sObj.value : '';
                let cpCombined = '';
                if (sObj) {
                  const tercapai = [sObj.cp1].filter(c => (c || '').trim().length > 0).join(', ');
                  const perluBantuan = [sObj.cp2].filter(c => (c || '').trim().length > 0).join(', ');
                  
                  if (tercapai || perluBantuan) {
                    if (tercapai && perluBantuan) {
                      cpCombined = `Menunjukan penguasaan yang baik dalam ${tercapai} , perlu bantuan dalam ${perluBantuan}`;
                    } else if (tercapai) {
                      cpCombined = `Menunjukan penguasaan yang baik dalam ${tercapai}`;
                    } else if (perluBantuan) {
                      cpCombined = `Perlu bantuan dalam ${perluBantuan}`;
                    }
                  }
                }

                return (
                  <tr key={sub.code} className="page-break-inside-avoid">
                    <td className="border border-black p-2 text-center align-top">{idx + 1}.</td>
                    <td className="border border-black p-2 align-top">{sub.name}</td>
                    <td className="border border-black p-2 text-center align-top font-bold text-base">{score}</td>
                    <td className="border border-black p-2 align-top text-justify">{cpCombined}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pt-8 mb-8 page-break-inside-avoid">
        <h3 className="font-bold mb-2">D. PRAKTEK KERJA LAPANGAN (PKL)</h3>
        <table className="w-full border-collapse border border-black text-xs">
          <thead className="bg-gray-100 font-bold text-center">
            <tr>
              <th className="border border-black py-1 w-10">No.</th>
              <th className="border border-black py-1">Mitra/DU/DI</th>
              <th className="border border-black py-1">Lokasi</th>
              <th className="border border-black py-1 w-16">Lamanya<br/>(bulan)</th>
              <th className="border border-black py-1 w-16">Nilai</th>
              <th className="border border-black py-1">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(studentPkl.length > 0 ? studentPkl : [{mitra: '-', lokasi: '-', lamanya: '-', nilai: '-', keterangan: '-'}]).map((p, i) => (
              <tr key={i}>
                <td className="border border-black p-1 text-center">{i+1}</td>
                <td className="border border-black p-1 text-center">{p.mitra || '-'}</td>
                <td className="border border-black p-1 text-center">{p.lokasi || '-'}</td>
                <td className="border border-black p-1 text-center">{p.lamanya || '-'}</td>
                <td className="border border-black p-1 text-center">{p.nilai || '-'}</td>
                <td className="border border-black p-1 text-center">{p.keterangan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page-break-before-auto">
        <div className="mb-6">
          <h3 className="font-bold mb-2 uppercase">E. Kokurikuler</h3>
          <table className="w-full border-collapse border border-black text-sm">
            <tbody>
              {studentKoku.find(k => k.no === 0) && studentKoku.find(k => k.no === 0)?.deskripsi && (
                <tr>
                  <td className="border border-black p-2 w-8 text-center align-top"></td>
                  <td className="border border-black p-2 text-justify align-top bg-white">{studentKoku.find(k => k.no === 0)?.deskripsi}</td>
                </tr>
              )}
              {(() => {
                const validKokus = studentKoku.filter(k => k.no > 0 && k.deskripsi && k.deskripsi.trim() !== '').sort((a, b) => a.no - b.no);
                if (validKokus.length === 0) {
                  return (
                    <tr>
                      <td className="border border-black p-2 w-8 text-center align-top">1</td>
                      <td className="border border-black p-2 bg-white text-justify align-top">-</td>
                    </tr>
                  );
                }
                return validKokus.map((k, i) => (
                  <tr key={i}>
                    <td className="border border-black p-2 w-8 text-center align-top">{i+1}</td>
                    <td className="border border-black p-2 bg-white text-justify align-top">{k.deskripsi}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>

        <div className="mb-6 page-break-inside-avoid">
          <h3 className="font-bold mb-2 uppercase">F. Ekstrakurikuler</h3>
          <table className="w-full border-collapse border border-black text-xs">
            <thead className="bg-gray-100 text-center font-bold">
              <tr>
                <th className="border border-black p-1 w-10">No.</th>
                <th className="border border-black p-1">Kegiatan Ekstrakurikuler</th>
                <th className="border border-black p-1 w-20">Nilai</th>
                <th className="border border-black p-1 text-left px-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {(studentEkskul.length > 0 ? studentEkskul : [1, 2, 3].map(() => ({kegiatan: '-', nilai: '-', keterangan: '-'}))).map((e, i) => (
                <tr key={i}>
                  <td className="border border-black p-1 text-center">{i+1}.</td>
                  <td className="border border-black p-1 text-center">{e.kegiatan || '-'}</td>
                  <td className="border border-black p-1 text-center">{e.nilai || '-'}</td>
                  <td className="border border-black p-1 text-center">{e.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6 page-break-inside-avoid">
          <h3 className="font-bold mb-2 uppercase">G. Ketidakhadiran</h3>
          <table className="w-1/2 border-collapse border border-black text-xs">
            <tbody>
              <tr><td className="border border-black p-1 px-2 w-48">Sakit</td><td className="border border-black p-1 text-center w-16">{att.sakit || '-'}</td><td className="border border-black p-1">hari</td></tr>
              <tr><td className="border border-black p-1 px-2">Izin</td><td className="border border-black p-1 text-center">{att.izin || '-'}</td><td className="border border-black p-1">hari</td></tr>
              <tr><td className="border border-black p-1 px-2">Tanpa Keterangan</td><td className="border border-black p-1 text-center">{att.tanpaKeterangan || '-'}</td><td className="border border-black p-1">hari</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8 page-break-inside-avoid">
          <h3 className="font-bold mb-2 uppercase">H. Kenaikan Kelas</h3>
          <div className="border border-black p-3 text-sm">
            Berdasarkan pencapaian kompetensi pada Semester 1 (Ganjil) dan Semester 2 (Genap), Murid ditetapkan :<br/>
            <strong>Naik / <strike>Tidak Naik</strike> ke kelas : {att.naikKelas}</strong><br/>
            <em className="text-xs">*)Coret yang tidak perlu</em>
          </div>
        </div>

        <div className="flex justify-between mt-12 grid-cols-2 text-sm pr-12 pl-12 page-break-inside-avoid">
          <div className="text-center">
            <p className="mb-20">Mengetahui,<br/>Orang Tua / Wali</p>
            <p className="font-bold underline">......................................</p>
          </div>
          <div className="text-center">
            <p className="mb-20">Blora, {schoolInfo.reportDate}<br/>Wali Kelas</p>
            <p className="font-bold underline">{schoolInfo.homeroomTeacher}</p>
            <p>NBM. {schoolInfo.homeroomTeacherNbm}</p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm w-full font-bold page-break-inside-avoid">
          <p className="font-normal mb-20">Mengetahui,<br/>Kepala Sekolah</p>
          <p className="underline">{schoolInfo.headmaster}</p>
          <p className="font-normal">NBM. {schoolInfo.headmasterNbm}</p>
        </div>
      </div>
    </div>
  );
}
