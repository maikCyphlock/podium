import { NextResponse } from 'next/server';

type SuccessResponseOptions<T> = {
  data: T;
  status?: number;
  headers?: Record<string, string>;
};

type ErrorResponseOptions = {
  error: string;
  details?: any;
  status?: number;
};

export class ApiResponse {
  static success<T>({ 
    data, 
    status = 200, 
    headers = {} 
  }: SuccessResponseOptions<T>) {
    return new NextResponse(JSON.stringify({ success: true, data }), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  }

  static error({ 
    error, 
    details, 
    status = 400 
  }: ErrorResponseOptions) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error,
        details: details || undefined,
      }),
      {
        status,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  static notFound(message = 'Recurso no encontrado') {
    return ApiResponse.error({
      error: message,
      status: 404,
    });
  }

  static unauthorized(message = 'No autorizado') {
    return ApiResponse.error({
      error: message,
      status: 401,
    });
  }

  static forbidden(message = 'No tienes permiso para realizar esta acción') {
    return ApiResponse.error({
      error: message,
      status: 403,
    });
  }

  static badRequest(message = 'Solicitud inválida', details?: any) {
    return ApiResponse.error({
      error: message,
      details,
      status: 400,
    });
  }

  static serverError(message = 'Error interno del servidor') {
    return ApiResponse.error({
      error: message,
      status: 500,
    });
  }
}
