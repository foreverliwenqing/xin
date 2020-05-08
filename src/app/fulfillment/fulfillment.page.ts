import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-fulfillment',
  templateUrl: './fulfillment.page.html',
  styleUrls: ['./fulfillment.page.scss'],
})
export class FulfillmentPage implements OnInit {

  public returnUrl = '';
  public ordernum = '';
  public phone = '';
  public orderdata:any = {};
  public orderdece:any = {};
  public domain;
  public remarks;

  constructor(
    public routers: ActivatedRoute,
    public navi: NavController,
    public alerts: AlertController,
    public storage: StorageService,
    public http: CommonService
  ) { }

  ngOnInit() {
    this.domain = this.http.config.domain;
  }

  ionViewDidEnter() {
    this.routers.queryParams.subscribe((res) => {
      this.returnUrl = res.returnUrl;
      this.ordernum = res.ordernum;
      this.phone = res.phone;
    })
    this.getOrderData();
  }

  async showRemark() {
    const alert = await this.alerts.create({
      message: this.remarks,
      buttons: ['OK']
    });

    await alert.present();
  }

  //获取订单数据
  getOrderData() {
    var orderlist = this.storage.get('allOrderList');
    
    for (var i = 0; i < orderlist.length;i++) {
      if (this.phone == orderlist[i].orderdece.phone && this.ordernum == orderlist[i].ordernum){
        this.orderdata = orderlist[i];
        this.orderdece = orderlist[i].orderdece;
        this.orderdata['sumfiexd'] = this.orderdata.buysum.toFixed(2);
        this.remarks = this.orderdata.remarks;
      }
    }
  }

  goBack() {
    // this.navi.navigateBack(this.returnUrl);
    this.navi.navigateForward('/tabs/tab1');
  }
}
