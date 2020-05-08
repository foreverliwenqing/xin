import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulfillmentPageRoutingModule } from './fulfillment-routing.module';

import { FulfillmentPage } from './fulfillment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulfillmentPageRoutingModule
  ],
  declarations: [FulfillmentPage]
})
export class FulfillmentPageModule {}
