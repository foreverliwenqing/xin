import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register3',
  templateUrl: './register3.page.html',
  styleUrls: ['./register3.page.scss'],
})
export class Register3Page implements OnInit {

  public codeTel:any;
  public readPass:any;
  public repPass:any;
  public itype = 'password';
  constructor(public navi: NavController, public http:CommonService, public storage:StorageService, public toast:ToastController) { }

  ngOnInit() {
    this.codeTel = this.storage.get('valCode');
  }

  //
  doRegister(){

    if(this.readPass != this.repPass){
      this.codeTip('两次密码输入不一致');
      return;
    }
    if(this.readPass.length < 3){
      this.codeTip('密码长度必须大于等于3位');
      return;
    }

    var api = 'api/register',
        postJson = {
          tel: this.codeTel.tel,
          code: this.codeTel.code,
          password: this.readPass
        };

    this.http.ajaxPost(api,postJson).then((res:any) => {
      if (res.success){
        this.storage.set('userinfo',res.userinfo[0]);
        this.navi.navigateRoot('/tabs/tab4');
      }else{
        this.codeTip('非法操作');
      }
    });
  }

  goBack(){
    this.navi.navigateForward('/register2');
  }
  ischeck(){
    if (this.itype == 'password'){
      this.itype = 'text';
    }else{
      this.itype = 'password';
    }
    console.log(this.itype);
  }
  //验证码相关信息气泡
  async codeTip(msg){
    const toasts = await this.toast.create({
      message: msg,
      duration: 2000,
      cssClass: 'coder'
    })
    toasts.present();
  }
}
