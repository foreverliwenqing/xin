import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PcontentPageRoutingModule } from './pcontent-routing.module';

import { PcontentPage } from './pcontent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PcontentPageRoutingModule
  ],
  declarations: [PcontentPage]
})
export class PcontentPageModule {}
