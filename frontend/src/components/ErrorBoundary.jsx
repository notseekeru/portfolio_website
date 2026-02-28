import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-zinc-500 mb-6">An unexpected error occurred.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
              className="px-6 py-2 bg-accent text-[#0d0d0d] font-semibold text-sm rounded-xl hover:bg-accent/90 transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
