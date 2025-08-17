import type { RootState } from '../../../store';

export const getThemeValue = (state: RootState): string => state.theme.value;
