import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent, AlertController } from '@ionic/angular';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild(IonContent, { static: false }) searchContent: IonContent;

  public searchFlag = false;              //判断是历史栏还是搜索栏
  public searchList: any[] = [];           //搜索结果列表
  public keyWords: string;                 //搜索关键字
  public domain: string;                   //API域名
  public subHeaderList: any[] = [];        //可筛选栏按钮
  public npage: number = 1;                //分页码
  public subHeaderChosedid: any = 0;       //排序筛选被选中状态的id
  public infiniteOpen = true;             //是否打开滚动分页

  public historyList: any[] = [];         //历史记录列表
  public historyListMax = 10;             //历史记录缓存最大容量

  constructor(public navi: NavController, public http: CommonService, public storage: StorageService, public alertcontroller: AlertController) {
    this.domain = this.http.config.domain;

    this.subHeaderList = [
      {
        id: 1,
        title: 'complex',
        fields: 'all',
        sort: -1 //升序{price: 1} 降序{price: -1}
      }, { id: 2, title: 'Sales', fields: 'salecount', sort: -1 }, { id: 3, title: 'price', fields: 'price', sort: -1 }
    ]
  }

  ngOnInit() {
    this.getHistoryList();
  }

  goBack() {
    this.navi.back();
    // this.navi.navigateBack();
  }

  //执行搜索
  doSearch() {
    if(this.keyWords){
      this.getSearchList('');
      this.setHistoryList();
      this.searchFlag = true;
    }
  }

  //获取搜索列表
  getSearchList(e) {
    var api = 'api/plist?search=' + this.keyWords + '&page=' + this.npage + '&sort=' + this.subHeaderList[this.subHeaderChosedid].fields + '_' + this.subHeaderList[this.subHeaderChosedid].sort;

    this.http.ajaxGet(api).then((res: any) => {
      this.npage++;
      this.searchList = this.searchList.concat(res.result);

      e ? e.target.complete() : '';

      if (res.result.length < 10) {
        // e ? e.target.disabled = true : '';
        this.infiniteOpen = false;
      }
    })
  }

  //筛选栏点击
  changeSubHeader(k) {
    if (k == this.subHeaderChosedid) {
      this.subHeaderList[k].sort *= -1;
    }

    this.subHeaderChosedid = k;

    //重置列表
    this.infiniteOpen = true;
    this.npage = 1;
    this.searchList = [];
    this.searchContent.scrollToTop(0);//回到顶部
    this.getSearchList(null);
  }

  /*****************   搜索历史   *****************/

  //存储搜索历史栏
  setHistoryList() {

    var theHistoryList = this.storage.get('allHistoryList');

    if (theHistoryList) {
      //存在则先验证关键字是否存在于数组 不存在则覆盖
      if (theHistoryList.indexOf(this.keyWords) == -1) {
        theHistoryList.push(this.keyWords);
        this.historyList = theHistoryList;
        this.storage.set('allHistoryList', theHistoryList);
        this.killMax();
      }

    } else {
      //不存在则保存
      this.historyList.push(this.keyWords);

      this.storage.set('allHistoryList', this.historyList);
    }
  }

  //获取搜索历史栏
  getHistoryList() {
    if (!this.storage.get('allHistoryList')) {
      this.historyList = [];
    } else {
      this.historyList = this.storage.get('allHistoryList');
    }
  }

  //点击历史记录
  goSearch(val) {
    this.keyWords = val;
    this.doSearch();
  }

  //删除单个历史记录
  async killOne(k) {
    const alert = await this.alertcontroller.create({
      header: 'Please confirm the operation!',
      message: 'confirm deletion<strong>'+ this.historyList[k] +'</strong>!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'confirm',
          handler: () => {
            this.historyList.splice(k, 1);
            this.storage.set('allHistoryList', this.historyList);
          }
        }
      ]
    });

    await alert.present();
  }

  //删除全部记录
  async killAll() {
    const alert = await this.alertcontroller.create({
      header: 'Please confirm the operation!',
      message: 'Are you sure to delete all!',
      backdropDismiss: false,
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'comfirm  ',
          handler: () => {
            this.storage.removeAll('allHistoryList');
            this.historyList = [];
          }
        }
      ]
    });

    await alert.present() ;
  }

  //判断是否超长 截断超长部分
  killMax() {
    if (this.historyList.length > this.historyListMax) {
      this.historyList.shift();
      this.storage.set('allHistoryList', this.historyList);
    }
  }
}
