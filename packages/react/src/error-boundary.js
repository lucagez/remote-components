import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panic: false,
      error: null,
    };
    this.onError = this.props.onError || (() => void 0);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({
      panic: false,
      error: null,
    });
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

  render() {
    return this.state.panic
      ? this.props.fallback({
        reset: this.reset,
        error: this.state.error,
      })
      : this.props.children;
  }
}

export { ErrorBoundary };
