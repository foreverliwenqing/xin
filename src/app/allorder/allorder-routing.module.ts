import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllorderPage } from './allorder.page';

const routes: Routes = [
  {
    path: '',
    component: AllorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllorderPageRoutingModule {}
