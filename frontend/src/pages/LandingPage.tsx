import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { ShieldAlert, Route, Users, Bell, ArrowRight, Activity, AlertTriangle, CloudRain, Server, Database, Cloud, Zap, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { demoState } = useAppContext();
  // Assume mock data for status if not available
  const activeRiskZones = 12;
  const reportsLastHour = 45;
  const severeAlerts = 3;
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Predict flooding before it becomes dangerous.
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mb-10">
          FloodGuard combines rainfall, geographic intelligence, and community reports to help people understand flood risk and choose safer routes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Check My Area <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/dashboard?view=map')}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700"
          >
            Explore Live Risk Map
          </button>
        </div>
      </section>

      {/* Live Environment Status */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"></div>
          <h2 className="text-sm font-semibold tracking-widest text-gray-400 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            {demoState?.isActive ? 'DEMO DATA' : 'LIVE ENVIRONMENT STATUS'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Risk Zones</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-amber-500">{activeRiskZones}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Reports in Last Hour</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-400">{reportsLastHour}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Severe Alerts</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-red-500">{severeAlerts}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mb-6">
              <CloudRain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Monitor</h3>
            <p className="text-gray-400">Real-time rainfall and environmental data analysis from multiple reliable sources.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-900/30 text-amber-400 rounded-full flex items-center justify-center mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Predict</h3>
            <p className="text-gray-400">ML-powered flood risk scoring with explainable factors updated continuously.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mb-6">
              <Route className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Protect</h3>
            <p className="text-gray-400">Safe route recommendations and community alerts to keep you and your family secure.</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
              <ShieldAlert className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Flood Risk Intelligence</h3>
              <p className="text-gray-400">Advanced prediction models that analyze elevation, drainage, and real-time precipitation.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
              <Route className="w-10 h-10 text-green-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Safe Route Planning</h3>
              <p className="text-gray-400">Navigate around dangerous areas with routes optimized for safety during extreme weather.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
              <Users className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Community Reports</h3>
              <p className="text-gray-400">Crowdsourced intelligence helps verify system predictions and locate hyper-local issues.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
              <Bell className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Real-time Alerts</h3>
              <p className="text-gray-400">Instant notifications when conditions change or new risks emerge in your saved areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AWS Architecture */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Built on AWS Serverless Architecture</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Highly available, scalable infrastructure designed to handle traffic spikes during extreme weather events.</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto text-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"><Cloud className="w-6 h-6 text-purple-400"/></div>
            <span>CloudFront</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 hidden md:block" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"><Server className="w-6 h-6 text-green-400"/></div>
            <span>S3</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 hidden md:block" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"><Activity className="w-6 h-6 text-blue-400"/></div>
            <span>API Gateway</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 hidden md:block" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"><Zap className="w-6 h-6 text-orange-400"/></div>
            <span>Lambda</span>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 hidden md:block" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"><Database className="w-6 h-6 text-blue-500"/></div>
            <span>DynamoDB</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8 text-gray-400 text-sm">
          <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">Cognito (Auth)</span>
          <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">EventBridge</span>
          <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">SNS</span>
          <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">CloudWatch</span>
          <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">Bedrock (ML)</span>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-950 to-blue-950/20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to check your area?</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Get access to real-time flood intelligence and community reports.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
