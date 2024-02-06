export interface IChartData {
  label: string;
  backgroundColor: string;
  pointBorderColor: string;
  data: Array<Number>;
}

export enum EGroups {
  "Dynamics 365" = "Dynamics 365",
  "AI" = "AI",
  "Power Platform" = "Power Platform",
  "Integration" = "Integration",
  "Modern Work" = "Modern Work",
}

// // ProductRow class to store the data for each row in the grid
export interface DataRow {
  id: string;
  properties: IProductProperty[];
}

// // Data for a single row cell in the grid
export interface IProductProperty {
  alias?: string;
  displayName: string;
  value: Number | Date | string;
  type: string;
}
