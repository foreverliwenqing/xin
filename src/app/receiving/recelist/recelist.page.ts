import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { CommonService } from '../../services/common.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recelist',
  templateUrl: './recelist.page.html',
  styleUrls: ['./recelist.page.scss'],
})
export class RecelistPage implements OnInit {

  public receIsNull = true;
  public receList:any[] = [];
  public userinfo;

  constructor(
    public storage: StorageService,
    public http: CommonService,
    public navi: NavController,
    public toast: ToastController
  ) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    var userinfo = this.storage.get('userinfo');
    this.userinfo = userinfo;

    if (!userinfo || !userinfo.username){
      //未登录
      this.changeDefault();
      this.getStorageDece();
    }else{
      //已登录
      this.getDeceList();
    }
  }

  //未登录
  getStorageDece() {
    //decelist
    var deceList = this.storage.get('decelist');

    if (deceList && deceList.length > 0){
      this.receList = deceList;
      this.receIsNull = false;
      this.hidePhoneMiddle();
    } else {
      this.receIsNull = true;
    }
  }

  //已登录
  getDeceList() {
    var sign = this.http.getDeceSign({
          uid: this.userinfo._id,
          salt: this.userinfo.salt
        }),
        api = 'api/addressList?uid=' + this.userinfo._id + '&sign=' + sign;
    
    this.http.ajaxGet(api).then((res:any) => {
      if (res.success){
        this.receList = res.result;
        this.hidePhoneMiddle();
        res.result.length > 0 ? this.receIsNull = false : this.receIsNull = true;
      }else{
        this.codeTip(res.msg);
      }
    })
  }

  //点击收货管理位置跳回下单页并将收货信息显示
  choseNowDece(k) {
    //已登录和未登录
    this.storage.set('nowdecechose',this.receList[k]);

    this.navi.navigateBack('/checkout');
  }

  //气泡
  async codeTip(msg) {
    const toasts = await this.toast.create({
      message: msg,
      duration: 2000,
      cssClass: 'coder'
    })
    toasts.present();
  }

  //隐藏手机号码中间四位
  hidePhoneMiddle() {
    for (var i = 0; i < this.receList.length; i++) {
      this.receList[i].phonehide = this.receList[i].phone.substr(0, 3) + '****' + this.receList[i].phone.substr(7);
    }
  }

  //默认地址改变方法 (本地)
  changeDefault() {
    //判断本地缓存中是否存在默认列表 将最后的uptime作为默认地址
    var deceList = this.storage.get('decelist'), tmpTime = 0, fkey, haveDefault = false;
    console.log(deceList);
    if (deceList && deceList.length > 0) {
      for (var i = 0; i < deceList.length; i++){
        if (deceList[i].default_address){//判断是否存在默认地址
          haveDefault = true;
        }
        if (deceList[i].uptime > tmpTime){
          tmpTime = deceList[i].uptime;
          fkey = i;
        }
      }

      if (!haveDefault){
        deceList[fkey].default_address = true;
        this.storage.set('decelist', deceList);
      }
    }
  }
}
