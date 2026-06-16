import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SchoolInfo, Student, Subject, Score, PKL, Ekskul, Kokurikuler, Attendance } from '../types';
import { SCHOOL_INFO, STUDENTS, SUBJECTS } from '../data';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface AppState {
  schoolInfo: SchoolInfo;
  students: Student[];
  subjects: Subject[];
  scores: Score[];
  pkls: PKL[];
  ekskuls: Ekskul[];
  kokurikulers: Kokurikuler[];
  attendances: Attendance[];
  user: User | null;
  loading: boolean;
  
  setSchoolInfo: (info: SchoolInfo) => void;
  setStudents: (students: Student[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setScores: (scores: Score[]) => void;
  setPkls: (pkls: PKL[]) => void;
  setEkskuls: (ekskuls: Ekskul[]) => void;
  setKokurikulers: (kokurikulers: Kokurikuler[]) => void;
  setAttendances: (attendances: Attendance[]) => void;
  resetAllData: () => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

function getInitial<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [schoolInfo, _setSchoolInfo] = useState<SchoolInfo>(() => getInitial('raport_school', SCHOOL_INFO));
  const [students, _setStudents] = useState<Student[]>(() => getInitial('raport_students', STUDENTS));
  const [subjects, _setSubjects] = useState<Subject[]>(() => getInitial('raport_subjects', SUBJECTS));
  const [scores, _setScores] = useState<Score[]>(() => getInitial('raport_scores', []));
  const [pkls, _setPkls] = useState<PKL[]>(() => getInitial('raport_pkls', []));
  const [ekskuls, _setEkskuls] = useState<Ekskul[]>(() => getInitial('raport_ekskuls', []));
  const [kokurikulers, _setKokurikulers] = useState<Kokurikuler[]>(() => getInitial('raport_kokurikulers', []));
  const [attendances, _setAttendances] = useState<Attendance[]>(() => getInitial('raport_attendances', []));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'teachers', currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.schoolInfo) _setSchoolInfo(JSON.parse(data.schoolInfo));
            if (data.students) _setStudents(JSON.parse(data.students));
            if (data.subjects) _setSubjects(JSON.parse(data.subjects));
            if (data.scores) _setScores(JSON.parse(data.scores));
            if (data.pkls) _setPkls(JSON.parse(data.pkls));
            if (data.ekskuls) _setEkskuls(JSON.parse(data.ekskuls));
            if (data.kokurikulers) _setKokurikulers(JSON.parse(data.kokurikulers));
            if (data.attendances) _setAttendances(JSON.parse(data.attendances));
          } else {
            // New user, push initial local template data to Firestore
            await setDoc(docRef, {
              userId: currentUser.uid,
              schoolInfo: JSON.stringify(schoolInfo),
              students: JSON.stringify(students),
              subjects: JSON.stringify(subjects),
              scores: JSON.stringify(scores),
              pkls: JSON.stringify(pkls),
              ekskuls: JSON.stringify(ekskuls),
              kokurikulers: JSON.stringify(kokurikulers),
              attendances: JSON.stringify(attendances)
            });
          }
        } catch (error) {
          console.error("Firebase fetch error", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const syncToFirebase = async (key: string, value: any) => {
    if (user) {
      try {
        await setDoc(doc(db, 'teachers', user.uid), {
          [key]: JSON.stringify(value),
          userId: user.uid
        }, { merge: true });
      } catch (error) {
        console.error("Firebase sync error", error);
      }
    }
  };

  const setSchoolInfo = (val: SchoolInfo) => { _setSchoolInfo(val); localStorage.setItem('raport_school', JSON.stringify(val)); syncToFirebase('schoolInfo', val); };
  const setStudents = (val: Student[]) => { _setStudents(val); localStorage.setItem('raport_students', JSON.stringify(val)); syncToFirebase('students', val); };
  const setSubjects = (val: Subject[]) => { _setSubjects(val); localStorage.setItem('raport_subjects', JSON.stringify(val)); syncToFirebase('subjects', val); };
  const setScores = (val: Score[]) => { _setScores(val); localStorage.setItem('raport_scores', JSON.stringify(val)); syncToFirebase('scores', val); };
  const setPkls = (val: PKL[]) => { _setPkls(val); localStorage.setItem('raport_pkls', JSON.stringify(val)); syncToFirebase('pkls', val); };
  const setEkskuls = (val: Ekskul[]) => { _setEkskuls(val); localStorage.setItem('raport_ekskuls', JSON.stringify(val)); syncToFirebase('ekskuls', val); };
  const setKokurikulers = (val: Kokurikuler[]) => { _setKokurikulers(val); localStorage.setItem('raport_kokurikulers', JSON.stringify(val)); syncToFirebase('kokurikulers', val); };
  const setAttendances = (val: Attendance[]) => { _setAttendances(val); localStorage.setItem('raport_attendances', JSON.stringify(val)); syncToFirebase('attendances', val); };

  const resetAllData = () => {
    setSchoolInfo(SCHOOL_INFO);
    setStudents(STUDENTS);
    setSubjects(SUBJECTS);
    setScores([]);
    setPkls([]);
    setEkskuls([]);
    setKokurikulers([]);
    setAttendances([]);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.clear(); // Clear local state to prevent data bleed between users on the same device
      
      // Optionally reset state to empty
      _setSchoolInfo(SCHOOL_INFO);
      _setStudents([]);
      _setSubjects([]);
      _setScores([]);
      _setPkls([]);
      _setEkskuls([]);
      _setKokurikulers([]);
      _setAttendances([]);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AppContext.Provider value={{
      schoolInfo, students, subjects, scores, pkls, ekskuls, kokurikulers, attendances, user, loading,
      setSchoolInfo, setStudents, setSubjects, setScores, setPkls, setEkskuls, setKokurikulers, setAttendances, resetAllData, logout
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
