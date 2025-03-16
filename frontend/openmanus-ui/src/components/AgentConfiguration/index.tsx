import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createAgent, setMessage } from '../../store/agentSlice';
import { AgentConfig, ToolDefinition } from '../../types';

interface ToolSelectorProps {
  availableTools: ToolDefinition[];
  selectedTools: ToolDefinition[];
  onToolsChange: (tools: ToolDefinition[]) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  availableTools,
  selectedTools,
  onToolsChange,
}) => {
  const handleToolToggle = (tool: ToolDefinition) => {
    const isSelected = selectedTools.some(t => t.name === tool.name);
    if (isSelected) {
      onToolsChange(selectedTools.filter(t => t.name !== tool.name));
    } else {
      onToolsChange([...selectedTools, tool]);
    }
  };

  return (
    <div className="space-y-2">
      {availableTools.map(tool => (
        <label key={tool.name} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedTools.some(t => t.name === tool.name)}
            onChange={() => handleToolToggle(tool)}
            className="rounded text-blue-500"
          />
          <span>{tool.name}</span>
          <span className="text-gray-500 text-sm">{tool.description}</span>
        </label>
      ))}
    </div>
  );
};

const AgentConfiguration: React.FC = () => {
  const dispatch = useAppDispatch();
  const availableTools = useAppSelector(state => state.agent.availableTools);
  const llmSettings = useAppSelector(state => state.llm.settings);
  const { status, message } = useAppSelector(state => state.agent);

  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    type: 'manus',
    tools: [],
    llm_config: llmSettings,
  });

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      llm_config: llmSettings,
    }));
  }, [llmSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.name) {
      const result = await dispatch(createAgent(config));
      if (createAgent.fulfilled.match(result)) {
        setConfig({
          name: '',
          type: 'manus',
          tools: [],
          llm_config: llmSettings,
        });
        setTimeout(() => {
          dispatch(setMessage(''));
        }, 3000);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Agent Configuration</h2>
      {message && (
        <div className={`mb-4 p-4 rounded ${status === 'succeeded' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Agent Name</label>
          <input
            type="text"
            name="name"
            value={config.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Agent Type</label>
          <select
            name="type"
            value={config.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="manus">Manus</option>
            <option value="planning">Planning</option>
            <option value="react">React</option>
            <option value="swe">SWE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tools</label>
          <ToolSelector
            availableTools={availableTools}
            selectedTools={config.tools}
            onToolsChange={tools => setConfig(prev => ({ ...prev, tools }))}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">LLM Configuration</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p>Model: {llmSettings.model}</p>
            <p>Temperature: {llmSettings.temperature}</p>
            <p>Max Tokens: {llmSettings.max_tokens}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            LLM settings are inherited from global configuration
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary w-full relative"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Creating Agent...' : 'Create Agent'}
        </button>
      </form>
    </div>
  );
};

export default AgentConfiguration;
