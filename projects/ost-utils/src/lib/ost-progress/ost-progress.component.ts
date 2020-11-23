import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  Input, OnChanges, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';

@Component({
  selector: 'ost-progress',
  templateUrl: './ost-progress.component.html',
  styleUrls: ['./ost-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OstProgressComponent implements AfterViewInit, OnChanges {
  @ViewChild('progressBar', { static: false }) progressBar: ElementRef<HTMLDivElement>;
  @ViewChild('progressLayout', { static: false }) progressLayout: ElementRef<HTMLDivElement>;

  @Input() bgColor = '#FFF';
  @Input() barColor = '#0ff338';
  @Input() value = 0;
  @Input() barwidth = 5;
  constructor(public render: Renderer2, public cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.render.setStyle(this.progressBar.nativeElement, 'background-color', `${this.barColor}`);
    this.render.setStyle(this.progressLayout.nativeElement, 'background-color', `${this.bgColor}`);
    this.render.setStyle(this.progressBar.nativeElement, 'height', `${this.barwidth}px`);
    this.render.setStyle(this.progressLayout.nativeElement, 'height', `${this.barwidth}px`);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.progressBar) {
      this.render.setStyle(this.progressBar.nativeElement, 'width', `${this.value}%`);
      this.cd.markForCheck();
    }
  }

}
