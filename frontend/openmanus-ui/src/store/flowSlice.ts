import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flow, FlowStep, PlanStepStatus } from '../types';

interface FlowState {
  currentFlow?: Flow;
  steps: FlowStep[];
  activeStepId?: string;
  error?: string;
  isExecuting: boolean;
}

const initialState: FlowState = {
  steps: [],
  isExecuting: false,
};

const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    initializeFlow: (state, action: PayloadAction<Flow>) => {
      state.currentFlow = action.payload;
      state.steps = action.payload.steps;
      state.isExecuting = false;
    },
    updateStepStatus: (state, action: PayloadAction<{ stepId: string; status: PlanStepStatus }>) => {
      const { stepId, status } = action.payload;
      const stepIndex = state.steps.findIndex(step => step.id === stepId);
      if (stepIndex !== -1) {
        state.steps[stepIndex].status = status;
      }
    },
    setActiveStep: (state, action: PayloadAction<string>) => {
      state.activeStepId = action.payload;
    },
    addStep: (state, action: PayloadAction<FlowStep>) => {
      state.steps.push(action.payload);
    },
    removeStep: (state, action: PayloadAction<string>) => {
      state.steps = state.steps.filter(step => step.id !== action.payload);
      if (state.activeStepId === action.payload) {
        state.activeStepId = undefined;
      }
    },
    updateStepDependencies: (state, action: PayloadAction<{ stepId: string; dependencies: string[] }>) => {
      const { stepId, dependencies } = action.payload;
      const stepIndex = state.steps.findIndex(step => step.id === stepId);
      if (stepIndex !== -1) {
        state.steps[stepIndex].dependencies = dependencies;
      }
    },
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isExecuting = false;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    resetFlow: (state) => {
      state.currentFlow = undefined;
      state.steps = [];
      state.activeStepId = undefined;
      state.error = undefined;
      state.isExecuting = false;
    },
  },
});

export const {
  initializeFlow,
  updateStepStatus,
  setActiveStep,
  addStep,
  removeStep,
  updateStepDependencies,
  setExecuting,
  setError,
  clearError,
  resetFlow,
} = flowSlice.actions;

export default flowSlice.reducer;
