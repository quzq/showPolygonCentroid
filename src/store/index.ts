import { combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';

// それぞれ slice.reducer を default export している前提

const logger = createLogger({
  diff: true,
  collapsed: true,
});

const reducer = combineReducers({
});

export const store = configureStore({ reducer, middleware: [...getDefaultMiddleware(), logger] });

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
