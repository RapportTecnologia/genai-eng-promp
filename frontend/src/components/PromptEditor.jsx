import { useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import apiService from '../services/api.service';

/**
 * Editor de Prompt com sugestões em tempo real
 */
function PromptEditor({ onOptimize, loading }) {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const textareaRef = useRef(null);
  const debounceTimerRef = useRef(null);

  /**
   * Busca sugestões com debounce
   */
  const fetchSuggestions = useCallback(async (text, cursorPos) => {
    if (text.length < 10) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const suggestions = await apiService.getSuggestions(text, cursorPos);
      if (suggestions.length > 0) {
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  /**
   * Handler de mudança no textarea
   */
  const handleChange = (e) => {
    const newValue = e.target.value;
    setPrompt(newValue);

    // Debounce para sugestões
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const cursorPos = e.target.selectionStart;
      fetchSuggestions(newValue, cursorPos);
    }, 500);
  };

  /**
   * Aplica uma sugestão
   */
  const applySuggestion = (suggestion) => {
    const cursorPos = textareaRef.current.selectionStart;
    const before = prompt.substring(0, cursorPos);
    const after = prompt.substring(cursorPos);
    const newPrompt = before + ' ' + suggestion + after;
    
    setPrompt(newPrompt);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Foca no textarea
    setTimeout(() => {
      textareaRef.current.focus();
    }, 0);
  };

  /**
   * Handler do botão otimizar
   */
  const handleOptimize = () => {
    if (prompt.trim().length >= 10) {
      onOptimize(prompt);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="frame-light relative">
      <h2 className="text-2xl font-semibold mb-4 text-white">Seu Prompt</h2>
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="textarea-field"
          placeholder="Digite seu prompt aqui... (mínimo 10 caracteres)"
          value={prompt}
          onChange={handleChange}
          rows={10}
          disabled={loading}
        />
        
        {/* Indicador de carregamento de sugestões */}
        {loadingSuggestions && (
          <div className="absolute top-2 right-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/60" />
          </div>
        )}
      </div>

      {/* Sugestões */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-2 bg-primary-800 border border-brown-400 rounded-lg p-3">
          <p className="text-xs text-white/80 mb-2 font-semibold">💡 Sugestões:</p>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="block w-full text-left text-sm px-3 py-2 rounded bg-primary-700/50 hover:bg-primary-600 transition-colors border border-brown-400/30 text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contador de caracteres */}
      <div className="mt-2 text-xs text-white/60">
        {prompt.length} caracteres
        {prompt.length < 10 && prompt.length > 0 && (
          <span className="ml-2 text-primary-300">
            (mínimo 10 caracteres para otimizar)
          </span>
        )}
      </div>

      {/* Botão Otimizar */}
      <button
        className="btn-primary mt-4 w-full"
        onClick={handleOptimize}
        disabled={loading || prompt.trim().length < 10}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Otimizando...
          </span>
        ) : (
          '✨ Otimizar Prompt'
        )}
      </button>
    </div>
  );
}

export default PromptEditor;
