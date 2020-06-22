import { Component, ViewChild } from '@angular/core';
import { NavController, IonContent, IonRefresher } from '@ionic/angular';

import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('homeslide', { static: true }) homeslide;
  @ViewChild(IonRefresher, { static: true }) refresher: IonRefresher;
  @ViewChild(IonContent, { static: true }) content: IonContent;

  public domainapi: string;
  public proList: any[] = [];
  public slideList: any[] = [];
  public hotList: any[] = [];
  public hotWidth: any;
  // public likeIs = false;
  public params: any[] = []; //点击收藏参数收集
  public slidesOpt = {
    speed: 400,
    autoplay: {
      delay: 2000
    },
    loop: true
  };

  constructor(public navi: NavController, public ajaxg: CommonService) {
    this.domainapi = this.ajaxg.config.domain;
  }

  ngOnInit(): void {
    this.getSlideList();//获取轮播图
    this.getHotList();//获取热门商品
    this.getProList();//获取商品列表
    // fbq('track', 'PageView');
  }

  getSlideList() {
    this.ajaxg.ajaxGet('api/focus').then((res: any) => {
      this.slideList = res.result;
    })
  }

  getHotList() {
    this.ajaxg.ajaxGet('api/plist?is_hot=1').then((res: any) => {
      this.hotList = res.result;
      this.hotWidth = this.hotList.length * 9 + 'rem';
    })
  }

  getProList() {
    this.ajaxg.ajaxGet('api/plist?is_best=1').then(
      (res: any) => {
      for(let i = 0; i< res.result.length; i++) {
        res.result[i]["isLike"] = false;
      }
      this.proList = res.result;
      console.log(this.proList);
    })
  }

  //自定义事件
  slideFunc(o) {
    switch (o) {
      case 'start':
        this.homeslide.startAutoplay();
        break;
    }
  }
  // 下拉加载
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.getProList();
      this.getHotList();
      this.getSlideList();
    }, 1000);
  }

  //跳转
  goSearch() {
    this.navi.navigateForward('/search');
  }
  // 收藏
  Collection(e, id, index) {
    let that = this;
    e.stopPropagation();
    let like = false;
    let dom = document.querySelectorAll(".likeIcon") as NodeListOf<HTMLElement>;
    for(let i = 0; i < dom.length; i++) {
      if(i == index) {
        that.proList[index].isLike = !that.proList[index].isLike;
      }
    }
  }
}
