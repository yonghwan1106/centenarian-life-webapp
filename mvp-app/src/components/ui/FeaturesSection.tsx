import { FEATURES } from '@/constants/landingData';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          🎯 주요 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 