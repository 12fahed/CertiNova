'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ErrorFallback } from '@/components/error-fallback';

type ErrorReporter = (error: Error | string | unknown) => void;

interface ErrorContextType {
  error: Error | null;
  hasError: boolean;
  reportError: ErrorReporter;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);

  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }

  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

function normalizeError(error: Error | string | unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === 'string' && message.length > 0) {
      return new Error(message);
    }
  }

  return new Error('An unexpected error occurred');
}

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    onError: (error: Error) => void;
    onReset: () => void;
  },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  handleReset = () => {
    this.setState({ error: null });
    this.props.onReset();
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reportError = useCallback<ErrorReporter>((nextError) => {
    setError(normalizeError(nextError));
  }, []);

  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      reportError(event.error ?? event.message);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(event.reason);
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [reportError]);

  const value = useMemo<ErrorContextType>(
    () => ({
      error,
      hasError: error !== null,
      reportError,
      clearError,
    }),
    [clearError, error, reportError]
  );

  if (error) {
    return <ErrorFallback onRetry={clearError} />;
  }

  return (
    <ErrorContext.Provider value={value}>
      <ErrorBoundary onError={reportError} onReset={clearError}>
        {children}
      </ErrorBoundary>
    </ErrorContext.Provider>
  );
};
