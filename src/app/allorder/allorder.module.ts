import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllorderPageRoutingModule } from './allorder-routing.module';

import { AllorderPage } from './allorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllorderPageRoutingModule
  ],
  declarations: [AllorderPage]
})
export class AllorderPageModule {}
