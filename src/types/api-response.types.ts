export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}
