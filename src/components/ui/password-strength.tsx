import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const requirements: Requirement[] = [
    {
      label: 'Minimal 6 karakter',
      test: (pwd) => pwd.length >= 6,
    },
    {
      label: 'Huruf besar (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      label: 'Huruf kecil (a-z)',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      label: 'Angka (0-9)',
      test: (pwd) => /\d/.test(pwd),
    },
  ];

  const getStrengthColor = () => {
    const passedRequirements = requirements.filter(req => req.test(password)).length;
    const totalRequirements = requirements.length;
    const percentage = (passedRequirements / totalRequirements) * 100;

    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    const passedRequirements = requirements.filter(req => req.test(password)).length;
    const totalRequirements = requirements.length;
    const percentage = (passedRequirements / totalRequirements) * 100;

    if (percentage === 100) return 'Kuat';
    if (percentage >= 75) return 'Sedang';
    if (percentage >= 50) return 'Lemah';
    return 'Sangat Lemah';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Kekuatan Password:</span>
          <span className={`font-medium ${
            getStrengthText() === 'Kuat' ? 'text-green-600' :
            getStrengthText() === 'Sedang' ? 'text-yellow-600' :
            getStrengthText() === 'Lemah' ? 'text-orange-600' : 'text-red-600'
          }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{
              width: `${(requirements.filter(req => req.test(password)).length / requirements.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <p className="text-xs text-gray-600 font-medium">Requirements:</p>
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              {isMet ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs ${
                isMet ? 'text-green-600' : 'text-red-600'
              }`}>
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength; 