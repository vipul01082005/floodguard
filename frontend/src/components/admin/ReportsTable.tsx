import React, { useState } from 'react';
import { Report, VerificationStatus } from '../../types';

interface ReportsTableProps {
  reports: Report[];
  onVerify: (id: string) => void;
  onResolve: (id: string) => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports, onVerify, onResolve }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  
  const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const currentReports = sortedReports.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'UNVERIFIED': return 'bg-gray-600 text-gray-200';
      case 'COMMUNITY_CONFIRMED': return 'bg-blue-900 text-blue-200';
      case 'SYSTEM_CORROBORATED': return 'bg-amber-900 text-amber-200';
      case 'RESOLVED': return 'bg-green-900 text-green-200';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'LOW': return 'text-green-400';
      case 'MODERATE': return 'text-amber-400';
      case 'HIGH': return 'text-orange-500';
      case 'SEVERE': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  if (reports.length === 0) {
    return <div className="text-center py-8 text-gray-500">No recent reports found.</div>;
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {currentReports.map(report => (
              <tr key={report.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-gray-300">
                  {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-gray-300 capitalize">{report.incidentType.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-gray-300">{report.locationName || 'Unknown Location'}</td>
                <td className={`px-4 py-3 font-medium ${getSeverityColor(report.severity)}`}>{report.severity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(report.verificationStatus)}`}>
                    {report.verificationStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {report.verificationStatus === 'UNVERIFIED' && (
                      <button 
                        onClick={() => onVerify(report.id)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded transition-colors"
                      >
                        Verify
                      </button>
                    )}
                    {report.verificationStatus !== 'RESOLVED' && (
                      <button 
                        onClick={() => onResolve(report.id)}
                        className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 pb-4">
          <span className="text-sm text-gray-500">
            Showing {page * itemsPerPage + 1} to {Math.min((page + 1) * itemsPerPage, reports.length)} of {reports.length} entries
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              disabled={page === totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
