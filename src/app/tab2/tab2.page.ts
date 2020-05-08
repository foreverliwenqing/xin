import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public domain:string;
  public topPx: string = '7px';
  public categoryList: any[] = [];
  public categoryList2: any[] = [];

  private cateChose = 0;//判断正在浏览第几个分类

  constructor(public navi: NavController, public http: CommonService) {
  }

  ngOnInit() {
    this.getCategoryList();
    this.domain = this.http.config.domain;
  }

  ionViewDidEnter() {
    this.getCategoryList();
    this.domain = this.http.config.domain;
  }

  getCategoryList() {
    this.http.ajaxGet('api/pcate').then((res: any) => {
      this.categoryList = res.result;

      this.getCategoryList2(this.categoryList[0]._id);
    })
  }

  /* id: 分类id w: 点击的位数 */
  changeCate(id, w) {
    if (w != this.cateChose) {
      //1. 移动游标位置
      if (w * 44 == 0) {
        this.topPx = '7px';
      } else {
        this.topPx = (w * 44 + 7) + 'px';
      }

      //2. 切换二级分类内容
      this.getCategoryList2(id);

      this.cateChose = w;
    }
  }

  getCategoryList2(cid) {
    //api/pcate?pid=xxx

    this.http.ajaxGet('api/pcate?pid=' + cid).then((res:any) => {
      console.log(res);
      this.categoryList2 = res.result;
    })
  }

  goSearch() {
    this.navi.navigateForward('/search');
  }
}
