export type FieldError = {
  campo: string;
  error: string;
};

export type Result<T> = {
  data?: T;
  isLoading: boolean;
  error?: string; // error general
  fieldError?: FieldError; // error de campo
};
