import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddrecePageRoutingModule } from './addrece-routing.module';

import { AddrecePage } from './addrece.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddrecePageRoutingModule
  ],
  declarations: [AddrecePage]
})
export class AddrecePageModule {}
