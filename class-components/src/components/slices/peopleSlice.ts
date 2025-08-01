import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Person = {
  name: string;
  url: string;
  [key: string]: unknown;
};

type PeopleState = {
  selected: Record<string, Person>;
};

const initialState: PeopleState = {
  selected: {},
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<Person>) => {
      const id = action.payload.url;
      if (state.selected[id]) {
        delete state.selected[id];
      } else {
        state.selected[id] = action.payload;
      }
    },
    clearSelection: (state) => {
      state.selected = {};
    },
  },
});

export const { toggleSelection, clearSelection } = peopleSlice.actions;
export default peopleSlice.reducer;
