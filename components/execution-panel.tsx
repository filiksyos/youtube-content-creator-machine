'use client';

import { Copy, Download } from 'lucide-react';

interface ExecutionPanelProps {
  results: any;
  isExecuting: boolean;
}

export default function ExecutionPanel({ results, isExecuting }: ExecutionPanelProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    // Check if it's a valid HTTP/HTTPS URL or data URL
    try {
      if (url.startsWith('data:image/')) {
        return true; // Base64 data URL
      }
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Execution Results</h2>
      
      {isExecuting && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating content...</p>
        </div>
      )}

      {!isExecuting && !results && (
        <div className="text-center py-8 text-gray-500">
          <p>No results yet.</p>
          <p className="text-sm mt-2">Add nodes and execute the workflow to see results here.</p>
        </div>
      )}

      {!isExecuting && results && (
        <div className="space-y-4">
          {Object.entries(results).map(([nodeId, result]: [string, any]) => (
            <div key={nodeId} className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2 capitalize">{result.type}</h3>
              
              {result.type === 'script' && (
                <div>
                  <div className="bg-gray-50 p-3 rounded text-sm mb-2 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">{result.data}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.data)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Script
                  </button>
                </div>
              )}

              {result.type === 'thumbnail' && (
                <div>
                  {result.error ? (
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
                      <p className="font-semibold mb-1">Thumbnail Generation Failed</p>
                      <p className="text-xs mb-2">{result.data}</p>
                      {result.suggestion && (
                        <p className="text-xs mt-2 italic text-red-700">{result.suggestion}</p>
                      )}
                    </div>
                  ) : result.data && isValidImageUrl(result.data) ? (
                    <>
                      <img
                        src={result.data}
                        alt="Generated thumbnail"
                        className="w-full rounded mb-2"
                        onError={(e) => {
                          console.error('Failed to load thumbnail image:', result.data);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <a
                        href={result.data}
                        download="thumbnail.png"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Invalid Image URL</p>
                      <p className="text-xs mb-2">The API returned an invalid response:</p>
                      <pre className="bg-yellow-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {typeof result.data === 'string' 
                          ? result.data.substring(0, 200) + (result.data.length > 200 ? '...' : '')
                          : JSON.stringify(result.data, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
