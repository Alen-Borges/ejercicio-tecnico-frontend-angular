import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmModalComponent],
      imports: [CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render modal when isVisible is false', () => {
    component.isVisible = false;
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeNull();
  });

  it('should render modal when isVisible is true', () => {
    component.isVisible = true;
    component.productName = 'Tarjeta Visa';
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should display product name in modal', () => {
    component.isVisible = true;
    component.productName = 'Tarjeta Visa';
    fixture.detectChanges();
    const message = fixture.nativeElement.querySelector('.modal-message');
    expect(message.textContent).toContain('Tarjeta Visa');
  });

  it('should emit confirmed when Eliminar is clicked', () => {
    component.isVisible = true;
    fixture.detectChanges();
    const confirmSpy = jest.spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancelled when Cancelar is clicked', () => {
    component.isVisible = true;
    fixture.detectChanges();
    const cancelSpy = jest.spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit cancelled on Escape key press', () => {
    component.isVisible = true;
    fixture.detectChanges();
    const cancelSpy = jest.spyOn(component.cancelled, 'emit');
    component.onEscapeKey();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not emit cancelled on Escape when not visible', () => {
    component.isVisible = false;
    const cancelSpy = jest.spyOn(component.cancelled, 'emit');
    component.onEscapeKey();
    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('should set body overflow hidden when visible', () => {
    component.isVisible = true;
    component.ngOnChanges();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when hidden', () => {
    component.isVisible = false;
    component.ngOnChanges();
    expect(document.body.style.overflow).toBe('');
  });
});
