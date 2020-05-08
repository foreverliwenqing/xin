import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404ComponentPage } from './page404-component.page';

const routes: Routes = [
  {
    path: '',
    component: Page404ComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Page404ComponentPageRoutingModule {}
