import React, { useState } from 'react';
import { BarChart3, LockKeyhole, RefreshCw, Send, Users } from 'lucide-react';

const getBackendUrl = () => {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  return import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5001/api' : '/api');
};

export const OwnerReport = () => {
  const [token, setToken] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadReport = async (event) => {
    event?.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getBackendUrl()}/admin/message-report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to load the report.');
      setReport(data);
    } catch (requestError) {
      setReport(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const dailyRows = report
    ? Object.entries(report.daily).sort(([first], [second]) => second.localeCompare(first))
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream via-pink-50 to-pink-100/50 px-4 py-12 text-ink">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Owner dashboard</p>
          <h1 className="font-serif text-4xl font-bold text-burgundy">Message usage report</h1>
          <p className="mt-2 text-sm text-ink/70">
            Anonymous counts of completed message sends. Message text, names, phone numbers, and email addresses are never included.
          </p>
        </div>

        {!report && (
          <form onSubmit={loadReport} className="glass-card rounded-3xl border border-pink-200 p-6 shadow-card-pink">
            <label htmlFor="report-token" className="mb-2 block text-sm font-semibold text-burgundy">
              Owner report token
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="report-token"
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter ADMIN_REPORT_TOKEN"
                required
                className="min-w-0 flex-1 rounded-xl border border-pink-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              />
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60">
                <LockKeyhole className="h-4 w-4" />
                {loading ? 'Loading...' : 'View report'}
              </button>
            </div>
            {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          </form>
        )}

        {report && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="glass-card rounded-2xl border border-pink-200 p-5">
                <Send className="mb-3 h-5 w-5 text-pink-600" />
                <p className="text-3xl font-bold text-burgundy">{report.totalMessages}</p>
                <p className="text-sm text-ink/70">Messages sent</p>
              </div>
              <div className="glass-card rounded-2xl border border-pink-200 p-5">
                <Users className="mb-3 h-5 w-5 text-pink-600" />
                <p className="text-3xl font-bold text-burgundy">{report.uniqueVisitors}</p>
                <p className="text-sm text-ink/70">Unique browsers that sent a message</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl border border-pink-200 p-6 shadow-card-pink">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-2xl font-bold text-burgundy">Daily activity</h2>
                <button onClick={loadReport} disabled={loading} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-pink-700 hover:bg-pink-100 disabled:opacity-60">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              {dailyRows.length === 0 ? (
                <p className="text-sm text-ink/60">No messages have been recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[360px] text-left text-sm">
                    <thead className="border-b border-pink-200 text-xs uppercase tracking-wide text-pink-700">
                      <tr><th className="px-3 py-3">Date</th><th className="px-3 py-3">Messages</th></tr>
                    </thead>
                    <tbody>
                      {dailyRows.map(([day, count]) => (
                        <tr key={day} className="border-b border-pink-100 last:border-0">
                          <td className="px-3 py-3">{day}</td>
                          <td className="px-3 py-3 font-semibold">{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="mt-6 flex items-center gap-2 text-xs text-ink/60">
                <BarChart3 className="h-4 w-4 text-pink-600" />
                Channels: {Object.entries(report.byChannel).map(([channel, count]) => `${channel} ${count}`).join(' · ') || 'none'}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
