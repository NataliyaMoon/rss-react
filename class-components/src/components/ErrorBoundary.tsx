
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  onReset?: () => void;
};

function ErrorFallback({
  error,
  resetErrorBoundary,
  onReset,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  onReset?: () => void;
}) {
  const handleReset = () => {
    onReset?.();
    resetErrorBoundary();
  };

  return (
    <div>
      <h2>Ooops! Something went wrong.</h2>
      <button onClick={handleReset}>Try Again</button>
    </div>
  );
}

function ErrorBoundary({ children, onReset }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback {...props} onReset={onReset} />
      )}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
