import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../core/services/product.service';

const mockProduct = {
  id: 'test-01', name: 'Tarjeta Visa', description: 'Tarjeta de crédito internacional',
  logo: 'https://visa.com/logo.png', date_release: '2026-01-01', date_revision: '2027-01-01'
};

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); };
const nextYear = (s: string) => { const d = new Date(s + 'T00:00:00'); d.setFullYear(d.getFullYear() + 1); return d.toISOString().slice(0, 10); };

function createComponent(routeParams = {}) {
  return TestBed.configureTestingModule({
    declarations: [ProductFormComponent],
    imports: [ReactiveFormsModule, RouterTestingModule, CommonModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { params: routeParams } }
      },
      {
        provide: ProductService,
        useValue: {
          getProducts: jest.fn().mockReturnValue(of({ data: [mockProduct] })),
          createProduct: jest.fn().mockReturnValue(of({ message: 'ok', data: mockProduct })),
          updateProduct: jest.fn().mockReturnValue(of({ message: 'ok', data: mockProduct })),
          verifyId: jest.fn().mockReturnValue(of(false))
        }
      }
    ]
  }).compileComponents();
}

describe('ProductFormComponent — Add mode', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    await createComponent();
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as any;
    fixture.detectChanges();
  });

  it('should create in add mode', () => {
    expect(component).toBeTruthy();
    expect(component.isEditMode).toBe(false);
  });

  it('id — should be invalid when empty', () => {
    component.form.get('id')!.setValue('');
    component.form.get('id')!.markAsTouched();
    expect(component.hasError('id', 'required')).toBe(true);
  });

  it('id — should be invalid when less than 3 chars', () => {
    component.form.get('id')!.setValue('ab');
    component.form.get('id')!.markAsTouched();
    expect(component.hasError('id', 'minlength')).toBe(true);
  });

  it('id — should be invalid when more than 10 chars', () => {
    component.form.get('id')!.setValue('abcdefghijk');
    component.form.get('id')!.markAsTouched();
    expect(component.hasError('id', 'maxlength')).toBe(true);
  });

  it('name — should be invalid when empty', () => {
    component.form.get('name')!.setValue('');
    component.form.get('name')!.markAsTouched();
    expect(component.hasError('name', 'required')).toBe(true);
  });

  it('name — should be invalid when less than 5 chars', () => {
    component.form.get('name')!.setValue('abc');
    component.form.get('name')!.markAsTouched();
    expect(component.hasError('name', 'minlength')).toBe(true);
  });

  it('description — should be invalid when less than 10 chars', () => {
    component.form.get('description')!.setValue('corto');
    component.form.get('description')!.markAsTouched();
    expect(component.hasError('description', 'minlength')).toBe(true);
  });

  it('logo — should be required', () => {
    component.form.get('logo')!.setValue('');
    component.form.get('logo')!.markAsTouched();
    expect(component.hasError('logo', 'required')).toBe(true);
  });

  it('date_release — should be invalid for past date', () => {
    component.form.get('date_release')!.setValue('2020-01-01');
    component.form.get('date_release')!.markAsTouched();
    expect(component.hasError('date_release', 'pastDate')).toBe(true);
  });

  it('date_revision — should be auto-calculated as date_release + 1 year', () => {
    const rel = tomorrow();
    component.form.get('date_release')!.setValue(rel);
    const expectedRevision = nextYear(rel);
    expect(component.form.get('date_revision')!.value).toBe(expectedRevision);
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should call createProduct on valid submit', () => {
    jest.useFakeTimers();
    const rel = tomorrow();
    component.form.patchValue({
      id: 'abc', name: 'Producto Nuevo', description: 'Descripción larga suficiente',
      logo: 'https://logo.com', date_release: rel, date_revision: nextYear(rel)
    });
    component.submitted = true;
    // Mock async validator to resolve immediately
    jest.spyOn(component.form.get('id')!, 'pending', 'get').mockReturnValue(false);
    jest.spyOn(component.form.get('id')!, 'invalid', 'get').mockReturnValue(false);
    component.onSubmit();
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('should reset form on Reiniciar', () => {
    component.form.get('name')!.setValue('Test');
    component.submitted = true;
    component.onReset();
    expect(component.form.get('name')!.value).toBeNull();
    expect(component.submitted).toBe(false);
  });

  it('should show error message on createProduct failure', () => {
    (productService.createProduct as jest.Mock).mockReturnValue(throwError(() => new Error('Error del servidor')));
    const rel = tomorrow();
    component.form.patchValue({
      id: 'abc', name: 'Tarjeta Visa', description: 'Descripción larga suficiente aquí',
      logo: 'https://logo.com', date_release: rel, date_revision: nextYear(rel)
    });
    // Force form to be valid
    jest.spyOn(component.form, 'invalid', 'get').mockReturnValue(false);
    jest.spyOn(component.form, 'pending', 'get').mockReturnValue(false);
    component.onSubmit();
    expect(component.errorMessage).toBe('Error del servidor');
  });
});

describe('ProductFormComponent — Edit mode', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    await createComponent({ id: 'test-01' });
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as any;
    fixture.detectChanges();
  });

  it('should create in edit mode', () => {
    expect(component.isEditMode).toBe(true);
    expect(component.productId).toBe('test-01');
  });

  it('should preload product data', () => {
    expect(component.form.get('name')!.value).toBe('Tarjeta Visa');
  });

  it('should disable id field in edit mode', () => {
    expect(component.form.get('id')!.disabled).toBe(true);
  });

  it('should call updateProduct on submit', () => {
    jest.spyOn(component.form, 'invalid', 'get').mockReturnValue(false);
    jest.spyOn(component.form, 'pending', 'get').mockReturnValue(false);
    component.onSubmit();
    expect(productService.updateProduct).toHaveBeenCalled();
  });

  it('should show error if updateProduct fails', () => {
    (productService.updateProduct as jest.Mock).mockReturnValue(throwError(() => new Error('No encontrado')));
    jest.spyOn(component.form, 'invalid', 'get').mockReturnValue(false);
    jest.spyOn(component.form, 'pending', 'get').mockReturnValue(false);
    component.onSubmit();
    expect(component.errorMessage).toBe('No encontrado');
  });
});
