'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import dynamic from 'next/dynamic';

const BarcodeScanner = dynamic(() => import('../../../components/BarcodeScanner'), { ssr: false });

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const router = useRouter();

  const handleBarcodeDetected = async (code: string) => {
    if (isLoading) return; // Prevent multiple simultaneous login attempts
    
    setScannedCode(code);
    setIsLoading(true);

    try {
      toast.loading('Logging in...', { id: 'login' });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationNo: code.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('student', JSON.stringify(data.student));
        toast.success('Login successful!', { id: 'login' });
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed. Please try scanning again.', { id: 'login' });
        setScannedCode('');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try scanning again.', { id: 'login' });
      setScannedCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Student Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Scan your student ID barcode to login instantly
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {scannedCode && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">Scanned ID:</span> {scannedCode}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isLoading ? 'Logging you in...' : 'Position your ID card in the camera'}
              </h3>
              
              {!isLoading && (
                <BarcodeScanner onDetected={handleBarcodeDetected} />
              )}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Processing login...</p>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Make sure your student ID barcode is clearly visible and well-lit
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
