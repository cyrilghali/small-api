export interface ApiErrorResponse {
  error: {
    code?: string;
    message: string;
  };
  success: false;
}

export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
}
