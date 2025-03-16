import { API_BASE_URL } from '../main';
import { LLMSettings, AgentConfig, FlowStep, Message } from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // LLM Settings
  async updateLLMSettings(settings: LLMSettings): Promise<ApiResponse<LLMSettings>> {
    return this.request<LLMSettings>('/api/llm/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getLLMSettings(): Promise<ApiResponse<LLMSettings>> {
    return this.request<LLMSettings>('/api/llm/settings');
  }

  // Agent Management
  async createAgent(config: AgentConfig): Promise<ApiResponse<AgentConfig>> {
    return this.request<AgentConfig>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async getAgents(): Promise<ApiResponse<AgentConfig[]>> {
    return this.request<AgentConfig[]>('/api/agents');
  }

  async getAgent(agentId: string): Promise<ApiResponse<AgentConfig>> {
    return this.request<AgentConfig>(`/api/agents/${agentId}`);
  }

  async updateAgent(
    agentId: string,
    config: Partial<AgentConfig>
  ): Promise<ApiResponse<AgentConfig>> {
    return this.request<AgentConfig>(`/api/agents/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(config),
    });
  }

  // Flow Management
  async createFlow(steps: FlowStep[]): Promise<ApiResponse<{ flowId: string }>> {
    return this.request<{ flowId: string }>('/api/flow', {
      method: 'POST',
      body: JSON.stringify({ steps }),
    });
  }

  async updateFlowStep(
    flowId: string,
    stepId: string,
    update: Partial<FlowStep>
  ): Promise<ApiResponse<FlowStep>> {
    return this.request<FlowStep>(`/api/flow/${flowId}/steps/${stepId}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
  }

  async getFlowStatus(
    flowId: string
  ): Promise<ApiResponse<{ steps: FlowStep[]; activeStep?: string }>> {
    return this.request<{ steps: FlowStep[]; activeStep?: string }>(
      `/api/flow/${flowId}/status`
    );
  }

  // Terminal Interface
  async executeCommand(
    command: string,
    agentId?: string
  ): Promise<ApiResponse<Message>> {
    return this.request<Message>('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ command: command }),
    });
  }

  // Streaming support for terminal output
  streamOutput(
    flowId: string,
    onMessage: (message: string) => void,
    onError: (error: Error) => void
  ): () => void {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/stream/${flowId}`
    );

    eventSource.onmessage = (event) => {
      onMessage(event.data);
    };

    eventSource.onerror = (error) => {
      onError(error instanceof Error ? error : new Error('Stream error'));
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }
}

// Create and export a singleton instance
export const api = new ApiService();
