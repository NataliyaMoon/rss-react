import type { RootState } from '../../../store';

export const getSearchQuery = (state: RootState): string => state.people.searchQuery;
export const getSelectedPeople = (state: RootState) => state.people.selected;
