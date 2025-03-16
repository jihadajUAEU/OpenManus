// LLM Types
export interface LLMSettings {
  model: string;
  base_url: string;
  api_key: string;
  max_tokens: number;
  temperature: number;
  api_type?: 'azure' | 'ollama';
  api_version?: string;
  max_input_tokens?: number;
}

// Agent Types
export type AgentType = 'planning' | 'react' | 'swe' | 'manus';

export interface AgentConfig {
  name: string;
  type: AgentType;
  tools: ToolDefinition[];
  llm_config?: LLMSettings;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required: string[];
  };
}

// Flow Types
export enum FlowType {
  PLANNING = 'planning'
}

export enum PlanStepStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export interface FlowStep {
  id: string;
  status: PlanStepStatus;
  description: string;
  agent: string;
  dependencies?: string[];
}

export interface Flow {
  type: FlowType;
  agents: Record<string, AgentConfig>;
  steps: FlowStep[];
  primary_agent: string;
}

// Message Types
export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ToolCallResult {
  tool_call_id: string;
  name: string;
  content: string;
}

// Error Types
export interface AppError {
  message: string;
  type: 'token_limit' | 'api_error' | 'validation_error' | 'internal_error';
  details?: Record<string, unknown>;
}

// Component Props Types
export interface LLMConfigurationProps {
  onSave: (config: LLMSettings) => void;
  initialConfig?: LLMSettings;
}

export interface TerminalInterfaceProps {
  onCommand: (command: string) => Promise<void>;
  streamingOutput?: string;
  commandHistory?: string[];
  isProcessing?: boolean;
}

export interface FlowManagementProps {
  agents: Record<string, AgentConfig>;
  currentFlow?: FlowType;
  steps?: FlowStep[];
  onStepUpdate: (stepId: string, status: PlanStepStatus) => void;
}

export interface AgentConfigurationProps {
  onSave: (config: AgentConfig) => void;
  initialConfig?: AgentConfig;
  availableTools: ToolDefinition[];
  agentType: AgentType;
}

export interface ResultViewerProps {
  messages: Message[];
  toolCalls?: ToolCallResult[];
  errors?: AppError[];
  onRetry?: (messageId: string) => void;
}
