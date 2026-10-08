import React, { useState } from 'react';
import { IncidentTypeSelector } from '../components/report/IncidentTypeSelector';
import { SeveritySelector } from '../components/report/SeveritySelector';
import { PhotoUpload } from '../components/report/PhotoUpload';
import { IncidentType, ReportSeverity } from '../types';
import { MapPin, Navigation, CheckCircle, AlertCircle } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [severity, setSeverity] = useState<ReportSeverity | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutoDetect = () => {
    setLocation('Current Location (Detected)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType || !severity || !description || !location) {
      setError('Please fill in all required fields.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form after success message
      setTimeout(() => {
        setIsSuccess(false);
        setIncidentType(null);
        setSeverity(null);
        setDescription('');
        setLocation('');
        setFile(null);
      }, 5000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-green-500/10 border-2 border-green-500/20 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-gray-300 mb-6">
            Status: <span className="font-semibold text-yellow-400">UNVERIFIED</span>
          </p>
          <p className="text-gray-400 max-w-md mx-auto">
            Thank you for helping your community. Your report has been sent to our system for verification.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="mt-8 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Report an Incident</h1>
        <p className="text-gray-400">Help others by reporting waterlogging, floods, or blocked roads in your area.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Incident Type */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">1. What happened? <span className="text-red-400">*</span></h2>
          <IncidentTypeSelector selected={incidentType} onSelect={setIncidentType} />
        </section>

        {/* Severity */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">2. How severe is it? <span className="text-red-400">*</span></h2>
          <SeveritySelector selected={severity} onSelect={setSeverity} />
        </section>

        {/* Location */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">3. Where is it? <span className="text-red-400">*</span></h2>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={handleAutoDetect}
              className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4 text-blue-400" />
              Use Current Location
            </button>
         <button
  type="button"
  onClick={() => {
    setLocation('Pinned Location');
  }}
  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
>
  <MapPin className="w-4 h-4 text-orange-400" />
  Pin on Map
</button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Or type an address..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </section>

        {/* Description */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-semibold text-white">4. Description <span className="text-red-400">*</span></h2>
            <span className={`text-xs ${description.length > 500 ? 'text-red-400' : 'text-gray-500'}`}>
              {description.length}/500
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the situation (e.g., Water is knee-deep, traffic is stuck)..."
            rows={4}
            maxLength={500}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </section>

        {/* Photo Upload */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Photo (Optional)</h2>
          <p className="text-sm text-gray-400 mb-4">A photo helps verify the incident faster.</p>
          <PhotoUpload onFileSelect={setFile} />
        </section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20 text-lg"
        >
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};
