/**
 * Log Ingestion Page
 * Main page for ingesting events through multiple methods
 */

import { ManualEntryForm } from '../components/ingestion/ManualEntryForm';
import { FileUpload } from '../components/ingestion/FileUpload';
import { FakeLogGenerator } from '../components/ingestion/FakeLogGenerator';

export function LogIngestion() {
  return (
    <div className="min-h-screen bg-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Log Ingestion</h1>
          <p className="text-gray-400">
            Import security events through multiple ingestion methods
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-8 text-blue-200">
          <p className="text-sm">
            💡 Use any of the methods below to populate the system with security events.
            Events are normalized, validated, and stored in Firestore automatically.
          </p>
        </div>

        {/* Ingestion Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Manual Entry */}
          <div className="lg:col-span-1">
            <ManualEntryForm />
          </div>

          {/* Fake Generator */}
          <div className="lg:col-span-1">
            <FakeLogGenerator />
          </div>
        </div>

        {/* File Upload - Full Width */}
        <div className="mb-6">
          <FileUpload />
        </div>

        {/* Help Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h3 className="text-white font-semibold mb-2">Manual Entry</h3>
              <p className="text-sm">
                Enter individual security events by filling out a form. Ideal for
                single, ad-hoc event entries or testing specific scenarios.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">File Upload</h3>
              <p className="text-sm">
                Upload CSV or JSON files containing multiple events. Supports bulk
                imports with automatic field normalization and validation.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Fake Generator</h3>
              <p className="text-sm">
                Generate realistic test events for demonstrations. Includes prebuilt
                attack scenarios like brute force and port scans.
              </p>
            </div>
          </div>
        </div>

        {/* Event Types Reference */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Event Types Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-yellow-400 font-semibold">failed_login</div>
              <p className="text-gray-400">Login attempt denied</p>
            </div>
            <div>
              <div className="text-green-400 font-semibold">successful_login</div>
              <p className="text-gray-400">User successfully authenticated</p>
            </div>
            <div>
              <div className="text-orange-400 font-semibold">port_scan</div>
              <p className="text-gray-400">Network scan detected</p>
            </div>
            <div>
              <div className="text-red-400 font-semibold">privilege_escalation</div>
              <p className="text-gray-400">Unauthorized privilege attempt</p>
            </div>
            <div>
              <div className="text-blue-400 font-semibold">info</div>
              <p className="text-gray-400">Informational event</p>
            </div>
          </div>
        </div>

        {/* Severity Levels Reference */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Severity Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <div className="text-red-500 font-semibold">Critical</div>
              <p className="text-gray-400">Immediate action required</p>
            </div>
            <div>
              <div className="text-orange-500 font-semibold">High</div>
              <p className="text-gray-400">Urgent attention needed</p>
            </div>
            <div>
              <div className="text-yellow-500 font-semibold">Medium</div>
              <p className="text-gray-400">Needs investigation</p>
            </div>
            <div>
              <div className="text-blue-500 font-semibold">Low</div>
              <p className="text-gray-400">Monitor and track</p>
            </div>
            <div>
              <div className="text-gray-400 font-semibold">Info</div>
              <p className="text-gray-400">General information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
