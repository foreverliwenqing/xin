import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PcontentPage } from './pcontent.page';

const routes: Routes = [
  {
    path: '',
    component: PcontentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PcontentPageRoutingModule {}
