import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    const { onError = (() => void 0) } = this.props;

    this.state = {
      panic: false,
      error: null,
    };
    this.onError = onError;
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return {
      panic: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    this.onError(error, info);
  }

  reset() {
    this.setState({
      panic: false,
      error: null,
    });
  }

  render() {
    const { panic, error } = this.state;
    const { fallback, children } = this.props;

    return panic
      ? fallback({
        reset: this.reset,
        error,
      })
      : children;
  }
}

export { ErrorBoundary };
