export function newId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const SITE_METRIC_LABELS = {
  publishedApps: 'Published Apps',
  downloads: 'Total Downloads',
  rating: 'Average Rating',
  activeUsers: 'Active Users',
};

export function siteStatsToRows(stats = {}) {
  const knownKeys = Object.keys(SITE_METRIC_LABELS);
  const allKeys = [...new Set([...knownKeys, ...Object.keys(stats)])];
  return allKeys.map((key) => ({
    id: key,
    key,
    label: SITE_METRIC_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
    value: stats[key] ?? '',
  }));
}

export function rowsToSiteStats(rows) {
  return rows.reduce((acc, row) => {
    if (row.key?.trim()) {
      acc[row.key.trim()] = row.value;
    }
    return acc;
  }, {});
}
