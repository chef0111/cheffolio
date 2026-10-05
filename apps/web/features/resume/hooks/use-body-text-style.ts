import { usePdfcnTheme } from '@/components/pdf/theme-provider';

export function useBodyTextStyle() {
  const theme = usePdfcnTheme();
  const { body } = theme.typography;

  return {
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    color: theme.colors.foreground,
  };
}
