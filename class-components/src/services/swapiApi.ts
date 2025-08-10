import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type Person = {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
  eye_color: string;
  url: string;
};

type GetPeopleResponse = {
  count: number;
  results: Person[];
};

export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://swapi.py4e.com/api/' }),
  tagTypes: ['People', 'Person'],
  endpoints: (builder) => ({
    getPeople: builder.query<GetPeopleResponse, string>({
      query: (page: string) => `people/?${page}`,
      providesTags: ['People'],
    }),
    getPersonByUrl: builder.query<Person, string>({
      query: (url: string) => {
        const cleanUrl = url.replace('https://swapi.py4e.com/api/', '');
        return cleanUrl;
      },
      providesTags: (_result, _error, url) => [{ type: 'Person', id: url }],
    }),
  }),
});

export const { useGetPeopleQuery, useGetPersonByUrlQuery } = swapiApi;
