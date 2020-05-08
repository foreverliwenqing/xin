import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  public returnUrl = '';          //返回地址
  public buyList: any[] = [];      //购买列表
  public domain: any = '';
  public buySum = 0;              //购买合计(价格)
  public buyNum = 0;              //购买合计(数量)
  public isLogin = false;         //是否登录
  public userinfo: any;            //用户信息
  public choseRece: any = {};      //选择的地址
  public showAddReceBtn = false;  //是否显示添加收货地址
  public remarks = '';                 //备注
  public paytype;                 //支付方式

  constructor(
    public actives: ActivatedRoute,
    public navi: NavController,
    public alerts: AlertController,
    public storage: StorageService,
    public http: CommonService,
    public loadings: LoadingController,
    public toast: ToastController   //弹出气泡
  ) { }

  ngOnInit() {
    this.actives.queryParams.subscribe((res) => {
      res.returnUrl ? this.returnUrl = res.returnUrl : this.returnUrl = '/tabs/tab3';
    })
    this.domain = this.http.config.domain;
  }

  ionViewDidEnter() {
    this.getBuyList();
    this.getCheckSum();
    this.isLogin = this.valLogin();
    this.getDefaultDece();
  }

  //获取购买的产品
  getBuyList() {
    this.storage.get('checkoutlist') ? this.buyList = this.storage.get('checkoutlist') : this.navi.navigateForward('/tabs/tab1');
  }

  //获取订单合计
  getCheckSum() {
    this.buySum = 0;
    for (var i = 0; i < this.buyList.length; i++) {
      this.buySum += this.buyList[i].pro_count * this.buyList[i].pro_price;
      this.buyNum += this.buyList[i].pro_count;
    }
  }

  //打开支付中心
  async checkPayType() {
    const alert = await this.alerts.create({
      header: '支付中心',
      inputs: [
        {
          name: 'huodao',
          type: 'radio',
          label: '货到付款',
          value: 'huodao',
          checked: true
        },
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '确定',
          handler: (blah) => {
            this.paytype = blah;
            console.log(blah);
          }
        }
      ]
    });

    await alert.present();
  }

  //打开备注
  async openRemark() {
    const alert = await this.alerts.create({
      header: 'Note',
      inputs: [
        {
          name: 'remarks',
          id: 'remarks',
          type: 'textarea',
          placeholder: 'content',
          value: this.remarks
        },
      ],
      buttons: [
        {
          text: 'comfirm',
          handler: (blah) => {
            this.remarks = blah.remarks;
            console.log(blah);
          }
        }
      ]
    });

    await alert.present();
  }

  //获取默认地址
  getDefaultDece() {
    //如果存在已选择的地址 则该地址的优先级最高
    var choseReces = this.storage.get('nowdecechose');
    if (choseReces) {
      this.showAddReceBtn = false;
      this.choseRece = choseReces;
      return;
    }

    if (this.isLogin) {
      //已登录
      var api = 'api/oneAddressList',
        sign,
        sendJson = {
          uid: this.userinfo._id,
          salt: this.userinfo.salt
        };

      sign = this.http.getDeceSign(sendJson);
      api += '?uid=' + sendJson['uid'] + '&sign=' + sign

      this.http.ajaxGet(api).then((res: any) => {
        if (res.success && res.result.length > 0) {
          this.choseRece = res.result[0];
          this.showAddReceBtn = false;
        } else {
          this.showAddReceBtn = true;
        }
      })

    } else {
      //未登录
      var deceList = this.storage.get('decelist');

      if (deceList && deceList.length > 0) {
        for (var i = 0; i < deceList.length; i++) {
          if (deceList[i].default_address) {
            this.choseRece = deceList[i];
          }
        }

        this.showAddReceBtn = false;
      } else {
        //判断缓存中的地址列表是否为空
        this.showAddReceBtn = true;
      }
    }
  }

  //判断是否登录
  valLogin() {
    this.userinfo = this.storage.get('userinfo');

    if (this.userinfo) {
      return true;
    } else {
      return false;
    }
  }
  goBack() {
    this.navi.navigateBack(this.returnUrl);
  }
  //离开页面清除当前选择的地址
  //离开页面清除会有一个问题 选择收货地址如果直接返回的话 所选的地址会为空
  //如果改成提交订单后清除 这边点击结算后不继续 并且退出登录 此时会有地址缓存出现
  ionViewWillLeave() {
    this.storage.removeAll('nowdecechose');
  }

  //api/doOrder uid sign address phone name all_price (products 序列化商品数据合集 JSON.stringify();)
  // success message result=> order_id, all_price 
  //服务器和本地下单理论上来说可以合并 后台目前没有做 可以先缓存在本地
  async doCheckout() {
    const alert = await this.alerts.create({
      header: 'Confirm order submission',
      buttons: [
        {
          text: 'Cancle',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Comfirm',
          handler: () => {
            // 设置如果地址不存在不能提交订单
            if(this.showAddReceBtn) {
              console.log("地址还没填写啦");
              this.ToastFun();
            } else {
              this.upCheckOrder();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //地址没有填写弹出气泡
  async ToastFun() {
    const toast = await this.toast.create({
      message: 'The address has not been filled in yet',
      duration: 2000
    });
    toast.present();
  }

  //提交订单(清除tab3中已经选中的商品)
  async upCheckOrder() {
    const loading = await this.loadings.create({
      message: 'Order submission',
      duration: 1000,
      translucent: true,
      spinner: 'circles'
    });

    await loading.present();

    //将默认地址和商品信息保存
    //1. 将选择的地址以及商品列表以及如果存在用户id保存至本地全部订单
    // 保存合计 保存备注 保存支付方式 保存下单时间
    var allOrder = this.storage.get('allOrderList'),
      nowOrder: any = {},
      nowStamp = new Date().getTime();

    nowOrder['orderdece'] = this.choseRece;
    nowOrder['buylist'] = this.buyList;
    nowOrder['buysum'] = this.buySum;
    nowOrder['buynum'] = this.buyNum;
    nowOrder['remarks'] = this.remarks;
    nowOrder['paytype'] = this.paytype;
    nowOrder['paytime'] = nowStamp;
    nowOrder['status'] = 1;                    //当前订单状态 1: 订单已提交 2: 订单正在运送 3: 订单已完成

    //判断是否登录 登录存储id
    if (this.isLogin) {
      nowOrder['uid'] = this.userinfo._id;
    }

    //生成订单号
    nowOrder['ordernum'] = this.generateReceId(nowStamp);

    //判断是否存在订单列表
    if (allOrder && allOrder.length > 0) {
      allOrder.push(nowOrder);
    } else {
      allOrder = [];
      allOrder.push(nowOrder);
    }

    //存在缓存中 后期改API
    this.storage.set('allOrderList', allOrder);

    //清除购物车中的此产品
    this.removeCartThis();

    const { role, data } = await loading.onDidDismiss();

    const alert = await this.alerts.create({
      header: 'Successfully ordered'
    });

    await alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 1000);

    //跳转
    this.navi.navigateForward(['/fulfillment'], {
      queryParams: {
        returnUrl: '/tabs/tab1',
        ordernum: nowOrder['ordernum'],
        phone: nowOrder['orderdece'].phone
      }
    });
  }

  //购物车后期要分为两类 服务器 和 本地 demo版统一在本地
  removeCartThis() {
    var cartList = this.storage.get('cartList'), newCart = [];

    for (var i = 0; i < cartList.length; i++) {
      if (!cartList[i].ischeck) {//将未选中的商品存入购物车(已经选中的商品删除)
        newCart.push(cartList[i]);
      }
    }
    this.storage.set('cartList', newCart);
  }

  //生成订单号
  generateReceId(nowStamp) {
    return nowStamp.toString() + Math.random().toString(36).substr(2).toUpperCase();
  }
}
