import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PromptEditor from './components/PromptEditor';
import OptimizedPromptViewer from './components/OptimizedPromptViewer';
import AdsBanner from './components/AdsBanner';
import apiService from './services/api.service';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handler para otimizar prompt
   */
  const handleOptimize = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const optimizedResult = await apiService.optimizePrompt(prompt);
      setResult(optimizedResult);
    } catch (err) {
      setError(err.message || 'Erro ao otimizar prompt');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            ✨ GenAI Eng Prompt
          </h1>
          <p className="text-white/80 text-base md:text-lg">
            Otimize seus prompts com as melhores práticas de engenharia de prompt
          </p>
        </header>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-600 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Erro</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PromptEditor onOptimize={handleOptimize} loading={loading} />
          <OptimizedPromptViewer result={result} />
        </div>

        {/* Sistema de Propagandas */}
        <AdsBanner />
      </div>
    </div>
  );
}

export default App;
