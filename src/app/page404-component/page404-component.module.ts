import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Page404ComponentPageRoutingModule } from './page404-component-routing.module';

import { Page404ComponentPage } from './page404-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Page404ComponentPageRoutingModule
  ],
  declarations: [Page404ComponentPage]
})
export class Page404ComponentPageModule {}
