export enum WorkResultType {
  PAGE_CREATE = 'PAGE_CREATE',
  RETURN = 'RETURN',
  ERROR = 'ERROR',
  LOG = 'LOG',
}

export enum WorkLogType {
  LOG = 'LOG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export interface WorkResult {
  type: WorkResultType | WorkLogType;
  data?: any;
}
