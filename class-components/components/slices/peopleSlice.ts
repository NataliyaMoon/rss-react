import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Person = {
  name: string;
  birth_year: string;
  gender: string;
};

type PeopleState = {
  selected: Record<string, Person>;
  searchQuery: string;
};

const loadSelectedFromStorage = (): Record<string, Person> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('selectedPeople');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const initialState: PeopleState = {
  selected: loadSelectedFromStorage(),
  searchQuery: '',
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<Person>) => {
      const id = action.payload.name;
      if (state.selected[id]) {
        delete state.selected[id];
      } else {
        state.selected[id] = action.payload;
      }
      localStorage.setItem('selectedPeople', JSON.stringify(state.selected));
    },
    clearSelection: (state) => {
      state.selected = {};
      localStorage.removeItem('selectedPeople');
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { toggleSelection, clearSelection, setSearchQuery } = peopleSlice.actions;
export default peopleSlice.reducer;
