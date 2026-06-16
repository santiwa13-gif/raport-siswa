import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Student } from '../types';

export function PrintCover({ student }: { student: Student }) {
  const { schoolInfo } = useAppStore();
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
      
      {schoolInfo.logo ? (
        <img src={schoolInfo.logo} alt="Logo" className="w-48 h-48 object-contain" />
      ) : (
        <div className="w-48 h-48 border-4 border-gray-800 rounded-full flex items-center justify-center bg-gray-100">
           Bisa Upload Logo Di Menu Data Sekolah
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-widest mt-8">RAPOR PESERTA DIDIK</h1>
        <h2 className="text-2xl font-bold mt-8">SEKOLAH MENENGAH KEJURUAN<br/>(SMK)<br/>{schoolInfo.name}</h2>
      </div>

      <div className="text-left w-2/3 mt-10 text-lg">
        <table className="w-full font-semibold">
          <tbody>
            <tr>
              <td className="w-40 py-2">Bidang Keahlian</td>
              <td className="w-4 py-2">:</td>
              <td className="py-2">Teknologi Manufaktur dan Rekayasa</td>
            </tr>
            <tr>
              <td className="py-2">Program Keahlian</td>
              <td className="py-2">:</td>
              <td className="py-2">Teknik Otomotif</td>
            </tr>
            <tr>
              <td className="py-2 align-top">Konsentrasi Keahlian</td>
              <td className="py-2 align-top">:</td>
              <td className="py-2">Teknik Kendaraan Ringan</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center w-2/3 mt-10">
        <p className="text-lg">Nama Peserta Didik</p>
        <div className="border border-black font-bold text-2xl py-3 mt-2 uppercase">{student.name}</div>
        
        <p className="text-lg mt-8">NIS/NISN</p>
        <div className="border border-black font-bold text-xl py-2 mt-2">{student.nis} / {student.nisn}</div>
      </div>

      <div className="mt-auto mb-10 text-xl font-bold">
        KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN<br/>
        REPUBLIK INDONESIA
      </div>
    </div>
  );
}
