import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { LLMSettings } from '../types';

interface LLMState {
  settings: LLMSettings;
  isConfigured: boolean;
  error?: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  message?: string;
}

const initialState: LLMState = {
  settings: {
    model: 'gpt-4o',
    base_url: 'https://api.openai.com/v1',
    api_key: '',
    max_tokens: 4096,
    temperature: 0.0,
  },
  isConfigured: false,
  status: 'idle'
};

export const saveSettings = createAsyncThunk(
  'llm/saveSettings',
  async (settings: LLMSettings) => {
    const response = await api.updateLLMSettings(settings);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data;
  }
);

const llmSlice = createSlice({
  name: 'llm',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<LLMSettings>) => {
      state.settings = action.payload;
      state.isConfigured = true;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
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
      .addCase(saveSettings.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
        state.message = 'Saving configuration...';
      })
      .addCase(saveSettings.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.message = 'Configuration saved successfully!';
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.message = 'Failed to save configuration';
      });
  },
});

export const { updateSettings, setError, clearError, setMessage } = llmSlice.actions;
export default llmSlice.reducer;
