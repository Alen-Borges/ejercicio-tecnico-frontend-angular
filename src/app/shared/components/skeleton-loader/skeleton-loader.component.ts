import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  template: `
    <div class="skeleton-table">
      <div class="skeleton-row header">
        <div class="skeleton-cell wide"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell narrow"></div>
        <div class="skeleton-cell narrow"></div>
        <div class="skeleton-cell narrow"></div>
      </div>
      <div class="skeleton-row" *ngFor="let i of rows">
        <div class="skeleton-cell wide pulse"></div>
        <div class="skeleton-cell pulse"></div>
        <div class="skeleton-cell pulse"></div>
        <div class="skeleton-cell narrow pulse"></div>
        <div class="skeleton-cell narrow pulse"></div>
        <div class="skeleton-cell narrow pulse"></div>
      </div>
    </div>
  `,
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() rowCount = 5;

  get rows(): number[] {
    return Array(this.rowCount).fill(0);
  }
}
