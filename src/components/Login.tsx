import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { LogIn } from 'lucide-react';

export function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error logging in', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Gagal login: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Sistem Aplikasi Raport</h1>
        <p className="text-gray-600 mb-8">Silakan login dengan akun Google Anda untuk mengelola nilai siswa.</p>
        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors"
        >
          <LogIn size={20} />
          Login dengan Google
        </button>
      </div>
    </div>
  );
}
