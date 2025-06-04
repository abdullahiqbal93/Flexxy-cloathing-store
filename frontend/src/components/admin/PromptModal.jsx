import React from 'react';

const PromptModal = ({ isOpen, onClose, onSubmit, defaultPrompt, loading }) => {
  const [prompt, setPrompt] = React.useState(defaultPrompt || '');

  React.useEffect(() => {
    if (isOpen && defaultPrompt) {
      setPrompt(defaultPrompt);
    }
  }, [isOpen, defaultPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h2 className="text-xl font-semibold mb-2">Customize AI Description Prompt</h2>
        <p className="text-gray-600 text-sm mb-4">
          This prompt will be used to generate the product description. You can modify it to better suit your needs.
          Variables like product name, category, and brand will be automatically inserted.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            rows="6"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your custom prompt..."
          />
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => setPrompt(defaultPrompt)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Default
            </button>
            <div className="text-xs text-gray-500">
              Tip: Use {"{name}"}, {"{category}"}, and {"{brand}"} as placeholders
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
