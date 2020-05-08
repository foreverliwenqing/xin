import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecelistPage } from './recelist.page';

const routes: Routes = [
  {
    path: '',
    component: RecelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecelistPageRoutingModule {}
