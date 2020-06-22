import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CartService } from '../services/cart.service';
import { CommonService } from '../services/common.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  //购物车后期将前后存储位置分离 分为已登录和未登录

  public cartList: any[] = [];
  public domain;
  public cartSum: any = 0.00;
  public isNull = false;               //购物车是否为空
  public isCheckAll: any = false;       //是否全选

  constructor(
    public storage: StorageService,
    public common: CommonService,
    public cart: CartService,
    public alerts: AlertController,
    public navi: NavController,
    public toast: ToastController
  ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    var cartList = this.storage.get('cartList');
    this.getCartList();
    if (cartList && cartList.length > 0) {
      this.cartSum = this.cart.getCarSum(cartList);
      this.domain = this.common.config.domain;
      this.reLoadCartCheck();
      this.isNull = false;
    } else {
      this.isNull = true;
    }
  }
  //页面进入时获取所有选中的商品值
  ionViewDidEnter() {
    var cartList = this.storage.get('cartList');
    this.getCartList();
    if (cartList && cartList.length > 0) {
      this.cartSum = this.cart.getCarSum(cartList);
      this.domain = this.common.config.domain;
      this.reLoadCartCheck();
      this.isNull = false;
    } else {
      this.isNull = true;
    }

  }

  //购物车加减
  cartReduce(key, item) {
    if (item.pro_count > 1) {
      item.pro_count--;
    } else {
      //Todo 移除产品(当数量减小到0时执行删除localstorage)
      this.removeProFroCart(key);
    }
    this.reLoadCart();
  }
  cartNumAdd(item) {
    item.pro_count++;
    this.reLoadCart();
  }
  //选择产品
  cartCheck(item) {
    !item.ischeck;
    this.reLoadCartCheck();
    this.reLoadCart();
  }

  //获取购物车列表
  getCartList() {
    this.cartList = this.storage.get('cartList');
  }

  //全选反选
  checkAllNone() {
    if (this.isCheckAll == true) {
      for (var i = 0; i < this.cartList.length; i++) {
        this.cartList[i].ischeck = true;
      }
    } else {
      for (var i = 0; i < this.cartList.length; i++) {
        this.cartList[i].ischeck = false;
      }
    }

    this.reLoadCartCheck();
  }

  //删除弹框
  async removeProFroCart(key) {
    const alert = await this.alerts.create({
      message: '<strong>Are you sure?<strong>',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Comfirm',
          handler: () => {
            this.cartList.splice(key, 1);
            this.storage.set('cartList', this.cartList);
            this.reLoadCart();
          }
        }
      ]
    });

    await alert.present();
  }

  //清空购物车
  async clearCart() {
    const alert = await this.alerts.create({
      // header: 'Confirm!',
      message: '<strong>Confirm empty shopping cart?<strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'True',
          handler: () => {
            this.storage.set('cartList', []);
            this.cartList = [];
            this.reLoadCart();
          }
        }
      ]
    });

    await alert.present();
  }

  //重置购物车合计
  reLoadCart() {
    this.cartSum = this.cart.getCarSum(this.cartList);
    this.cartList.length >= 1 ? '' : this.isNull = true;
  }
  //重置购物车选中
  reLoadCartCheck() {
    console.log(this.cartList);
    console.log(this.cart.getCartCheckNum(this.cartList));
    if (this.cartList.length == this.cart.getCartCheckNum(this.cartList)) {
      this.isCheckAll = true;
    } else {
      this.isCheckAll = false;
    }
  }

  //去结算(添加ischeck)
  goCheckOut() {
    var tmpCheckArr = [];

    for (var i = 0; i < this.cartList.length; i++) {
      if (this.cartList[i].ischeck) {
        tmpCheckArr.push(this.cartList[i]);
      }
    }
    if (tmpCheckArr.length > 0) {
      this.storage.set('cartList', this.cartList);//监听事件无效 此处先保存做临时方案
      this.storage.set('checkoutlist', tmpCheckArr);
      this.navi.navigateForward(['/checkout'], {
        queryParams: {
          returnUrl: '/tabs/tab3'
        }
      });
    } else {
      this.codeTip('Unselected product');
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


  // 下拉加载
  doRefresh(event) {
    console.log(event);
    setTimeout(() => {
      event.target.complete();
      this.storage.get('cartList');
    }, 1000);
  }
}
