import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { AppMinimize } from '@ionic-native/app-minimize/ngx';

// import VConsole from 'vconsole';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
// var vConsole = new VConsole();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // backButtonPressed = false; // 用于判断返回键是否触发
  // customBackActionSubscription: Subscription;
  // url;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    // private appMini: AppMinimize,
    private router: Router,
    private toast: ToastController
  ) {
    // this.initRouterListen();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // this.registerBackButtonAction();
    });
  }

  // registerBackButtonAction() {
  //   this.customBackActionSubscription = this.platform.backButton.subscribe(() => {
  //     if (this.url === '/tabs'
  //       || this.url === '/tabs/tab1'
  //       || this.url === '/tabs/tab2'
  //       || this.url === '/tabs/tab3'
  //       || this.url === '/tabs/tab4'
  //       ) { // 监测到当前路由，判断是否要退出程序
  //       if (this.backButtonPressed) {
  //         this.appMini.minimize(); // 程序最小化
  //         this.backButtonPressed = false;
  //       } else {
  //         this.miniApp(); // 提示toast
  //         this.backButtonPressed = true;
  //         setTimeout(() => this.backButtonPressed = false, 2000);
  //       }
  //     }
  //   });
  // }

  // initRouterListen() {
  //   this.router.events.subscribe(event => { // 需要放到最后一个执行
  //     if (event instanceof NavigationEnd) {
  //       this.url = event.url;
  //       console.log(this.url);
  //     }
  //   });
  // }

  async miniApp() {
    const toast = await this.toast.create({
      message: 'tips: Press again to quit',
      duration: 1000,
      cssClass: 'quitTip'
    });
    toast.present();
  }
}