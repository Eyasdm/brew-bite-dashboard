import { Component } from "react";
import { Translation } from "react-i18next";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ChartErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Translation>
        {(t) => (
          <div className="flex flex-col items-center justify-center gap-3 h-80 rounded-2xl border border-dashed border-border bg-card text-center px-6">
            <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950 grid place-items-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-text">
                {t("charts.error.title")}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {t("charts.error.description")}
              </p>
            </div>

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-text transition hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("charts.error.retry")}
            </button>
          </div>
        )}
      </Translation>
    );
  }
}
