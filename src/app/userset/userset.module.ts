import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersetPageRoutingModule } from './userset-routing.module';

import { UsersetPage } from './userset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersetPageRoutingModule
  ],
  declarations: [UsersetPage]
})
export class UsersetPageModule {}
