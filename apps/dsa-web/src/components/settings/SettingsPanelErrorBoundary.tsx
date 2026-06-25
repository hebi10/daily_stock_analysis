import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { InlineAlert } from '../common';
import { useUiLanguage } from '../../contexts/UiLanguageContext';
import { cn } from '../../utils/cn';

interface SettingsPanelErrorBoundaryProps {
  title: string;
  children: ReactNode;
  resetKey?: string | number;
  className?: string;
  diagnosticHint?: ReactNode;
}

interface SettingsPanelErrorBoundaryLabels {
  loadFailedSuffix: string;
  runtimeErrorMessage: string;
  defaultDiagnosticHint: string;
  errorSummaryPrefix: string;
}

interface SettingsPanelErrorBoundaryState {
  hasError: boolean;
  errorSummary: string;
}

const MAX_ERROR_SUMMARY_LENGTH = 180;

function sanitizeUrlLikeText(value: string) {
  return value.replace(/https?:\/\/[^\s"'<>]+/gi, (match) => {
    try {
      const url = new URL(match);
      const sanitizedPath = url.pathname && url.pathname !== '/' ? '/[redacted]' : '';
      const sanitizedUrl = `${url.protocol}//${url.host}${sanitizedPath}`;
      return `${sanitizedUrl}${url.search ? '?[redacted]' : ''}${url.hash ? '#[redacted]' : ''}`;
    } catch {
      return match
        .replace(/^(https?:\/\/[^/?#\s"'<>]+)\/[^?#\s"'<>]*/i, '$1/[redacted]')
        .replace(/\?[^#\s"'<>]*/g, '?[redacted]')
        .replace(/#[^\s"'<>]*/g, '#[redacted]');
    }
  });
}

function getSafeErrorSummary(error: unknown) {
  const rawMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : '\uC54C \uC218 \uC5C6\uB294 \uD504\uB7F0\uD2B8\uC5D4\uB4DC \uC624\uB958';
  const normalized = rawMessage.replace(/\s+/g, ' ').trim() || '\uC54C \uC218 \uC5C6\uB294 \uD504\uB7F0\uD2B8\uC5D4\uB4DC \uC624\uB958';  const sanitized = sanitizeUrlLikeText(normalized)
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi, 'Bearer [redacted]')
    .replace(/\b(sk-[A-Za-z0-9_-]{8,})\b/g, '[redacted-key]')
    .replace(
      /\b([A-Z0-9_]*(?:api[_-]?key|token|secret|password|passwd|authorization|webhook(?:_url)?)\s*[:=]\s*)([^\s,;'"`]+)/gi,
      '$1[redacted]'
    );

  if (sanitized.length <= MAX_ERROR_SUMMARY_LENGTH) {
    return sanitized;
  }

  return `${sanitized.slice(0, MAX_ERROR_SUMMARY_LENGTH)}...`;
}

class SettingsPanelErrorBoundaryImpl extends Component<
  SettingsPanelErrorBoundaryProps & { labels: SettingsPanelErrorBoundaryLabels },
  SettingsPanelErrorBoundaryState
> {
  override state: SettingsPanelErrorBoundaryState = {
    hasError: false,
    errorSummary: '',
  };

  static getDerivedStateFromError(error: unknown): SettingsPanelErrorBoundaryState {
    return {
      hasError: true,
      errorSummary: getSafeErrorSummary(error),
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Settings panel runtime error: ${this.props.title}`, error, errorInfo);
  }

  override componentDidUpdate(prevProps: SettingsPanelErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, errorSummary: '' });
    }
  }

  override render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className={cn('rounded-[1.5rem] border settings-border bg-card/94 p-5 shadow-soft-card-strong backdrop-blur-sm', this.props.className)}>
        <InlineAlert
          title={`${this.props.title}${this.props.labels.loadFailedSuffix}`}
          variant="danger"
          message={(
            <div className="space-y-2">
              <p>
                {this.props.labels.runtimeErrorMessage}
              </p>
              {this.props.diagnosticHint ? (
                <p>{this.props.diagnosticHint}</p>
              ) : (
                <p>{this.props.labels.defaultDiagnosticHint}</p>
              )}
              {this.state.errorSummary ? (
                <p className="break-words font-mono text-xs opacity-80">
                  {this.props.labels.errorSummaryPrefix}{this.state.errorSummary}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>
    );
  }
}

export const SettingsPanelErrorBoundary = (props: SettingsPanelErrorBoundaryProps) => {
  const { language } = useUiLanguage();
  const labels: SettingsPanelErrorBoundaryLabels = language === 'en'
    ? {
        loadFailedSuffix: ' failed to load',
        runtimeErrorMessage: 'This settings area hit a frontend runtime error. Other settings remain usable.',
        defaultDiagnosticHint: 'Provide the release version, runtime environment, and trigger path to help diagnose the issue.',
        errorSummaryPrefix: 'Error summary: ',
      }
    : {
        loadFailedSuffix: ' \uB85C\uB4DC \uC2E4\uD328',
        runtimeErrorMessage: '\uC774 \uC124\uC815 \uC601\uC5ED\uC5D0\uC11C \uD504\uB7F0\uD2B8\uC5D4\uB4DC \uB7F0\uD0C0\uC784 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uC124\uC815\uC740 \uACC4\uC18D \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
        defaultDiagnosticHint: '\uBB38\uC81C \uC9C4\uB2E8\uC744 \uC704\uD574 \uB9B4\uB9AC\uC2A4 \uBC84\uC804, \uC2E4\uD589 \uD658\uACBD, \uC624\uB958\uAC00 \uBC1C\uC0DD\uD55C \uACBD\uB85C\uB97C \uD655\uC778\uD558\uC138\uC694.',
        errorSummaryPrefix: '\uC624\uB958 \uC694\uC57D: ',
      };
  return <SettingsPanelErrorBoundaryImpl {...props} labels={labels} />;
};
