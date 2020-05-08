import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecelistPageRoutingModule } from './recelist-routing.module';

import { RecelistPage } from './recelist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecelistPageRoutingModule
  ],
  declarations: [RecelistPage]
})
export class RecelistPageModule {}
