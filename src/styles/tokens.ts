export const designTokens = {
  color: {
    navy: '#0F172A', teal: '#0D9488', background: '#F8FAFC', surface: '#FFFFFF',
    border: '#E2E8F0', text: '#0F172A', textSecondary: '#475569', textMuted: '#64748B',
    success: '#059669', warning: '#B45309', danger: '#DC2626', info: '#2563EB', focus: '#14B8A6',
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48, 10: 64 },
  radius: { small: 4, medium: 8, large: 12 },
  typography: { display: 32, pageTitle: 24, sectionTitle: 18, cardTitle: 16, body: 14, small: 12, label: 11 },
  motion: { fast: 150, standard: 200 },
} as const

export type DesignTokens = typeof designTokens
