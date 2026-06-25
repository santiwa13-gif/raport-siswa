export interface Student {
  nis: string;
  nisn: string;
  name: string;
  gender: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  statusDalamKeluarga?: string;
  anakKe?: string;
  alamat?: string;
  noTelp?: string;
  asalSekolah?: string;
  tanggalDiterima?: string;
  namaAyah?: string;
  pekerjaanAyah?: string;
  namaIbu?: string;
  pekerjaanIbu?: string;
  namaWali?: string;
  alamatWali?: string;
  noTelpWali?: string;
  pekerjaanWali?: string;
}

export interface Subject {
  code: string;
  name: string;
  group: string;
  kkm: number;
}

export interface Score {
  studentNis: string;
  subjectCode: string;
  value: number | null;
  cp1Score?: number | null;
  cp2Score?: number | null;
  cp3Score?: number | null;
  cp4Score?: number | null;
  astsScore?: number | null;
  asasScore?: number | null;
  cp1: string;
  cp2: string;
  cp3: string;
  cp4: string;
}

export interface SchoolInfo {
  name: string;
  address: string;
  nss: string;
  npsn: string;
  headmaster: string;
  headmasterNbm: string;
  className: string;
  semester: string;
  academicYear: string;
  homeroomTeacher: string;
  homeroomTeacherNbm: string;
  reportDate: string;
  phase: string;
  curriculum: string;
  logo?: string;
  kkm: number;
}

export interface PKL {
  studentNis: string;
  no: number;
  mitra: string;
  lokasi: string;
  lamanya: string;
  nilai: string;
  keterangan: string;
}

export interface Ekskul {
  studentNis: string;
  no: number;
  kegiatan: string;
  nilai: string;
  keterangan: string;
}

export interface Kokurikuler {
  studentNis: string;
  no: number;
  deskripsi: string;
}

export interface ClassData {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
}

export interface Attendance {
  studentNis: string;
  sakit: number;
  izin: number;
  tanpaKeterangan: number;
  catatanWaliKelas: string;
  naikKelas: string;
}

