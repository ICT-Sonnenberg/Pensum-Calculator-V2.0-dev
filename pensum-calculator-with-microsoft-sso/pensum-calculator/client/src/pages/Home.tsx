import { getMicrosoftLoginUrl, APP_TITLE } from '../const';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="mt-2 text-gray-600">
            Willkommen zum Pensum Calculator
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href={getMicrosoftLoginUrl()}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
            </svg>
            Mit Microsoft anmelden
          </a>
          
          <p className="text-xs text-center text-gray-500">
            Microsoft SSO Integration - Test Setup
          </p>
        </div>
      </div>
    </div>
  );
}
