import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddrecePage } from './addrece.page';

const routes: Routes = [
  {
    path: '',
    component: AddrecePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddrecePageRoutingModule {}
