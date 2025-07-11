import { DASHBOARD_STATS } from '@/constants/landingData';

export default function DashboardPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          📱 스마트 대시보드
        </h2>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-xl font-semibold">건강 대시보드</h3>
              <div className="text-sm opacity-90">최근 30일</div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {DASHBOARD_STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {stat.value}
                    <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* 차트 미리보기 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">주간 건강 추이</h4>
              <div className="h-40 flex items-end justify-between space-x-2">
                {/* 가상 차트 바 */}
                {[65, 78, 52, 89, 73, 96, 84].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-md min-h-2 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { 
                        weekday: 'short' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-600">심박수</div>
                    <div className="text-2xl font-bold text-blue-800">72 bpm</div>
                  </div>
                  <div className="text-2xl">❤️</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-600">수면</div>
                    <div className="text-2xl font-bold text-green-800">7.2h</div>
                  </div>
                  <div className="text-2xl">😴</div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-600">기분</div>
                    <div className="text-2xl font-bold text-purple-800">8.5/10</div>
                  </div>
                  <div className="text-2xl">😊</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 