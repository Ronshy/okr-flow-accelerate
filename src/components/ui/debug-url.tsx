import React from 'react';

const DebugURL: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const type = urlParams.get('type');

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded z-50 max-w-md">
      <h3 className="font-bold mb-2">Debug URL Parameters:</h3>
      <div className="text-xs space-y-1">
        <div><strong>Type:</strong> {type || 'Not found'}</div>
        <div><strong>Access Token:</strong> {accessToken ? 'Present' : 'Not found'}</div>
        <div><strong>Refresh Token:</strong> {refreshToken ? 'Present' : 'Not found'}</div>
        <div><strong>Full URL:</strong> {window.location.href}</div>
      </div>
    </div>
  );
};

export default DebugURL; 