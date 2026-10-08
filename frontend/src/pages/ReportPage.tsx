import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { IncidentTypeSelector } from '../components/report/IncidentTypeSelector';
import { SeveritySelector } from '../components/report/SeveritySelector';
import { PhotoUpload } from '../components/report/PhotoUpload';
import { IncidentType, ReportSeverity } from '../types';
import {
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  X,
  Crosshair,
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

/*
 * Component that listens for clicks on the map.
 * When the user clicks anywhere on the map,
 * we send the coordinates back to ReportPage.
 */
const LocationPicker: React.FC<{
  onPick: (lat: number, lng: number) => void;
}> = ({ onPick }) => {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

export const ReportPage: React.FC = () => {
  const [incidentType, setIncidentType] =
    useState<IncidentType | null>(null);

  const [severity, setSeverity] =
    useState<ReportSeverity | null>(null);

  const [description, setDescription] = useState('');

  const [location, setLocation] = useState('');

  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [isDetectingLocation, setIsDetectingLocation] =
    useState(false);

  const [isMapOpen, setIsMapOpen] = useState(false);

  /*
   * Detect the user's REAL GPS location using
   * the browser's Geolocation API.
   */
  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      );
      return;
    }

    setIsDetectingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const detectedCoordinates = {
          lat: latitude,
          lng: longitude,
        };

        setCoordinates(detectedCoordinates);

        setLocation(
          `Current Location (${latitude.toFixed(
            6
          )}, ${longitude.toFixed(6)})`
        );

        setIsDetectingLocation(false);
      },

      (locationError) => {
        setIsDetectingLocation(false);

        switch (locationError.code) {
          case locationError.PERMISSION_DENIED:
            setError(
              'Location permission was denied. Please allow location access in your browser and try again.'
            );
            break;

          case locationError.POSITION_UNAVAILABLE:
            setError(
              'Your current location could not be determined.'
            );
            break;

          case locationError.TIMEOUT:
            setError(
              'Location detection timed out. Please try again.'
            );
            break;

          default:
            setError(
              'Unable to detect your current location.'
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /*
   * Open the interactive map.
   */
  const handlePinOnMap = () => {
    setError(null);
    setIsMapOpen(true);
  };

  /*
   * Called whenever the user clicks somewhere
   * on the interactive map.
   */
  const handleMapPick = (lat: number, lng: number) => {
    const pickedCoordinates = {
      lat,
      lng,
    };

    setCoordinates(pickedCoordinates);

    setLocation(
      `Pinned Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`
    );

    setError(null);
  };

  /*
   * Close the map.
   */
  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  /*
   * Confirm the selected map location.
   */
  const handleUseMapLocation = () => {
    if (!coordinates) {
      setError(
        'Please click on the map to select a location.'
      );
      return;
    }

    setIsMapOpen(false);
    setError(null);
  };

  /*
   * Submit report.
   *
   * For now this keeps your existing simulated submission.
   * The coordinates are now stored separately and can later
   * be sent directly to your backend API.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !incidentType ||
      !severity ||
      !description ||
      !location
    ) {
      setError(
        'Please fill in all required fields.'
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    console.log('Report location:', {
      location,
      coordinates,
    });

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
        setCoordinates(null);
        setFile(null);
      }, 5000);
    }, 1500);
  };

  /*
   * SUCCESS SCREEN
   */
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="bg-green-500/10 border-2 border-green-500/20 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Report Submitted
          </h2>

          <p className="text-gray-300 mb-6">
            Status:{' '}
            <span className="font-semibold text-yellow-400">
              UNVERIFIED
            </span>
          </p>

          <p className="text-gray-400 max-w-md mx-auto">
            Thank you for helping your community. Your report
            has been sent to our system for verification.
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
    <>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Report an Incident
          </h1>

          <p className="text-gray-400">
            Help others by reporting waterlogging, floods, or
            blocked roads in your area.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* INCIDENT TYPE */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              1. What happened?{' '}
              <span className="text-red-400">*</span>
            </h2>

            <IncidentTypeSelector
              selected={incidentType}
              onSelect={setIncidentType}
            />
          </section>


          {/* SEVERITY */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              2. How severe is it?{' '}
              <span className="text-red-400">*</span>
            </h2>

            <SeveritySelector
              selected={severity}
              onSelect={setSeverity}
            />
          </section>


          {/* LOCATION */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              3. Where is it?{' '}
              <span className="text-red-400">*</span>
            </h2>

            {/* LOCATION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">

              {/* CURRENT LOCATION */}
              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={isDetectingLocation}
                className="flex-1 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 border border-gray-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4 text-blue-400" />

                {isDetectingLocation
                  ? 'Detecting Location...'
                  : 'Use Current Location'}
              </button>


              {/* PIN ON MAP */}
              <button
                type="button"
                onClick={handlePinOnMap}
                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-orange-400" />

                Pin on Map
              </button>

            </div>


            {/* COORDINATE STATUS */}
            {coordinates && (
              <div className="mb-3 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
                <Crosshair className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />

                <div>
                  <p className="text-sm font-medium text-blue-300">
                    Location coordinates captured
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Latitude: {coordinates.lat.toFixed(6)}
                    {' • '}
                    Longitude: {coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}


            {/* LOCATION TEXT */}
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);

                  /*
                   * If the user manually changes the
                   * location text, we no longer know
                   * whether it matches the coordinates.
                   */
                  if (
                    coordinates &&
                    !e.target.value.includes(
                      coordinates.lat.toFixed(6)
                    )
                  ) {
                    setCoordinates(null);
                  }
                }}
                placeholder="Or type an address..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Use GPS for your current position, or click
              anywhere on the map to report an incident at a
              different location.
            </p>
          </section>


          {/* DESCRIPTION */}
          <section>
            <div className="flex justify-between items-end mb-4">

              <h2 className="text-lg font-semibold text-white">
                4. Description{' '}
                <span className="text-red-400">*</span>
              </h2>

              <span
                className={`text-xs ${
                  description.length > 500
                    ? 'text-red-400'
                    : 'text-gray-500'
                }`}
              >
                {description.length}/500
              </span>

            </div>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the situation (e.g., Water is knee-deep, traffic is stuck)..."
              rows={4}
              maxLength={500}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </section>


          {/* PHOTO */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">
              5. Photo (Optional)
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              A photo helps verify the incident faster.
            </p>

            <PhotoUpload
              onFileSelect={setFile}
            />
          </section>


          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">

              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

              <p>{error}</p>

            </div>
          )}


          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20 text-lg"
          >
            {isSubmitting
              ? 'Submitting Report...'
              : 'Submit Report'}
          </button>

        </form>
      </div>


      {/* =====================================================
          INTERACTIVE MAP MODAL
          ===================================================== */}

      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">

            {/* MAP HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">

              <div>
                <h2 className="text-lg font-bold text-white">
                  Select Incident Location
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Click anywhere on the map to place the
                  incident pin.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseMap}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Close map"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            {/* MAP */}
            <div className="w-full h-[420px]">

              <MapContainer
                center={
                  coordinates
                    ? [
                        coordinates.lat,
                        coordinates.lng,
                      ]
                    : [20.5937, 78.9629]
                }
                zoom={coordinates ? 15 : 5}
                scrollWheelZoom={true}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationPicker
                  onPick={handleMapPick}
                />

                {coordinates && (
                  <CircleMarker
                    center={[
                      coordinates.lat,
                      coordinates.lng,
                    ]}
                    radius={10}
                    pathOptions={{
                      color: '#f97316',
                      fillColor: '#f97316',
                      fillOpacity: 0.9,
                      weight: 3,
                    }}
                  />
                )}

              </MapContainer>

            </div>


            {/* SELECTED LOCATION */}
            <div className="px-5 py-4 border-t border-gray-700">

              {coordinates ? (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">

                  <div className="flex items-center gap-2 mb-1">

                    <MapPin className="w-4 h-4 text-orange-400" />

                    <span className="text-sm font-semibold text-orange-300">
                      Selected Location
                    </span>

                  </div>

                  <p className="text-xs text-gray-400">
                    Latitude:{' '}
                    {coordinates.lat.toFixed(6)}
                    {' • '}
                    Longitude:{' '}
                    {coordinates.lng.toFixed(6)}
                  </p>

                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-3">

                  <p className="text-sm text-gray-400">
                    Click anywhere on the map to select a
                    location.
                  </p>

                </div>
              )}

            </div>


            {/* MAP ACTIONS */}
            <div className="flex gap-3 px-5 py-4 border-t border-gray-700">

              <button
                type="button"
                onClick={handleCloseMap}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUseMapLocation}
                disabled={!coordinates}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                Use This Location
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
