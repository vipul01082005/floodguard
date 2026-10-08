import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAppContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (strength < 2) {
      setError('Password is too weak');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      register({ id: 'user-' + Date.now(), email, name, role: 'USER' });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <ShieldAlert className="w-12 h-12 text-blue-500 mb-4" />
        <h2 className="text-center text-3xl font-extrabold text-white">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 h-1.5 rounded-full overflow-hidden bg-gray-800 gap-1">
                    <div className={`h-full flex-1 ${strength >= 1 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                    <div className={`h-full flex-1 ${strength >= 2 ? 'bg-amber-500' : 'bg-gray-700'}`}></div>
                    <div className={`h-full flex-1 ${strength >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                    <div className={`h-full flex-1 ${strength >= 4 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">
                    {strength === 0 && 'Very Weak'}
                    {strength === 1 && 'Weak'}
                    {strength === 2 && 'Fair'}
                    {strength === 3 && 'Good'}
                    {strength === 4 && 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border ${confirmPassword && confirmPassword !== password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'} rounded-md shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                />
                {confirmPassword && confirmPassword === password && (
                  <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-2" />
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
