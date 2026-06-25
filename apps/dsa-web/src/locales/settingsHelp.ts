import type { SystemConfigDocLink } from '../types/systemConfig';

export interface SettingsHelpContent {
  title: string;
  summary?: string;
  usage?: string;
  valueNotes?: string[];
  impact?: string[];
  notes?: string[];
  examples?: string[];
  showFieldKey?: boolean;
  docs?: SystemConfigDocLink[];
}

type SettingsHelpMap = Record<string, SettingsHelpContent>;

const settingsHelpKo: SettingsHelpMap = {
  'settings.base.STOCK_LIST': {
    title: '종목 목록',
    summary: '분석 대상 종목 코드를 쉼표로 구분해 입력합니다.',
    valueNotes: ['비워두면 예약 작업이나 CLI에서 지정한 기본 대상이 사용됩니다.'],
  },
  'settings.ai_model.GENERATION_BACKEND': {
    title: 'AI 생성 백엔드',
    summary: '분석 리포트 생성에 사용할 모델 공급자 또는 백엔드를 선택합니다.',
    showFieldKey: false,
  },
  'settings.notification.NOTIFICATION_ALERT_CHANNELS': {
    title: '알림 채널',
    summary: '이벤트 알림을 보낼 기본 채널을 지정합니다. 여러 값은 쉼표로 구분합니다.',
  },
  'settings.backtest.BACKTEST_ENABLED': {
    title: '백테스트 사용',
    summary: '과거 분석 기록을 기준으로 예측 성과를 평가할지 결정합니다.',
  },
};

const settingsHelpEn: SettingsHelpMap = {
  'settings.base.STOCK_LIST': {
    title: 'Stock list',
    summary: 'Comma-separated stock codes to analyze.',
    valueNotes: ['When empty, scheduled jobs or CLI-provided defaults are used.'],
  },
  'settings.ai_model.GENERATION_BACKEND': {
    title: 'AI generation backend',
    summary: 'Selects the provider or backend used to generate analysis reports.',
    showFieldKey: false,
  },
  'settings.notification.NOTIFICATION_ALERT_CHANNELS': {
    title: 'Alert channels',
    summary: 'Default channels for event alert delivery. Separate multiple values with commas.',
  },
  'settings.backtest.BACKTEST_ENABLED': {
    title: 'Backtest enabled',
    summary: 'Controls whether historical analysis records are evaluated for prediction performance.',
  },
};

function getPreferredHelpMap(locale?: string | null): SettingsHelpMap {
  return locale?.toLowerCase().startsWith('en') ? settingsHelpEn : settingsHelpKo;
}

function getDefaultTitle(locale?: string | null): string {
  return locale?.toLowerCase().startsWith('en') ? 'Configuration help' : '설정 도움말';
}

export function getSettingsHelpContent(
  helpKey?: string | null,
  fallbackDescription?: string,
  locale?: string | null,
): SettingsHelpContent | null {
  if (!helpKey && !fallbackDescription) {
    return null;
  }

  const helpMap = getPreferredHelpMap(locale);
  const localizedHelp = helpKey ? helpMap[helpKey] : undefined;
  if (localizedHelp) {
    return fallbackDescription && !localizedHelp.summary
      ? { ...localizedHelp, summary: fallbackDescription }
      : localizedHelp;
  }

  return {
    title: getDefaultTitle(locale),
    summary: fallbackDescription,
    showFieldKey: true,
  };
}
