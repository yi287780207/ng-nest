import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  NgZone,
  Renderer2,
  OnDestroy,
  HostBinding,
  HostListener
} from '@angular/core';
import { XCascadeNode } from './cascade.property';
import { XIsEmpty, XCorner, XConnectAnimation } from '@ng-nest/ui/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'x-cascade-portal',
  templateUrl: './cascade-portal.component.html',
  styleUrls: ['./cascade-portal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [XConnectAnimation]
})
export class XCascadePortalComponent implements OnInit, OnDestroy {
  @HostBinding('@x-connect-animation') public placement: XCorner;
  @HostListener('@x-connect-animation.done', ['$event']) done(event: { toState: any }) {
    event.toState === 'void' && this.destroyPortal();
  }

  nodes: XCascadeNode[][] = [];
  datas: XCascadeNode[] = [];
  selecteds: XCascadeNode[] = [];
  value: any;
  valueChange: Subject<any>;
  positionChange: Subject<any>;
  closePortal: Function;
  destroyPortal: Function;
  nodeEmit: Function;
  values: XCascadeNode[] = [];
  docClickFunction: Function;
  private _unSubject = new Subject<void>();

  constructor(private renderer: Renderer2, public ngZone: NgZone, public cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.init();
    this.valueChange.pipe(takeUntil(this._unSubject)).subscribe((x) => {
      this.value = x;
      this.init();
      this.cdr.detectChanges();
    });
    this.positionChange.pipe(takeUntil(this._unSubject)).subscribe((x) => {
      this.placement = x;
      this.cdr.detectChanges();
    });
    setTimeout(
      () =>
        (this.docClickFunction = this.renderer.listen('document', 'click', () => {
          this.closePortal();
        }))
    );
  }

  ngOnDestroy(): void {
    this._unSubject.next();
    this._unSubject.unsubscribe();
    this.docClickFunction && this.docClickFunction();
  }

  init() {
    if (!XIsEmpty(this.value)) {
      this.setDefault();
    } else {
      this.values = [];
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  setDefault() {
    let node = this.datas.find((x) => x.id === this.value) as XCascadeNode;
    this.selecteds = [node];
    this.nodes = [this.datas.filter((x) => x.pid === node.pid)];
    while (!XIsEmpty(node.pid)) {
      node = this.datas.find((x) => x.id === node.pid) as XCascadeNode;
      this.selecteds = [node, ...this.selecteds];
      this.nodes = [this.datas.filter((x) => x.pid === node.pid), ...this.nodes];
    }
    this.values = this.selecteds.map((x) => x.id) as XCascadeNode[];
  }

  nodeClick(node: XCascadeNode) {
    const level = Number(node.level);
    this.ngZone.run(() => {
      if (node.leaf) {
        if (this.nodes.length === level) {
          this.nodes = [...this.nodes, node.children] as XCascadeNode[][];
          this.selecteds = [...this.selecteds, node];
        } else {
          if (this.nodes.length > Number(level) + 1) {
            this.nodes = this.nodes.splice(0, level + 1);
            this.selecteds = this.selecteds.splice(0, level + 1);
          }
          this.nodes[level + 1] = node.children as XCascadeNode[];
          this.selecteds[level] = node;
        }
        this.values = this.selecteds.map((x) => x.id);
        this.cdr.detectChanges();
      } else {
        if (this.selecteds.length >= level + 1) {
          this.selecteds = this.selecteds.splice(0, level);
        }
        this.selecteds = [...this.selecteds, node];
        this.nodeEmit({
          node: node,
          label: this.selecteds.map((x) => x.label).join(` / `)
        });
      }
    });
  }
}
