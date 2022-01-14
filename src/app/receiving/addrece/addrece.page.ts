import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-addrece',
  templateUrl: './addrece.page.html',
  styleUrls: ['./addrece.page.scss'],
  animations: [
    trigger('controlAni', [
      state('show', style({
        background: 'rgba(0,0,0,.3)',
        display: 'block'
      })),
      state('hide', style({
        background: 'rgba(0,0,0,0)',
        display: 'none'
      })),
      state('modalShow', style({
        bottom: '0',
        display: 'block'
      })),
      state('modalHide', style({
        bottom: '-60%',
        display: 'none'
      })),
      state('attrModalShow', style({
        bottom: '0',
        display: 'block'
      })),
      state('attrModalHide', style({
        bottom: '-85%',
        display: 'none'
      })),
      transition('show => hide', [
        animate('.3s')
      ]),
      transition('hide => show', [
        animate('.1s')
      ]),
      transition('modalShow => modalHide', [
        animate('.3s')
      ]),
      transition('modalHide => modalShow', [
        animate('.2s')
      ]),
      transition('attrModalShow => attrModalHide', [
        animate('.3s')
      ]),
      transition('attrModalHide => attrModalShow', [
        animate('.2s')
      ])
    ])
  ]
})
export class AddrecePage implements OnInit {
  //由于逻辑不同 所以默认地址目前不做修改 待后期后端接口完善后修复

  public receInfo: any = {
    'username': '',
    'gender': 'sir',
    'phone': '',
    'address': '',
    'housenumber': '',
    'email': '',
    'default_address': false
  };
  public isLogin = false;
  public showDelBtn = false;
  public userinfo: any;
  public isEdit = false;      //是否为编辑 控制title
  public receListMax = 20;    //收货地址列表最大容量 TODO

  public maskShow = false;             //是否显示遮罩层
  public cityShow = false;          //是否展示城市选项
  constructor(
    public actives: ActivatedRoute,
    public storage: StorageService,
    public navi: NavController,
    public toast: ToastController,
    public http: CommonService,
    public alerts: AlertController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.storage.get('userinfo')) {
      this.isLogin = true;
      this.userinfo = this.storage.get('userinfo');
    }
    // this.actives.queryParams.subscribe((res: any) => {
    //   console.log(res);
    // })

