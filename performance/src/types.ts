export type YearRecord = {
  year: number;
  population?: number | null;
  co2?: number | null;
  co2_per_capita?: number | null;
  methane?: number | null;
  oil_co2?: number | null;
  temperature_change_from_co2?: number | null;
  [key: string]: number | string | null | undefined;
};

export type CountryNode = {
  iso_code: string;
  name: string;
  region?: string;
  is_country?: boolean;
  data: YearRecord[];
};

export type CO2Index = Record<string, CountryNode>;

export type SortKey = 'name' | 'population';
export type SortDir = 'asc' | 'desc';


export type ColumnKey = keyof YearRecord;