import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CommonService } from '../../services/common.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register1',
  templateUrl: './register1.page.html',
  styleUrls: ['./register1.page.scss'],
})
export class Register1Page implements OnInit {

  public phonehead:any = '971';
  public phones:any;

  constructor(public navi:NavController, public http:CommonService, public toast:ToastController, public storage:StorageService) { }

  ngOnInit() {
  }

  //获取验证码
  getCode() {
    if (/^[1-9][0-9]*$/.test(this.phones)){
      console.log(this.phones);
      var api = 'api/sendCode';
      this.http.ajaxPost(api, {"tel":this.phonehead + this.phones}).then((res:any) => {
        if (res.success){
          this.storage.set('valCode',{'tel': this.phonehead + this.phones, 'code': res.code});
          this.codeTip('测试code:' + res.code);
          this.navi.navigateForward('/register2');
        }else{

          this.codeTip('SMS verification failed ' + res.message);
        }
      })
    }else{
      this.codeTip('Phone format error');
    }
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

  goBack(){

    this.navi.navigateForward('/login');
  }

}
