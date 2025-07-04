
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, X, Target } from 'lucide-react';

interface CreateOKRModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: 'individual' | 'team' | 'company';
}

const CreateOKRModal = ({ isOpen, onClose, level }: CreateOKRModalProps) => {
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState([
    { title: '', target: '', type: 'metric' }
  ]);
  const [okrType, setOkrType] = useState<'committed' | 'aspirational'>('committed');
  const [deadline, setDeadline] = useState('');
  const [owner, setOwner] = useState('');

  const addKeyResult = () => {
    setKeyResults([...keyResults, { title: '', target: '', type: 'metric' }]);
  };

  const removeKeyResult = (index: number) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter((_, i) => i !== index));
    }
  };

  const updateKeyResult = (index: number, field: string, value: string) => {
    const updated = keyResults.map((kr, i) => 
      i === index ? { ...kr, [field]: value } : kr
    );
    setKeyResults(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OKR creation logic here
    console.log('Creating OKR:', { objective, keyResults, okrType, deadline, owner, level });
    onClose();
  };

  const getLevelTitle = () => {
    switch (level) {
      case 'individual': return 'Personal OKR';
      case 'team': return 'Team OKR';
      case 'company': return 'Company OKR';
      default: return 'OKR';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Create New {getLevelTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objective *
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What do you want to achieve? Be specific and inspiring..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OKR Type
              </label>
              <select
                value={okrType}
                onChange={(e) => setOkrType(e.target.value as 'committed' | 'aspirational')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="committed">Committed</option>
                <option value="aspirational">Aspirational</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {level !== 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner/Responsible Person *
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Who will be responsible for this OKR?"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Key Results * (2-5 recommended)
              </label>
              <Button
                type="button"
                onClick={addKeyResult}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Key Result</span>
              </Button>
            </div>

            <div className="space-y-4">
              {keyResults.map((kr, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Key Result {index + 1}
                    </span>
                    {keyResults.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyResult(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={kr.title}
                        onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                        placeholder="How will you measure success?"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(index, 'target', e.target.value)}
                        placeholder="Target (e.g., 100, 50%)"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <select
                      value={kr.type}
                      onChange={(e) => updateKeyResult(index, 'type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="metric">Metric-based</option>
                      <option value="milestone">Milestone</option>
                      <option value="task">Task-based</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create OKR
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOKRModal;
