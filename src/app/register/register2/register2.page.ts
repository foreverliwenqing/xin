import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss'],
})
export class Register2Page implements OnInit {

  public valCodeMsg:any;
  public countDown:number = 10;
  public resendBtn:any = false;
  public readCode:any;

  constructor(public navi: NavController, public http:CommonService, public storage:StorageService, public toast:ToastController) { }

  ngOnInit() {
    this.downTimers();
    this.valCodeMsg = this.storage.get('valCode');
  }

  //倒计时定时器
  downTimers() {
    var times = setInterval(() => {
      if (this.countDown == 1){
        clearInterval(times);
        this.countDown = 10;
        this.resendBtn = true;
      }else{
        this.countDown--;
      }
    },1000)
  }

  //重新发送验证码
  resendCode() {
    var api = 'api/sendCode';
    
    this.http.ajaxPost(api, {"tel": this.valCodeMsg.tel}).then((res:any) => {
      if (res.success){
        console.log(res);
        this.storage.set('valCode',{'tel': this.valCodeMsg.tel, 'code': res.code});
        // this.codeTip(res.message);
        this.resendBtn = true;
        this.valCodeMsg = this.storage.get('valCode');
        this.readCode = '';
        this.codeTip('测试code:' + res.code);
      }else{
        this.codeTip('发送验证码失败 ' + res.message);
      }
    })
  }

  //验证验证码是否正确
  validateCode(){
    var api = 'api/validateCode';
    
    this.http.ajaxPost(api, {"code": this.readCode, "tel": this.valCodeMsg.tel}).then((res:any) => {
      console.log(res);
      this.codeTip(res.message);
      if (res.success){
        this.navi.navigateForward('/register3');
      }
    })
  }

  //验证码相关信息气泡
  async codeTip(msg){
    const toasts = await this.toast.create({
      message: msg,
      duration: 3000,
      cssClass: 'coder'
    })
    toasts.present();
  }
  goBack() {
    this.navi.navigateForward('/register1');
  }

}
