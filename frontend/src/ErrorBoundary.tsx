import React from 'react';

export class ErrorBoundary extends React.Component<any, { hasError: boolean, error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-500 bg-black min-h-screen">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <pre className="mt-4 bg-gray-900 p-4 rounded">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
