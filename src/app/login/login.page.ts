import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';
import { EventemitterService } from '../services/eventemitter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public returnUrl;
  public userInfo: any = {
    'username': '',
    'password': ''
  }

  constructor(
    public navi: NavController, 
    public toast: ToastController, 
    public http: CommonService, 
    public storage: StorageService,
    public eventemitter: EventemitterService,
    public actives: ActivatedRoute
    ) { }

  ngOnInit() {
    this.actives.queryParams.subscribe((res) => {
      res.returnUrl ? this.returnUrl = res.returnUrl : this.returnUrl = '/tabs/tab4';
    })
  }

  doLogin() {
    var usernameRegular = /^[a-zA-Z0-9_-]{4,16}$/,
      passwordRegular = /[a-zA-Z0-9\W_!@#$%^&*`~()]{6,30}/;
    
    if (!usernameRegular.test(this.userInfo.username)) {
      this.codeTip('User name format error!');
      return;
    }
    if (!passwordRegular.test(this.userInfo.password)) {
      this.codeTip('wrong password!');
      return;
    }

    this.http.ajaxPost('api/doLogin', { username: this.userInfo.username, password: this.userInfo.password }).then((res:any) => {
      if (res.success) {
        this.storage.set('userinfo', res.userinfo[0]);
        this.codeTip(res.message);
        this.eventemitter.eventE.emit('useraction');//通知登录页面改变信息
        this.navi.navigateRoot(this.returnUrl);
      } else {
        this.codeTip(res.message);
      }
    })
  }

  goBack() {
    this.navi.navigateForward(this.returnUrl);
  }
  //验证码相关信息气泡
  async codeTip(msg) {
    const toasts = await this.toast.create({
      message: msg,
      duration: 2000,
      cssClass: 'coder'
    })
    toasts.present();
  }
}
