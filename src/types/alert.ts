export enum AlertSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type AlertData = {
  message: string;
  severity: AlertSeverity;
};
