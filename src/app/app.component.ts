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
  public imgUrl: any;
  public faceBookCode = "669843470228028";
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private toast: ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    this.imgUrl = 'https://www.facebook.com/tr?id=' + this.faceBookCode + '&ev=PageView&noscript=1';
    // !function (f, b, e, v, n, t, s) {
    //   if (f.fbq) return; n = f.fbq = function () {
    //     n.callMethod ?
    //       n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    //   };
    //   if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    //   n.queue = []; t = b.createElement(e); t.async = !0;
    //   t.src = v; s = b.getElementsByTagName(e)[0];
    //   s.parentNode.insertBefore(t, s)
    // } (window, document, 'script',
    //   'https://connect.facebook.net/en_US/fbevents.js');
    // fbq('init', this.faceBookCode);
  }

  // async miniApp() {
  //   const toast = await this.toast.create({
  //     message: 'tips: Press again to quit',
  //     duration: 1000,
  //     cssClass: 'quitTip'
  //   });
  //   toast.present();
  // }
}