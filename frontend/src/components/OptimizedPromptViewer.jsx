import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Visualizador de Prompt Otimizado
 */
function OptimizedPromptViewer({ result }) {
  const [copied, setCopied] = useState(false);

  /**
   * Copia o prompt otimizado para a área de transferência
   */
  const handleCopy = async () => {
    if (!result?.optimizedPrompt) return;

    try {
      await navigator.clipboard.writeText(result.optimizedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar para área de transferência');
    }
  };

  return (
    <div className="frame-medium">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">Prompt Otimizado</h2>
        {result?.tokens && (
          <div className="flex gap-2 text-sm">
            <span className="bg-primary-800 px-3 py-1 rounded-full border border-brown-400 text-white">
              📊 {result.tokens.output} tokens
            </span>
          </div>
        )}
      </div>

      {/* Área de exibição do prompt */}
      <div className="bg-primary-700/50 rounded-lg p-4 min-h-[250px] mb-4 border border-brown-400/50">
        {result?.optimizedPrompt ? (
          <div className="whitespace-pre-wrap text-white leading-relaxed">
            {result.optimizedPrompt}
          </div>
        ) : (
          <p className="text-white/60 italic">
            O prompt otimizado aparecerá aqui após você clicar em "Otimizar Prompt"...
          </p>
        )}
      </div>

      {/* Informações adicionais */}
      {result && (
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-primary-800/50 rounded px-3 py-2 border border-brown-400/30">
            <span className="text-white/70">Provedor:</span>
            <span className="ml-2 text-white font-semibold">{result.provider || 'N/A'}</span>
          </div>
          <div className="bg-primary-800/50 rounded px-3 py-2 border border-brown-400/30">
            <span className="text-white/70">Modelo:</span>
            <span className="ml-2 text-white font-semibold">{result.model || 'N/A'}</span>
          </div>
          <div className="bg-primary-800/50 rounded px-3 py-2 border border-brown-400/30">
            <span className="text-white/70">Tokens Input:</span>
            <span className="ml-2 text-white font-semibold">{result.tokens?.input || 0}</span>
          </div>
          <div className="bg-primary-800/50 rounded px-3 py-2 border border-brown-400/30">
            <span className="text-white/70">Total:</span>
            <span className="ml-2 text-white font-semibold">{result.tokens?.total || 0}</span>
          </div>
        </div>
      )}

      {/* Botão Copiar */}
      <button
        className="btn-secondary w-full"
        disabled={!result?.optimizedPrompt}
        onClick={handleCopy}
      >
        {copied ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            Copiado!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Copy className="w-5 h-5" />
            Copiar Prompt
          </span>
        )}
      </button>
    </div>
  );
}

export default OptimizedPromptViewer;
