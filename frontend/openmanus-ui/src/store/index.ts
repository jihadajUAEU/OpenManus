import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import llmReducer from './llmSlice.ts';
import agentReducer from './agentSlice.ts';
import flowReducer from './flowSlice.ts';
import terminalReducer from './terminalSlice';

export const store = configureStore({
  reducer: {
    llm: llmReducer,
    agent: agentReducer,
    flow: flowReducer,
    terminal: terminalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Redux hooks with types
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
