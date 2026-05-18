/**
 * File Upload Component
 * Handles CSV and JSON file uploads for bulk event ingestion
 */

import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { addEvent } from '../../firebase/events';
import { normalizeEvent, validateEvent } from '../../utils/normalizer';

export function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        await handleCSVFile(file);
      } else if (fileExtension === 'json') {
        await handleJSONFile(file);
      } else {
        throw new Error('Only CSV and JSON files are supported');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process file');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data;

            if (!Array.isArray(data) || data.length === 0) {
              throw new Error('CSV file is empty or invalid format');
            }

            // Process each row
            let successCount = 0;
            const totalCount = data.length;

            for (let i = 0; i < data.length; i++) {
              try {
                const row = data[i];

                // Normalize and validate
                const normalizedEvent = normalizeEvent(row);
                const validation = validateEvent(normalizedEvent);

                if (!validation.valid) {
                  console.warn(`Row ${i + 1} validation failed:`, validation.errors);
                  continue;
                }

                // Add to Firestore
                await addEvent(normalizedEvent);
                successCount++;

                // Update progress
                setProgress(Math.round(((i + 1) / totalCount) * 100));
              } catch (rowError) {
                console.warn(`Error processing row ${i + 1}:`, rowError);
              }
            }

            if (successCount === 0) {
              throw new Error('No valid events found in CSV file');
            }

            setSuccess({
              count: successCount,
              total: totalCount,
              message: `Imported ${successCount} of ${totalCount} events successfully`,
            });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000);

            resolve();
          } catch (err) {
            reject(err);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  };

  const handleJSONFile = async (file) => {
    const fileContent = await file.text();

    try {
      const parsed = JSON.parse(fileContent);

      // Handle both single object and array of objects
      let events = Array.isArray(parsed) ? parsed : [parsed];

      if (events.length === 0) {
        throw new Error('JSON file contains no events');
      }

      // Process each event
      let successCount = 0;
      const totalCount = events.length;

      for (let i = 0; i < events.length; i++) {
        try {
          const event = events[i];

          // Normalize and validate
          const normalizedEvent = normalizeEvent(event);
          const validation = validateEvent(normalizedEvent);

          if (!validation.valid) {
            console.warn(`Event ${i + 1} validation failed:`, validation.errors);
            continue;
          }

          // Add to Firestore
          await addEvent(normalizedEvent);
          successCount++;

          // Update progress
          setProgress(Math.round(((i + 1) / totalCount) * 100));
        } catch (eventError) {
          console.warn(`Error processing event ${i + 1}:`, eventError);
        }
      }

      if (successCount === 0) {
        throw new Error('No valid events found in JSON file');
      }

      setSuccess({
        count: successCount,
        total: totalCount,
        message: `Imported ${successCount} of ${totalCount} events successfully`,
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      throw new Error(`JSON error: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">File Upload</h2>
      <p className="text-gray-400 mb-6">
        Upload CSV or JSON files to import multiple events at once
      </p>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900 border border-green-700 rounded p-4 text-green-200 mb-4">
          ✓ {success.message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded p-4 text-red-200 mb-4">
          ✕ {error}
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Choose a CSV or JSON file
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          disabled={loading}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: CSV (with headers), JSON (array or single object)
        </p>
      </div>

      {/* Progress Bar */}
      {loading && progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Importing...</span>
            <span className="text-sm font-medium text-blue-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Example CSV Format */}
      <div className="bg-gray-700 rounded p-4 text-xs text-gray-300 mb-4">
        <p className="font-semibold mb-2">CSV Example:</p>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words">
{`source_ip,dest_ip,event_type,severity,message
192.168.1.100,,failed_login,high,Failed login from suspicious IP
10.0.0.5,10.0.1.20,port_scan,high,Port scan detected
203.0.113.10,,privilege_escalation,critical,Unauthorized sudo access`}
        </pre>
      </div>

      {/* Example JSON Format */}
      <div className="bg-gray-700 rounded p-4 text-xs text-gray-300">
        <p className="font-semibold mb-2">JSON Example:</p>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words">
{`[
  {
    "source_ip": "192.168.1.100",
    "event_type": "failed_login",
    "severity": "high",
    "message": "Failed login attempt"
  },
  {
    "source_ip": "10.0.0.5",
    "dest_ip": "10.0.1.20",
    "event_type": "port_scan",
    "severity": "high",
    "message": "Port scan detected"
  }
]`}
        </pre>
      </div>
    </div>
  );
}
