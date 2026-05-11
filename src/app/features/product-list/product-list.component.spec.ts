import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/services/product.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { Product } from '../../core/models/product.model';

const mockProducts: Product[] = [
  { id: 'p1', name: 'Tarjeta Visa', description: 'Tarjeta de crédito', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
  { id: 'p2', name: 'Cuenta Ahorro', description: 'Cuenta de ahorros', logo: '', date_release: '2025-06-01', date_revision: '2026-06-01' },
  { id: 'p3', name: 'Préstamo Personal', description: 'Préstamo sin aval', logo: '', date_release: '2025-03-01', date_revision: '2026-03-01' },
];

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jest.Mocked<ProductService>;
  let router: Router;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
      deleteProduct: jest.fn().mockReturnValue(of({ message: 'Product removed successfully' })),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [
        ProductListComponent,
        ConfirmModalComponent,
        SkeletonLoaderComponent,
        SearchFilterPipe
      ],
      imports: [RouterTestingModule, CommonModule],
      providers: [{ provide: ProductService, useValue: productServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProducts on init', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
  });

  it('should display products after loading', () => {
    expect(component.products.length).toBe(3);
    expect(component.loading).toBe(false);
  });

  it('should show error message when getProducts fails', () => {
    productServiceMock.getProducts.mockReturnValue(throwError(() => new Error('Error de conexión')));
    component.loadProducts();
    expect(component.errorMessage).toBe('Error de conexión');
    expect(component.loading).toBe(false);
  });

  it('should filter products by search term', () => {
    component.searchTerm = 'visa';
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe('p1');
  });

  it('should return all products when search term is empty', () => {
    component.searchTerm = '';
    expect(component.filteredProducts.length).toBe(3);
  });

  it('should limit products shown by page size', () => {
    component.pageSize = 2;
    expect(component.pagedProducts.length).toBe(2);
  });

  it('should update page size', () => {
    component.onPageSizeChange('10');
    expect(component.pageSize).toBe(10);
  });

  it('should open delete modal and set selectedProduct', () => {
    const event = new MouseEvent('click');
    component.openDeleteModal(mockProducts[0], event);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should clear selectedProduct on cancel', () => {
    component.selectedProduct = mockProducts[0];
    component.onDeleteCancelled();
    expect(component.selectedProduct).toBeNull();
  });

  it('should delete product and remove from list on confirm', () => {
    component.selectedProduct = mockProducts[0];
    component.onDeleteConfirmed();
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith('p1');
    expect(component.products.find(p => p.id === 'p1')).toBeUndefined();
  });

  it('should show error if deleteProduct fails', () => {
    productServiceMock.deleteProduct.mockReturnValue(throwError(() => new Error('No encontrado')));
    component.selectedProduct = mockProducts[0];
    component.onDeleteConfirmed();
    expect(component.errorMessage).toBe('No encontrado');
  });

  it('should navigate to /products/add on goToAdd', () => {
    const navSpy = jest.spyOn(router, 'navigate');
    component.goToAdd();
    expect(navSpy).toHaveBeenCalledWith(['/products/add']);
  });

  it('should navigate to edit on goToEdit', () => {
    const navSpy = jest.spyOn(router, 'navigate');
    const event = new MouseEvent('click');
    component.goToEdit(mockProducts[0], event);
    expect(navSpy).toHaveBeenCalledWith(['/products/edit', 'p1']);
  });

  it('should toggle dropdown', () => {
    const event = new MouseEvent('click');
    component.toggleDropdown('p1', event);
    expect(component.openDropdownId).toBe('p1');
    component.toggleDropdown('p1', event);
    expect(component.openDropdownId).toBeNull();
  });

  it('should close all dropdowns on document click', () => {
    component.openDropdownId = 'p1';
    component.closeDropdown();
    expect(component.openDropdownId).toBeNull();
  });
});
