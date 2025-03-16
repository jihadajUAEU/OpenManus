import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { executeCommand } from '../../store/terminalSlice';

const TerminalInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const { output, commandHistory, isProcessing, error } = useAppSelector(
    (state) => state.terminal
  );
  const isConfigured = useAppSelector((state) => state.llm.isConfigured);

  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
      await dispatch(executeCommand(input));
      setInput('');
      setHistoryIndex(-1);
    } catch (error) {
      console.error('Command execution failed:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && historyIndex < commandHistory.length - 1) {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
    } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInput(
        newIndex >= 0
          ? commandHistory[commandHistory.length - 1 - newIndex]
          : ''
      );
    }
  };

  if (!isConfigured) {
    return (
      <div className="terminal p-4">
        <p className="text-yellow-400">
          Please configure LLM settings before using the terminal.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div
        ref={terminalRef}
        className="terminal h-96 overflow-y-auto mb-4 whitespace-pre-wrap"
      >
        {output}
        {isProcessing && (
          <div className="typing-indicator">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}
        {error && (
          <div className="text-red-500">
            Error: {error}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input-field font-mono bg-black text-green-400 flex-1"
          placeholder={isProcessing ? 'Processing...' : 'Enter your command...'}
          disabled={isProcessing}
          autoFocus
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isProcessing || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TerminalInterface;

// Add styles to index.css
const styles = `
.typing-indicator {
  display: inline-flex;
  gap: 0.3em;
  animation: blink 1s infinite;
}

.dot {
  animation: bounce 1s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  50% { opacity: 0.5; }
}

@keyframes bounce {
  50% { transform: translateY(-2px); }
}
`;

// Create a style element and append it to the document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
