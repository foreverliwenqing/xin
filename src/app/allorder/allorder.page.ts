import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.page.html',
  styleUrls: ['./allorder.page.scss'],
})
export class AllorderPage implements OnInit {

  public allOrderIsNull = true;
  public allOrderList:any[] = [];
  public domain;
  constructor(
    public storage: StorageService,
    public http: CommonService,
    public navi: NavController,
    public alerts: AlertController,
    public loadings: LoadingController
  ) { }

  ngOnInit() {
    this.domain = this.http.config.domain;
  }
  // 当进入页面时触发
  ionViewDidEnter() {
    this.allOrderList = this.storage.get('allOrderList');

    if (this.allOrderList && this.allOrderList.length > 0) {
      this.allOrderIsNull = false;
      for (var i = 0; i < this.allOrderList.length; i++) {
        this.allOrderList[i].localtime = this.getLocalTime(this.allOrderList[i].paytime);
      }
    }
  }

  goFulfillment(phone, ordernum) {
    //跳转到订单完成页面
    this.navi.navigateForward(['/fulfillment'], {
      queryParams: {
        returnUrl: '/allorder',
        ordernum: ordernum,
        phone: phone
      }
    });
  }

  //删除此订单弹出选中框
  async removeOrder(e, orderNum) {
    e.stopPropagation(); 
    const alert = await this.alerts.create({
      header: "Are you sure",
      buttons: [
        {
          text: "Cancle"
        },
        {
          text: "Commit",
          handler: (blah) => {
            this.getMove(orderNum);
          }
        }
      ]
    });
    await alert.present();
  }
  async getMove(orNum) {
    this.allOrderList = this.storage.get('allOrderList');
    for(let i = 0; i < this.allOrderList.length; i++) {
      if(orNum == this.allOrderList[i].ordernum) {

        let loading = await this.loadings.create({
          message: 'Order submission',
          duration: 1000,
          translucent: true,
          spinner: 'circles'
        });
        await loading.present();
        this.allOrderList.splice(i, 1);
        this.storage.set("allOrderList", this.allOrderList);
        let arrFlag = this.storage.get("allOrderList");
        if(arrFlag.length) {
          this.allOrderIsNull = false;
        } else {
          this.allOrderIsNull = true;
        }
      }
    }
  }

  //再来一单
  buyAgain(e) {
    e.stopPropagation();
    this.navi.navigateForward(['/tabs/tab1']);
  }

  getLocalTime(nS) { 
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/下午/g,"").replace(/上午/g,'');
  } 
}
