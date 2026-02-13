import { useState, useEffect } from 'react';

export default function GeminiTest() {
    const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'found' | 'missing'>('checking');
    const [apiResponse, setApiResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (apiKey && apiKey.length > 10) {
            setApiKeyStatus('found');
            addLog(`✅ API Key Found: ${apiKey.substring(0, 5)}... (Length: ${apiKey.length})`);
        } else {
            setApiKeyStatus('missing');
            addLog('❌ API Key Missing or Invalid in Environment Variables');
        }
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const testConnection = async () => {
        if (!apiKey) {
            addLog('Cannot test: API Key is missing.');
            return;
        }

        setLoading(true);
        addLog('🚀 Starting API Test...');
        addLog('Attempting to connect to: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent');

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hello! Reply with 'OK'." }] }]
                    })
                }
            );

            addLog(`Response Status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = JSON.stringify(errorData, null, 2);
                addLog(`❌ API ERROR:\n${errorMsg}`);
                setApiResponse(`Error: ${response.status} ${response.statusText}`);
            } else {
                const data = await response.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No text received";
                addLog(`✅ SUCCESS! AI Replied: "${reply}"`);
                setApiResponse(reply);
            }
        } catch (error: any) {
            addLog(`❌ NETWORK ERROR: ${error.message}`);
            setApiResponse(`Network Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const listModels = async () => {
        if (!apiKey) return;
        setLoading(true);
        addLog('🔍 Listing Available Models...');
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
            );
            const data = await response.json();
            if (data.models) {
                addLog(`✅ FOUND MODELS:\n${data.models.map((m: any) => m.name).join('\n')}`);
                setApiResponse(JSON.stringify(data.models, null, 2));
            } else {
                addLog(`❌ ERROR Listing Models:\n${JSON.stringify(data, null, 2)}`);
            }
        } catch (e: any) {
            addLog(`❌ NETWORK ERROR: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto font-sans">
            <h1 className="text-2xl font-bold mb-4">Gemini API Diagnostic</h1>

            <div className={`p-4 rounded-md mb-4 ${apiKeyStatus === 'found' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'} border`}>
                <h2 className="font-semibold text-lg mb-2">Environment Check</h2>
                <p>
                    Status: <strong>{apiKeyStatus === 'found' ? 'API Key Present' : 'API Key Missing'}</strong>
                </p>
                {apiKeyStatus === 'found' && <p className="text-sm mt-1">Key starts with: <code>{apiKey?.substring(0, 5)}...</code></p>}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={testConnection}
                    disabled={loading || apiKeyStatus === 'missing'}
                    className={`px-4 py-2 rounded text-white font-medium ${loading || apiKeyStatus === 'missing' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Testing...' : 'Test Connection Now'}
                </button>

                <button
                    onClick={listModels}
                    disabled={loading || apiKeyStatus === 'missing'}
                    className={`px-4 py-2 rounded text-white font-medium ${loading || apiKeyStatus === 'missing' ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                >
                    List Available Models
                </button>
            </div>

            {apiResponse && (
                <div className="mt-6 p-4 bg-gray-50 border rounded">
                    <h3 className="font-semibold mb-2">Result:</h3>
                    <pre className="whitespace-pre-wrap font-mono text-sm">{apiResponse}</pre>
                </div>
            )}

            <div className="mt-8">
                <h3 className="font-semibold mb-2 text-gray-700">Detailed Logs:</h3>
                <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
                    {logs.length === 0 ? 'Waiting for test to verify logs...' : logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-800 pb-1">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
