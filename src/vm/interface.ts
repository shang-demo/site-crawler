export enum WorkResultType {
  PAGE_CREATE = 'PAGE_CREATE',
  RETURN = 'RETURN',
  ERROR = 'ERROR',
}

export interface WorkResult {
  type: WorkResultType;
  data?: any;
}