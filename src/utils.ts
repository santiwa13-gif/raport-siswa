import { useAppStore } from '../context/AppContext';

export const getPredicate = (score: number, kkm: number) => {
  if (score >= 90) return { letter: 'A', description: 'Sangat Baik' };
  if (score >= 80) return { letter: 'B', description: 'Baik' };
  if (score >= 70) return { letter: 'C', description: 'Cukup' };
  return { letter: 'D', description: 'Perlu Dimaksimalkan' };
};

export const getScoreColor = (score: number | null | undefined, kkm: number) => {
  if (score == null) return 'text-gray-900';
  return score >= kkm ? 'text-green-600 font-medium' : 'text-red-600 font-medium';
};

// Common file processing helper
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
