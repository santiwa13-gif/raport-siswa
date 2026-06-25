import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SchoolInfo, Student, Subject, Score, PKL, Ekskul, Kokurikuler, Attendance, ClassData } from '../types';
import { SCHOOL_INFO, STUDENTS, SUBJECTS } from '../data';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface AppState {
  classes: ClassData[];
  currentClassId: string | null;
  setCurrentClassId: (id: string | null) => void;
  createNewClass: (name: string) => Promise<void>;
  joinClass: (classId: string) => Promise<void>;
  
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [currentClassId, setCurrentClassId] = useState<string | null>(() => localStorage.getItem('raport_current_class'));

  const [schoolInfo, _setSchoolInfo] = useState<SchoolInfo>(SCHOOL_INFO);
  const [students, _setStudents] = useState<Student[]>(STUDENTS);
  const [subjects, _setSubjects] = useState<Subject[]>(SUBJECTS);
  const [scores, _setScores] = useState<Score[]>([]);
  const [pkls, _setPkls] = useState<PKL[]>([]);
  const [ekskuls, _setEkskuls] = useState<Ekskul[]>([]);
  const [kokurikulers, _setKokurikulers] = useState<Kokurikuler[]>([]);
  const [attendances, _setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadClasses(currentUser.uid);
      } else {
        setClasses([]);
        setCurrentClassId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const loadClasses = async (uid: string) => {
    try {
      const q = query(collection(db, 'classes'));
      const snap = await getDocs(q);
      const loaded: ClassData[] = [];
      snap.forEach(doc => {
        const d = doc.data();
        if (d.ownerId === uid || (d.collaboratorIds && d.collaboratorIds.includes(uid))) {
          loaded.push({ id: doc.id, name: d.name, ownerId: d.ownerId, ownerEmail: d.ownerEmail || '' });
        }
      });
      setClasses(loaded);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentClassId && user) {
      localStorage.setItem('raport_current_class', currentClassId);
      loadClassData(currentClassId);
    } else {
      localStorage.removeItem('raport_current_class');
    }
  }, [currentClassId, user]);

  const loadClassData = async (classId: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'classes', classId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.schoolInfo) _setSchoolInfo(JSON.parse(data.schoolInfo)); else _setSchoolInfo(SCHOOL_INFO);
        if (data.students) _setStudents(JSON.parse(data.students)); else _setStudents(STUDENTS);
        if (data.subjects) _setSubjects(JSON.parse(data.subjects)); else _setSubjects(SUBJECTS);
        if (data.scores) _setScores(JSON.parse(data.scores)); else _setScores([]);
        if (data.pkls) _setPkls(JSON.parse(data.pkls)); else _setPkls([]);
        if (data.ekskuls) _setEkskuls(JSON.parse(data.ekskuls)); else _setEkskuls([]);
        if (data.kokurikulers) _setKokurikulers(JSON.parse(data.kokurikulers)); else _setKokurikulers([]);
        if (data.attendances) _setAttendances(JSON.parse(data.attendances)); else _setAttendances([]);
      }
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  const syncToFirebase = async (key: string, value: any) => {
    if (user && currentClassId) {
      try {
        await setDoc(doc(db, 'classes', currentClassId), {
          [key]: JSON.stringify(value)
        }, { merge: true });
      } catch (error) {
        console.error("Firebase sync error", error);
      }
    }
  };

  const createNewClass = async (name: string) => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'classes'), {
      name,
      ownerId: user.uid,
      ownerEmail: user.email,
      collaboratorIds: [],
      schoolInfo: JSON.stringify(SCHOOL_INFO),
      students: JSON.stringify(STUDENTS),
      subjects: JSON.stringify(SUBJECTS)
    });
    await loadClasses(user.uid);
    setCurrentClassId(docRef.id);
  };

  const joinClass = async (classId: string) => {
    if (!user) return;
    const docRef = doc(db, 'classes', classId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const collabs = data.collaboratorIds || [];
      if (!collabs.includes(user.uid) && data.ownerId !== user.uid) {
        collabs.push(user.uid);
        await setDoc(docRef, { collaboratorIds: collabs }, { merge: true });
      }
      await loadClasses(user.uid);
      setCurrentClassId(classId);
    } else {
      throw new Error("Kelas tidak ditemukan");
    }
  };

  const setSchoolInfo = (val: SchoolInfo) => { _setSchoolInfo(val); syncToFirebase('schoolInfo', val); };
  const setStudents = (val: Student[]) => { _setStudents(val); syncToFirebase('students', val); };
  const setSubjects = (val: Subject[]) => { _setSubjects(val); syncToFirebase('subjects', val); };
  const setScores = (val: Score[]) => { _setScores(val); syncToFirebase('scores', val); };
  const setPkls = (val: PKL[]) => { _setPkls(val); syncToFirebase('pkls', val); };
  const setEkskuls = (val: Ekskul[]) => { _setEkskuls(val); syncToFirebase('ekskuls', val); };
  const setKokurikulers = (val: Kokurikuler[]) => { _setKokurikulers(val); syncToFirebase('kokurikulers', val); };
  const setAttendances = (val: Attendance[]) => { _setAttendances(val); syncToFirebase('attendances', val); };

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
      localStorage.clear();
      _setSchoolInfo(SCHOOL_INFO);
      _setStudents([]);
      _setSubjects([]);
      _setScores([]);
      _setPkls([]);
      _setEkskuls([]);
      _setKokurikulers([]);
      _setAttendances([]);
      setClasses([]);
      setCurrentClassId(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AppContext.Provider value={{
      classes, currentClassId, setCurrentClassId, createNewClass, joinClass,
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

