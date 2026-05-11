import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Product,
  ProductApiResponse,
  ProductCreateResponse,
  ProductUpdateResponse,
  ProductDeleteResponse,
  CreateProductRequest,
  UpdateProductRequest
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/bp/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductApiResponse> {
    return this.http.get<ProductApiResponse>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  createProduct(data: CreateProductRequest): Observable<ProductCreateResponse> {
    return this.http.post<ProductCreateResponse>(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, data: UpdateProductRequest): Observable<ProductUpdateResponse> {
    return this.http.put<ProductUpdateResponse>(`${this.baseUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<ProductDeleteResponse> {
    return this.http.delete<ProductDeleteResponse>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
    if (error.status === 400) {
      message = 'Los datos enviados no son válidos.';
    } else if (error.status === 404) {
      message = 'El producto no fue encontrado.';
    } else if (error.status === 0) {
      message = 'No se puede conectar con el servidor. Verifique que la API esté en ejecución.';
    }
    return throwError(() => new Error(message));
  }
}
