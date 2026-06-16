import React from 'react';
import { useAppStore } from '../context/AppContext';
import { Student } from '../types';

export function PrintIdentitas({ student }: { student: Student }) {
  const { schoolInfo } = useAppStore();
  
  return (
    <div className="pt-8 text-black">
      <h2 className="text-xl font-bold text-center uppercase mb-20">KETERANGAN TENTANG DIRI PESERTA DIDIK</h2>

      <table className="w-full text-[15px] space-y-1 border-separate border-spacing-y-2">
        <tbody>
          <tr><td className="w-8 align-top">1.</td><td className="w-64">Nama Peserta Didik (Lengkap)</td><td className="w-4">:</td><td className="font-bold">{student.name}</td></tr>
          <tr><td>2.</td><td>NIS/NISN</td><td>:</td><td>{student.nis} / {student.nisn}</td></tr>
          <tr><td>3.</td><td>Tempat Tanggal Lahir</td><td>:</td><td>{student.tempatLahir || '-'}, {student.tanggalLahir || '-'}</td></tr>
          <tr><td>4.</td><td>Jenis Kelamin</td><td>:</td><td>{student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td></tr>
          <tr><td>5.</td><td>Agama</td><td>:</td><td>{student.agama || '-'}</td></tr>
          <tr><td>6.</td><td>Status dalam Keluarga</td><td>:</td><td>{student.statusDalamKeluarga || '-'}</td></tr>
          <tr><td>7.</td><td>Anak ke</td><td>:</td><td>{student.anakKe || '-'}</td></tr>
          <tr><td className="align-top">8.</td><td className="align-top">Alamat Peserta Didik</td><td className="align-top">:</td><td>{student.alamat || '-'}</td></tr>
          <tr><td>9.</td><td>Nomor Telpon Rumah / HP</td><td>:</td><td>{student.noTelp || '-'}</td></tr>
          <tr><td>10.</td><td>Sekolah Asal</td><td>:</td><td>{student.asalSekolah || '-'}</td></tr>
          <tr><td className="align-top">11.</td><td className="align-top">Diterima di sekolah ini</td><td className="align-top">:</td><td className="align-top"></td></tr>
          <tr><td></td><td className="pl-6">Di kelas</td><td>:</td><td>{schoolInfo.className}</td></tr>
          <tr><td></td><td className="pl-6">Pada tanggal</td><td>:</td><td>{student.tanggalDiterima || '-'}</td></tr>
          <tr><td className="align-top">12.</td><td className="align-top">Nama Orang Tua</td><td className="align-top">:</td><td></td></tr>
          <tr><td></td><td className="pl-6">a. Ayah</td><td>:</td><td>{student.namaAyah || '-'}</td></tr>
          <tr><td></td><td className="pl-6">b. Ibu</td><td>:</td><td>{student.namaIbu || '-'}</td></tr>
          <tr><td className="align-top">13.</td><td className="align-top">Alamat Orang Tua</td><td className="align-top">:</td><td>{student.alamatWali || '-'}</td></tr>
          <tr><td></td><td className="pl-6">Nomor Telepon Rumah</td><td>:</td><td>{student.noTelpWali || '-'}</td></tr>
          <tr><td className="align-top">14.</td><td className="align-top">Pekerjaan Orang Tua</td><td className="align-top">:</td><td></td></tr>
          <tr><td></td><td className="pl-6">a. Ayah</td><td>:</td><td>{student.pekerjaanAyah || '-'}</td></tr>
          <tr><td></td><td className="pl-6">b. Ibu</td><td>:</td><td>{student.pekerjaanIbu || '-'}</td></tr>
          <tr><td>15.</td><td>Nama Wali Peserta Didik</td><td>:</td><td>{student.namaWali || '-'}</td></tr>
          <tr><td className="align-top">16.</td><td className="align-top">Alamat Wali Peserta Didik</td><td className="align-top">:</td><td>{student.alamatWali || '-'}</td></tr>
          <tr><td></td><td className="pl-6">Nomor Telpon Rumah / HP</td><td>:</td><td>{student.noTelpWali || '-'}</td></tr>
          <tr><td>17.</td><td>Pekerjaan Wali Peserta Didik</td><td>:</td><td>{student.pekerjaanWali || '-'}</td></tr>
        </tbody>
      </table>

      <div className="flex mt-5 ml-32">
        <div className="w-32 h-40 border border-black flex items-center justify-center text-sm mr-24 shrink-0">
          <div className="text-center text-gray-500">Pas Foto<br/>3 x 4 cm</div>
        </div>
        <div className="flex-1 right-0 text-[15px]">
          <p>Blora, {schoolInfo.reportDate}</p>
          <p className="mb-20">Kepala Sekolah,</p>
          <p className="font-bold underline">{schoolInfo.headmaster}</p>
          <p>NBM/NIP. {schoolInfo.headmasterNbm}</p>
        </div>
      </div>
    </div>
  );
}
