import { APP_CONFIG } from '@/constants';

interface LandingHeaderProps {
  onLoginClick: () => void;
}

export default function LandingHeader({ onLoginClick }: LandingHeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌟</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </h1>
          </div>
          <button
            onClick={onLoginClick}
            className="bg-wellness-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 / 회원가입
          </button>
        </div>
      </div>
    </header>
  );
} 