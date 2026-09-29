import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LogIn, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      login(email, 'user');
      setLoading(false);
    }, 500);
  };

  const handleDemoLogin = () => {
    login('sophia@stylesense.ai', 'user');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4">
            <span className="text-2xl font-bold">✨</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">StyleSense</h1>
          <p className="text-gray-400">Your AI Fashion & Digital Wardrobe Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#16161A] border border-[#26262E] rounded-3xl p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-gray-400" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full justify-center"
              disabled={loading}
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#26262E]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#16161A] text-gray-400">Or continue with demo</span>
            </div>
          </div>

          {/* Demo Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center"
            onClick={handleDemoLogin}
          >
            Try Demo Account
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center">
            Welcome to StyleSense! Sign in to access your digital wardrobe, get AI outfit recommendations, and explore the fashion marketplace.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-400">55+</div>
            <p className="text-xs text-gray-400">Wardrobe Items</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-400">AI</div>
            <p className="text-xs text-gray-400">Smart Stylist</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-yellow-400">∞</div>
            <p className="text-xs text-gray-400">Possibilities</p>
          </div>
        </div>
      </div>
    </div>
  );
};
