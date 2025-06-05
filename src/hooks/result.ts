export type Result<T> = {
  data?: T;
  isLoading: boolean;
  error?: string;
};
