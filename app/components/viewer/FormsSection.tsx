import { useState } from 'react';
import { Form } from '@/app/types/report';

interface FormsSectionProps {
  forms: Form[];
}

export default function FormsSection({ forms }: FormsSectionProps) {
  const [formLimits, setFormLimits] = useState<{ [key: number]: number }>(
    Object.fromEntries((forms || []).map((_, i) => [i, 5]))
  );

  if (!forms?.length) return null;

  const handleShowMore = (formIndex: number) => {
    setFormLimits(prev => ({
      ...prev,
      [formIndex]: prev[formIndex] + 5
    }));
  };

  const handleShowLess = (formIndex: number) => {
    setFormLimits(prev => ({
      ...prev,
      [formIndex]: 5
    }));
  };

  return (
    <div className="standard-section">
      <h2 className="section-header">Forms ({forms.length})</h2>
      <div className="standard-grid">
        {forms.map((form, i) => (
          <div key={i} className="standard-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="standard-text-secondary">Action:</span>
                <span className="standard-text ml-2">{form.action || 'Not specified'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                form.method === 'POST' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {form.method || 'GET'}
              </span>
            </div>
            {Array.isArray(form.inputs) && form.inputs.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Form Fields ({form.inputs.length})
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {form.inputs.slice(0, formLimits[i]).map((input, j) => (
                    <div key={j} className="flex items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${input.required ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                            {input.required ? 'Required' : 'Optional'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {input.name || input.id || 'Unnamed field'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Type: {input.type || 'text'}
                          </span>
                        </div>
                      </div>
                      {input.value && (
                        <div className="text-sm text-gray-600">
                          Default: {input.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {form.inputs.length > 5 && (
                  <div className="flex justify-between mt-4">
                    {formLimits[i] < form.inputs.length && (
                      <button
                        onClick={() => handleShowMore(i)}
                        className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                      >
                        <span>Show More</span>
                      </button>
                    )}
                    {formLimits[i] > 5 && (
                      <button
                        onClick={() => handleShowLess(i)}
                        className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                      >
                        <span>Show Less</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
