import { useState, useEffect } from 'react';
import type { Score } from './types';

export function useScores() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const savedScores = localStorage.getItem('raport_scores');
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (e) {
        console.error('Failed to parse scores from localStorage', e);
      }
    }
  }, []);

  const saveScores = (newScores: Score[]) => {
    setScores(newScores);
    localStorage.setItem('raport_scores', JSON.stringify(newScores));
  };

  const updateScore = (studentNis: string, subjectCode: string, value: number) => {
    const updatedScores = [...scores];
    const index = updatedScores.findIndex(
      (s) => s.studentNis === studentNis && s.subjectCode === subjectCode
    );

    if (index >= 0) {
      updatedScores[index].value = value;
    } else {
      updatedScores.push({ studentNis, subjectCode, value });
    }

    saveScores(updatedScores);
  };

  const updateCompetency = (studentNis: string, subjectCode: string, competency: string) => {
    const updatedScores = [...scores];
    const index = updatedScores.findIndex(
      (s) => s.studentNis === studentNis && s.subjectCode === subjectCode
    );

    if (index >= 0) {
      updatedScores[index].competency = competency;
    } else {
      updatedScores.push({ studentNis, subjectCode, value: 0, competency });
    }

    saveScores(updatedScores);
  };

  const resetScores = () => {
    if (window.confirm('Yakin ingin mereset semua data nilai? Aksi ini tidak dapat dibatalkan.')) {
      saveScores([]);
    }
  };

  const getScore = (studentNis: string, subjectCode: string): number | null => {
    const score = scores.find((s) => s.studentNis === studentNis && s.subjectCode === subjectCode);
    return score ? score.value : null;
  };

  const getScoreObj = (studentNis: string, subjectCode: string): Score | null => {
    return scores.find((s) => s.studentNis === studentNis && s.subjectCode === subjectCode) || null;
  };

  return { scores, updateScore, updateCompetency, resetScores, getScore, getScoreObj, saveScores };
}
