import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { AppThunk } from './index';

interface TerminalState {
  output: string;
  commandHistory: string[];
  isProcessing: boolean;
  error: string | null;
}

const initialState: TerminalState = {
  output: '',
  commandHistory: [],
  isProcessing: false,
  error: null,
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    appendOutput: (state, action: PayloadAction<string>) => {
      state.output += action.payload;
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      state.commandHistory.push(action.payload);
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearTerminal: (state) => {
      state.output = '';
    },
  },
});

export const {
  setOutput,
  appendOutput,
  addToHistory,
  setProcessing,
  setError,
  clearTerminal,
} = terminalSlice.actions;

// Thunk for executing commands
export const executeCommand = (command: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setProcessing(true));
    dispatch(addToHistory(command));
    dispatch(appendOutput(`\n> ${command}\n`));

    const response = await api.executeCommand(command);

    if (response.error) {
      dispatch(setError(response.error));
      dispatch(appendOutput(`Error: ${response.error}\n`));
    } else if (response.data) {
      dispatch(appendOutput(`${response.data.content}\n`));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    dispatch(setError(errorMessage));
    dispatch(appendOutput(`Error: ${errorMessage}\n`));
  } finally {
    dispatch(setProcessing(false));
  }
};

export default terminalSlice.reducer;