    this.actives.queryParams.subscribe((res: any) => {
      var nowRece = res;
      console.log(res);
      //存在参数则为编辑 给参数赋值
      //这里本地与服务器的变量名不一致 后期统一

      if (this.isLogin) {
        if (nowRece && nowRece.name) {
          this.isEdit = true;
          this.showDelBtn = true;

          this.receInfo.username = nowRece.name;
          this.receInfo.gender = 'lady';
          this.receInfo.phone = nowRece.phone;
          this.receInfo.address = nowRece.address;
          this.receInfo.housenumber = '无';
          this.receInfo.email = '无';
          this.receInfo._id = nowRece._id;
          this.receInfo.uid = nowRece.uid;
          nowRece.default_address == 1 ? this.receInfo.default_address = true : this.receInfo.default_address = false;
        }
      } else {
        if (nowRece && nowRece.username) {
          this.isEdit = true;
          this.showDelBtn = true;

          this.receInfo.username = nowRece.username;
          this.receInfo.gender = nowRece.gender;
          this.receInfo.phone = nowRece.phone;
          this.receInfo.address = nowRece.address;
          this.receInfo.housenumber = nowRece.housenumber;
          this.receInfo.email = nowRece.email;
          this.receInfo._id = nowRece._id;
          this.receInfo.uid = nowRece.uid;
          this.receInfo.uptime = nowRece.uptime;
          nowRece.default_address == 'true' ? this.receInfo.default_address = true : this.receInfo.default_address = false;
        }
      }

    })
  }
  // 隐藏遮罩层
  maskHidn() {
    console.log(1);
    this.maskShow  = !this.maskShow;
  }
  //地址保存分为两种 一种是未登录 保存在本地 第二种是已登录保存在服务器
  //一种特殊情况 已经在本地保存收货地址 登录后需要将本地的数据发送到服务器上保存

  //添加验证
  addDeceVal() {
    let regPhone = /^[1-9]\d{7,11}$/;
    let regEmail = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    for (var v in this.receInfo) {
      if (typeof this.receInfo[v] == 'string') {
        this.receInfo[v].replace(/</, "");
        this.receInfo[v].replace(/>/, '');
        this.receInfo[v].replace(/\?/, '');
        this.receInfo[v].replace(/script/, '');
      }
    }

    if (this.receInfo.username == '') {
      this.codeTip('Username');
      return false;
    }

    if (this.receInfo.gender == '') {
      this.codeTip('Gender');
      return false;
    }
    if (this.receInfo.phone == '') {
      this.codeTip('Phone');
      return false;
    } else if(!regPhone.test(this.receInfo.phone)) {
      this.codeTip('The phone is error');
      return false;
    }
    if (this.receInfo.address == '') {
      this.codeTip('Address');
      return false;
    }

    if (this.receInfo.housenumber == '') {
      this.codeTip('请输入正确的门牌号');
      return false;
    }

    if (this.receInfo.email == '') {
      this.codeTip('Email');
      return false;
    } else if(!regEmail.test(this.receInfo.email)) {
      this.codeTip('The email is error');
      return false;
    }

    if (this.isLogin) {
      this.addAddressIsLogin();
    } else {
      this.addAddressNoLogin();
    }
  }

  //未登录保存地址
  addAddressNoLogin() {
    if (this.receInfo.default_address) {
      this.receListAllFalse();//清除默认地址
    }

    var deceList = this.storage.get('decelist');
    this.receInfo['addtime'] = new Date().getTime();
    this.receInfo['uptime'] = new Date().getTime();
    this.receInfo['_id'] = this.generateReceId() + new Date().getTime().toString();

    if (deceList && deceList.length > 0) {
      deceList.push(this.receInfo);
    } else {
      deceList = [];
      deceList.push(this.receInfo);
    }

    this.storage.set('decelist', deceList);
    this.codeTip('Add address successfully');
    // 添加地址完成后返回地址列表
    this.navi.back();
  }

  //已登录保存地址
  addAddressIsLogin() {
    var api = 'api/addAddress',
      sendJson = {};

    sendJson = {
      uid: this.userinfo._id,
      name: this.receInfo.username + this.receInfo.gender,
      phone: this.receInfo.phone,
      address: this.receInfo.address + this.receInfo.housenumber,
      salt: this.userinfo.salt
    };

    var sign = this.http.getDeceSign(sendJson);
    sendJson['sign'] = sign;
    delete sendJson['salt'];

    this.http.ajaxPost(api, sendJson).then((res: any) => {
      if (res.success) {
        this.codeTip('Add address successfully');
        this.navi.back();
      } else {
        this.codeTip(res.msg);
      }
    })
  }

  //修改默认地址 api/changeDefaultAddress post uid id sign

  //删除地址
  async removeNowRece() {
    const alert = await this.alerts.create({
      message: 'Are you sure to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Comfirm',
          handler: () => {
            if (this.isLogin) {
              //已登录
              this.doRemoveRece();
            } else {
              //未登录
              this.doRemoveLocalRece();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //保存编辑地址
  saveNowRece() {
    if (this.isLogin) {
      //已登录
      this.doChangeDefault();
    } else {
      //未登录
      this.doChangeLocalRece();
    }
  }

  //提交修改默认地址
  doChangeDefault() {
    // post uid sign id name phone address
    var editApi = 'api/editAddress',
      sign,
      editDece = {
        id: this.receInfo._id,
        uid: this.receInfo.uid,
        name: this.receInfo.username,
        phone: this.receInfo.phone,
        address: this.receInfo.address + this.receInfo.housenumber,
        salt: this.userinfo.salt
      };

    sign = this.http.getDeceSign(editDece);
    delete editDece['salt'];
    editDece['sign'] = sign;

    this.http.ajaxPost(editApi, editDece).then((res: any) => {
      if (res.success) {
        this.codeTip('保存地址成功');
        this.navi.navigateBack('/recelist');
      } else {
        this.codeTip(res.msg);
      }
    })
  }

  //本地修改默认地址
  doChangeLocalRece() {
    if (this.receInfo.default_address) {
      this.receListAllFalse();//清除默认地址
    }

    var deceList = this.storage.get('decelist');
    var fkey:any;

    for (var i = 0; i < deceList.length; i++) {
      if (this.receInfo._id == deceList[i]._id) {
        fkey = i;
      }
    }

    let regPhone = /^[1-9]\d{7,11}$/;
    let regEmail = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    for (var v in this.receInfo) {
      if (typeof this.receInfo[v] == 'string') {
        this.receInfo[v].replace(/</, "");
        this.receInfo[v].replace(/>/, '');
        this.receInfo[v].replace(/\?/, '');
        this.receInfo[v].replace(/script/, '');
      }
    }

    if (this.receInfo.username == '') {
      this.codeTip('Username');
      return false;
    }

    if (this.receInfo.gender == '') {
      this.codeTip('Gender');
      return false;
    }
    if (this.receInfo.phone == '') {
      this.codeTip('Phone');
      return false;
    } else if(!regPhone.test(this.receInfo.phone)) {
      this.codeTip('The phone is error');
      return false;
    }

    if (this.receInfo.address == '') {
      this.codeTip('Address');
      return false;
    }

    if (this.receInfo.housenumber == '') {
      this.codeTip('请输入正确的门牌号');
      return false;
    }

    if (this.receInfo.email == '') {
      this.codeTip('Email');
      return false;
    } else if(!regEmail.test(this.receInfo.email)) {
      this.codeTip('The email is error');
      return false;
    }

    if (this.isLogin) {
      this.addAddressIsLogin();
    } else {
      this.addAddressNoLogin();
    }
    
    deceList.splice(fkey, 1, this.receInfo);

    this.receInfo['uptime'] = new Date().getTime();

    this.storage.set('decelist', deceList);
    this.codeTip('Edit successfully');
    this.navi.navigateBack('/recelist');
  }

  //提交删除地址
  doRemoveRece() {
    var delApi = 'api/deleteAddress',
      sign,
      delDece = {
        id: this.receInfo._id,
        uid: this.receInfo.uid,
        salt: this.userinfo.salt
      };

    sign = this.http.getDeceSign(delDece);
    delete delDece['salt'];
    delDece['sign'] = sign;

    this.http.ajaxPost(delApi, delDece).then((res: any) => {
      if (res.success) {
        this.codeTip('删除成功');
        this.navi.navigateForward('/recelist');
      } else {
        this.codeTip(res.msg);
      }
    })
  }

  //本地地址删除
  doRemoveLocalRece() {
    var deceList = this.storage.get('decelist'),
      fkey;

    for (var i = 0; i < deceList.length; i++) {
      if (this.receInfo._id == deceList[i]._id) {
        fkey = i;
      }
    }

    deceList.splice(fkey, 1);

    this.storage.set('decelist', deceList);
    this.codeTip('删除成功');
    this.navi.navigateForward('/recelist');
  }

  //将地址列表的默认地址全部改为false
  receListAllFalse() {
    var deceList = this.storage.get('decelist');

    if (deceList && deceList.length > 0) {
      for (var i = 0; i < deceList.length; i++) {
        deceList[i].default_address = false;
      }

      this.storage.set('decelist', deceList);
    }
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
  //生成id
  ionViewWillEnter() {
    this.generateReceId();
  }
  generateReceId() {
    return Math.random().toString(36).substr(2, 4);
  }

}
