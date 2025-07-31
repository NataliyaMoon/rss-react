import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Person = {
  name: string;
  birth_year: string;
  url: string;
  gender: string;
  height: string;
  mass: string;
  eye_color: string;
};

type PeopleState = {
  selectedPerson: Person | null;
  searchQuery: string;
};

const initialState: PeopleState = {
  selectedPerson: null,
  searchQuery: '',
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setSelectedPerson(state, action: PayloadAction<Person | null>) {
      state.selectedPerson = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSelectedPerson, setSearchQuery } = peopleSlice.actions;
export default peopleSlice.reducer;
