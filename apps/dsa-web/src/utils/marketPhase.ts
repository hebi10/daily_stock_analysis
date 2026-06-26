import type {
  AnalysisPhase,
  MarketPhaseSummary,
  MarketPhaseValue,
  ReportLanguage,
} from '../types/analysis';
import { normalizeReportLanguage } from './reportLanguage';

const REQUEST_PHASE_LABELS: Record<ReportLanguage, Record<AnalysisPhase, string>> = {
  zh: {
    auto: '자동',
    premarket: '장전',
    intraday: '장중',
    postmarket: '장후',
  },
  ko: {
    auto: '자동',
    premarket: '장전',
    intraday: '장중',
    postmarket: '장후',
  },
  en: {
    auto: 'Auto',
    premarket: 'Pre-market',
    intraday: 'Intraday',
    postmarket: 'Post-market',
  },
};

const MARKET_PHASE_LABELS: Record<ReportLanguage, Record<MarketPhaseValue, string>> = {
  zh: {
    premarket: '장전',
    intraday: '장중',
    lunch_break: '점심 휴장',
    closing_auction: '마감 동시호가',
    postmarket: '장후',
    non_trading: '비거래 시간',
    unknown: '알 수 없음',
  },
  ko: {
    premarket: '장전',
    intraday: '장중',
    lunch_break: '점심 휴장',
    closing_auction: '마감 동시호가',
    postmarket: '장후',
    non_trading: '비거래 시간',
    unknown: '알 수 없음',
  },
  en: {
    premarket: 'Pre-market',
    intraday: 'Intraday',
    lunch_break: 'Lunch break',
    closing_auction: 'Near close',
    postmarket: 'Post-market',
    non_trading: 'Non-trading',
    unknown: 'Unknown phase',
  },
};

const TEXT: Record<ReportLanguage, { requestPrefix: string; finalPrefix: string; partialBar: string }> = {
  zh: {
    requestPrefix: '요청 구간',
    finalPrefix: '시장 구간',
    partialBar: '부분 봉',
  },
  ko: {
    requestPrefix: '요청 구간',
    finalPrefix: '시장 구간',
    partialBar: '부분 봉',
  },
  en: {
    requestPrefix: 'Requested phase',
    finalPrefix: 'Market phase',
    partialBar: 'Partial bar',
  },
};

export const getRequestedPhaseLabel = (
  phase?: AnalysisPhase | null,
  language?: string | null,
): string | null => {
  if (!phase) {
    return null;
  }

  const reportLanguage = normalizeReportLanguage(language);
  const label = REQUEST_PHASE_LABELS[reportLanguage][phase];
  if (!label) {
    return null;
  }

  return `${TEXT[reportLanguage].requestPrefix}: ${label}`;
};

export const getMarketPhaseSummaryLabel = (
  summary?: MarketPhaseSummary | null,
  language?: string | null,
): string | null => {
  if (!summary) {
    return null;
  }

  const reportLanguage = normalizeReportLanguage(language);
  const phaseLabel = MARKET_PHASE_LABELS[reportLanguage][summary.phase];
  if (!phaseLabel) {
    return null;
  }

  const market = (summary.market || '').trim().toUpperCase();
  const value = market ? `${market} · ${phaseLabel}` : phaseLabel;
  return `${TEXT[reportLanguage].finalPrefix}: ${value}`;
};

export const getPartialBarLabel = (language?: string | null): string =>
  TEXT[normalizeReportLanguage(language)].partialBar;
