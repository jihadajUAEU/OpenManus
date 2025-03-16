import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { LLMSettings } from '../../types';
import { updateSettings, saveSettings, setMessage } from '../../store/llmSlice';

const LLMConfiguration: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings: currentSettings, status, message } = useAppSelector((state) => state.llm);
  const [settings, setSettings] = useState<LLMSettings>(currentSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'max_tokens' || name === 'temperature') {
      parsedValue = parseFloat(value);
    }

    setSettings(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateSettings(settings));
    await dispatch(saveSettings(settings));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(setMessage(''));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">LLM Configuration</h2>
      {message && (
        <div className={`mb-4 p-4 rounded ${status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            type="text"
            name="model"
            value={settings.model}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Base URL</label>
          <input
            type="text"
            name="base_url"
            value={settings.base_url}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            name="api_key"
            value={settings.api_key}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Tokens</label>
          <input
            type="number"
            name="max_tokens"
            value={settings.max_tokens}
            onChange={handleChange}
            className="input-field"
            min="1"
            max="32000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Temperature</label>
          <input
            type="number"
            name="temperature"
            value={settings.temperature}
            onChange={handleChange}
            className="input-field"
            min="0"
            max="2"
            step="0.1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Type</label>
          <select
            name="api_type"
            value={settings.api_type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Default</option>
            <option value="azure">Azure</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>

        {settings.api_type === 'azure' && (
          <div>
            <label className="block text-sm font-medium mb-1">API Version</label>
            <input
              type="text"
              name="api_version"
              value={settings.api_version}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 2024-03-01-preview"
            />
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full relative"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};

export default LLMConfiguration;
