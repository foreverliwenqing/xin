import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//custom
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from './services/common.service';
import { StorageService } from './services/storage.service';
import { CartService } from './services/cart.service';
// import { Tab3Page } from './tab3/tab3.page';
// import { Tab3PageModule } from './tab3/tab3.module';

// import { Device } from '@ionic-native/device/ngx';
// import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
    // Tab3Page
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    // Tab3PageModule,
    IonicModule.forRoot({
    mode: 'ios',//统一ios样式
    backButtonText: '返回'//统一默认返回按钮文字
  }), AppRoutingModule, HttpClientModule, ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonService,
    StorageService,
    CartService,
    // Device,
    // AppMinimize,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
