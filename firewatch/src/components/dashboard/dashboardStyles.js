export const surfaceSx = {
  bgcolor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

export const cardHeaderSx = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 2,
  mb: 2,
};

export const pastelPills = {
  critical: { bg: 'var(--severity-critical-bg)', fg: 'var(--severity-critical-fg)' },
  high: { bg: 'var(--severity-high-bg)', fg: 'var(--severity-high-fg)' },
  medium: { bg: 'var(--severity-medium-bg)', fg: 'var(--severity-medium-fg)' },
  low: { bg: 'var(--severity-low-bg)', fg: 'var(--severity-low-fg)' },
  info: { bg: 'var(--severity-info-bg)', fg: 'var(--severity-info-fg)' },
};

export const chartSeries = {
  primary: 'var(--color-primary)',
  critical: 'var(--severity-critical-chart)',
  high: 'var(--severity-high-chart)',
  medium: 'var(--severity-medium-chart)',
  low: 'var(--severity-low-chart)',
  info: 'var(--severity-info-chart)',
  muted: 'var(--color-text-muted)',
};

export function resolveCssColor(token) {
  if (typeof window === 'undefined') return token;

  if (!token?.startsWith('var(')) return token;

  const variableName = token.replace(/^var\((.*)\)$/, '$1').trim();
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return resolved || token;
}
