import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AgentConfig, ToolDefinition } from '../types';
import { api } from '../services/api';

interface AgentState {
  agents: Record<string, AgentConfig>;
  availableTools: ToolDefinition[];
  selectedAgent?: string;
  error?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message?: string;
}

const initialState: AgentState = {
  agents: {},
  availableTools: [],
  status: 'idle'
};

export const createAgent = createAsyncThunk(
  'agent/createAgent',
  async (config: AgentConfig) => {
    const response = await api.createAgent(config);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    addAgent: (state, action: PayloadAction<AgentConfig>) => {
      state.agents[action.payload.name] = action.payload;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    updateAgent: (state, action: PayloadAction<{ name: string; config: Partial<AgentConfig> }>) => {
      const { name, config } = action.payload;
      if (state.agents[name]) {
        state.agents[name] = { ...state.agents[name], ...config };
      }
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      delete state.agents[action.payload];
      if (state.selectedAgent === action.payload) {
        state.selectedAgent = undefined;
      }
    },
    setAvailableTools: (state, action: PayloadAction<ToolDefinition[]>) => {
      state.availableTools = action.payload;
    },
    selectAgent: (state, action: PayloadAction<string>) => {
      state.selectedAgent = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAgent.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
        state.message = 'Creating agent...';
      })
      .addCase(createAgent.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.message = 'Agent created successfully!';
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.message = 'Failed to create agent';
      });
  },
});

export const {
  addAgent,
  updateAgent,
  removeAgent,
  setAvailableTools,
  selectAgent,
  setError,
  clearError,
  setMessage,
} = agentSlice.actions;

export default agentSlice.reducer;
