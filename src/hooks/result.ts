export type FieldError = {
  campo: string;
  error: string;
};

export type Result<T> = {
  data?: T;
  isLoading: boolean;
  error?: string;
  fieldError?: FieldError;
};
