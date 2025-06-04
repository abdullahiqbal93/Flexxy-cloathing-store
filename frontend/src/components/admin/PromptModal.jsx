import React from 'react';

const PromptModal = ({ isOpen, onClose, onSubmit, defaultPrompt, loading }) => {
  const [prompt, setPrompt] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setPrompt(defaultPrompt);
    }
  }, [isOpen, defaultPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h2 className="text-xl font-semibold mb-4">Customize AI Description Prompt</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            rows="6"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your custom prompt..."
          />
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
