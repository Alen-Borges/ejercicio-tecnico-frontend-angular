import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';

const BASE = `${environment.apiUrl}/bp/products`;

const mockProduct = {
  id: 'test-01',
  name: 'Tarjeta Visa',
  description: 'Tarjeta de crédito Visa',
  logo: 'https://visa.com/logo.png',
  date_release: '2025-01-01',
  date_revision: '2026-01-01'
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // GET
  it('should get products successfully', () => {
    service.getProducts().subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].id).toBe('test-01');
    });
    httpMock.expectOne(BASE).flush({ data: [mockProduct] });
  });

  it('should propagate error when getProducts fails', () => {
    service.getProducts().subscribe({
      error: (err: Error) => expect(err.message).toContain('servidor')
    });
    httpMock.expectOne(BASE).error(new ErrorEvent('Network error'));
  });

  // POST
  it('should create product successfully', () => {
    service.createProduct(mockProduct).subscribe(res => {
      expect(res.message).toBe('Product added successfully');
      expect(res.data.id).toBe('test-01');
    });
    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Product added successfully', data: mockProduct });
  });

  it('should propagate 400 error when createProduct fails validation', () => {
    service.createProduct(mockProduct).subscribe({
      error: (err: Error) => expect(err.message).toContain('válidos')
    });
    httpMock.expectOne(BASE).flush({ message: 'Bad request' }, { status: 400, statusText: 'Bad Request' });
  });

  // PUT
  it('should update product successfully', () => {
    const { id, ...updateData } = mockProduct;
    service.updateProduct('test-01', updateData).subscribe(res => {
      expect(res.message).toBe('Product updated successfully');
    });
    const req = httpMock.expectOne(`${BASE}/test-01`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Product updated successfully', data: mockProduct });
  });

  it('should propagate 404 when updateProduct not found', () => {
    service.updateProduct('no-existe', {} as any).subscribe({
      error: (err: Error) => expect(err.message).toContain('encontrado')
    });
    httpMock.expectOne(`${BASE}/no-existe`).flush({}, { status: 404, statusText: 'Not Found' });
  });

  // DELETE
  it('should delete product successfully', () => {
    service.deleteProduct('test-01').subscribe(res => {
      expect(res.message).toBe('Product removed successfully');
    });
    const req = httpMock.expectOne(`${BASE}/test-01`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });

  it('should propagate 404 when deleteProduct not found', () => {
    service.deleteProduct('no-existe').subscribe({
      error: (err: Error) => expect(err.message).toContain('encontrado')
    });
    httpMock.expectOne(`${BASE}/no-existe`).flush({}, { status: 404, statusText: 'Not Found' });
  });

  // VERIFY
  it('should return true when id exists', () => {
    service.verifyId('test-01').subscribe(exists => expect(exists).toBe(true));
    httpMock.expectOne(`${BASE}/verification/test-01`).flush(true);
  });

  it('should return false when id does not exist', () => {
    service.verifyId('nuevo-id').subscribe(exists => expect(exists).toBe(false));
    httpMock.expectOne(`${BASE}/verification/nuevo-id`).flush(false);
  });
});
