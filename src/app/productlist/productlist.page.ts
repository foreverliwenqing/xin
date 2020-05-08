import { Component, OnInit, ViewChild} from '@angular/core';
import { NavController, IonContent} from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.page.html',
  styleUrls: ['./productlist.page.scss'],
})
export class ProductlistPage implements OnInit {

  @ViewChild(IonContent, {static: false}) procontent: IonContent;

  public domain = this.http.config.domain; //域名
  public productList:any[] = []; //产品列表
  public cid:any; //分类id
  public npage:number = 1; //分页码
  public subHeaderList:any[] = [];//排序筛选选择列表
  public subHeaderChosedid:any = 0;//排序筛选被选中状态的id
  public infiniteOpen = true;

  constructor(public http: CommonService, public navi:NavController, public routers:ActivatedRoute) {
    this.routers.queryParams.subscribe((res) => {
      this.cid = res.cid;
    })

    this.subHeaderList = [
      {
        id: 1,
        title: 'Complete',
        fields: 'all',
        sort: -1 //升序{price: 1} 降序{price: -1}
      },
      {
        id: 2,
        title: 'Sales',
        fields: 'salecount',
        sort: -1
      },
      {
        id: 3,
        title: 'Price',
        fields: 'price',
        sort: -1
      }
    ]
  }

  ngOnInit() {
    this.getProductList('');
  }

  getProductList(e) {
    var api = 'api/plist?cid=' + this.cid + '&page=' + this.npage + '&sort=' + this.subHeaderList[this.subHeaderChosedid].fields + '_' + this.subHeaderList[this.subHeaderChosedid].sort;

    this.http.ajaxGet(api).then((res:any) => {
      this.productList = this.productList.concat(res.result);

      this.npage++;

      e ? e.target.complete() : '';

      if (res.result.length < 10){
        // e ? e.target.disabled = true : '';
        this.infiniteOpen = false;
      }
    })
  }

  goBack() {
    this.navi.back();
  }

  changeSubHeader(k) {
    if (k == this.subHeaderChosedid) {
      this.subHeaderList[k].sort *= -1;
    }

    this.subHeaderChosedid = k;

    //重置列表
    this.npage = 1;
    this.productList = [];
    this.procontent.scrollToTop(0);//回到顶部
    this.getProductList(null);
  }

  doSearch() {

  }
}
