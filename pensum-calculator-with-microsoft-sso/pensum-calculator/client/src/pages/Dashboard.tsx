import { trpc } from '../lib/trpc';

export default function Dashboard() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const { data: stats } = trpc.statistics.get.useQuery();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name} ({user.loginMethod})
              </span>
              <button
                onClick={() => {
                  trpc.auth.logout.mutate();
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Clients</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats?.totalClients || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Auth Method</h3>
            <p className="text-xl font-semibold text-green-600 mt-2">
              {user.loginMethod === 'microsoft' ? 'Microsoft SSO' : 'Manus OAuth'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Role</h3>
            <p className="text-xl font-semibold text-purple-600 mt-2">
              {user.role}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Microsoft SSO Integration - Erfolgreich!
          </h2>
          <p className="text-gray-600">
            Sie sind mit Microsoft OAuth angemeldet. Das Projekt unterstützt jetzt:
          </p>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>✅ Microsoft OAuth SSO</li>
            <li>✅ Manus OAuth (parallel)</li>
            <li>✅ Multi-Provider Authentication</li>
            <li>✅ Session Management</li>
            <li>✅ tRPC API Integration</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
