import {
  Component, Input, Output, EventEmitter,
  OnChanges, HostListener
} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-icon">
          <span class="icon-warning">!</span>
        </div>
        <h2 id="modal-title">¿Estás seguro?</h2>
        <p class="modal-message">
          Deseas eliminar el producto
          <strong>{{ productName }}</strong>.
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="onCancel()" type="button">Cancelar</button>
          <button class="btn-delete" (click)="onConfirm()" type="button">Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnChanges {
  @Input() productName = '';
  @Input() isVisible = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  ngOnChanges(): void {
    if (this.isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isVisible) this.onCancel();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
