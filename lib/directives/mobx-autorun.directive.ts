import { Directive, ViewContainerRef, TemplateRef, HostListener, Renderer } from '@angular/core';
import { autorunAsync } from 'mobx';
import { ng2MobxDebug } from '../utils/ng2-mobx-debug';

@Directive({ selector: '[mobxAutorun]' })
export class MobxAutorunDirective {
  protected templateBindings = {};
  protected dispose:any;
  protected view:any;

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected renderer:Renderer) {
      this.view = this.viewContainer.createEmbeddedView(this.templateRef);
    }

  ngAfterViewInit() {
    if (this.dispose) this.dispose();

    this.autoDetect(this.view);
    ng2MobxDebug(this.view, this.renderer, this.dispose);
  }

  autoDetect(view) {
    this.dispose = autorunAsync(() => {
      view["detectChanges"]();
    });
  }

  ngOnDestroy() {
    if (this.dispose) this.dispose();
  }
}
