import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { CommonService } from '../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent, ToastController, ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { StorageService } from '../services/storage.service';
// import { Tab3Page } from '../tab3/tab3.page';


@Component({
  selector: 'app-pcontent',
  templateUrl: './pcontent.page.html',
  styleUrls: ['./pcontent.page.scss'],
  animations: [
    trigger('showHideMask', [
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

export class PcontentPage implements OnInit {

  @ViewChild('proslide', { static: false }) proslide;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  //轮播图相关设置
  public slideOpts = {
    speed: 500
  }
  public slideMsg = {
    activeNum: 1,
    allPic: 1
  }
  public maskShow = false;             //是否显示遮罩层
  public modalOpenArr;                 //控制某模态框显示隐藏数组
  public prodata: any = {};            //产品数据
  public domain: string;               //api域名
  public proid: any;                   //产品id
  public buyNum = 1;                   //购买数量
  public cartNum: any;                  //购物车数量统计
  public elContent:any;
  public elBackTop: any;
  public tabFlag: string =  "product";  //默认被选中的tab值
  constructor(
    public http: CommonService,
    public actived: ActivatedRoute,
    public navi: NavController,
    public storage: StorageService,
    public cart: CartService,
    public toast: ToastController,
    public modals: ModalController,
    public elementRef: ElementRef,  //获取元素
    public renderer2: Renderer2,
  ) {
    this.domain = this.http.config.domain;
  }

  ngOnInit() {
    this.elContent = this.elementRef.nativeElement.querySelector('#Content');
    this.elBackTop = this.elementRef.nativeElement.querySelector('.goTop');

    //购物车数量统计
    var carts = this.storage.get('cartList');
    if (carts && carts.length > 0) {
      this.cartNum = this.cart.getCartNum(carts);
    } else {
      this.cartNum = 0;
    }

    //设置模态框的开启关闭状态
    this.modalOpenArr = {
      'activeModalOpen': false,
      'attrModalOpen': false
    }
    this.actived.queryParams.subscribe((res) => {
      if (res.id) {
        this.getProData(res.id);
      } else {
        this.navi.navigateForward('/tabs/tab1');
      }
    })
  }
  ionViewDidEnter() {

    console.log(11)
    this.ionScroll();
    this.actived.queryParams.subscribe((res) => {
      if (res.id) {
        this.getProData(res.id);
      } else {
        this.navi.navigateForward('/tabs/tab1');
      }
    })
  }
  ngAfterViewInit() {
    this.slideMove();//获取轮播图数量
  }

  //获取产品信息
  getProData(id) {
    var api = 'api/pcontent?id=' + id;
    this.http.ajaxGet(api).then((res: any) => {
      if (res) {
        this.prodata = res.result;
      } else {
        this.navi.navigateForward('/tabs/tab1');
      }
    })
  }

  //规格选择
  choseAttr(e) {
    let imgDom = document.querySelector(".clShowImg");

    if (e.srcElement.nodeName == 'SPAN') { //获取点击事件
      var el = e.srcElement,//获取当前点击的span节点
        parent = el.parentNode,//获取当前节点的父节点,
        parents = parent.parentNode,
        attrChildren = parents.children;//通过父节点找到子节点

      for (var i = 0; i < attrChildren.length; i++) {
        attrChildren[i].className = '';
      }
      parent.className = 'actives';

      if(parent.firstChild.nodeName == "IMG") {
        imgDom["src"] = parent.firstChild.getAttribute("src");
      }
    }
  }

  //数量加减
  changeNum(o) {
    if (o == 'add') {
      this.buyNum++;
    } else {
      if (this.buyNum > 1) {
        this.buyNum--;
      }
    }
  }
  // 返回顶部
  goTop(a) {
    this.content.scrollToTop(400);
  }
  //加入购物车弹出模态框
  addCart() {
    this.showAttrTab();
  }
  //加入购物车
  doAddCart() {
    var pro_title = this.prodata['title'],  
      pro_id = this.prodata['_id'],
      pro_pic = this.prodata['pic'],
      pro_price = this.prodata['price'],
      pro_count = this.buyNum,
      pro_attrs: any = '',
      spanActive = document.querySelectorAll('#allattr .actives');

    for (var i = 0; i < spanActive.length; i++) {
      if (i == 0) {
        pro_attrs += spanActive[i].children[0].innerHTML;
      } else {
        pro_attrs += '/' + spanActive[i].children[0].innerHTML;
      }
    }
    var cartJson = {
      pro_attrs,
      pro_title,
      pro_id,
      pro_pic,
      pro_price,
      pro_count,
      ischeck: true
    };

    var cartList = this.storage.get('cartList');

    if (cartList && cartList.length > 0) {
      //购物车有数据
      if (this.cart.hasData(cartList, cartJson)) {
        //已存在当前产品
        for (var i = 0; i < cartList.length; i++) {
          if (cartList[i].pro_id == cartJson.pro_id && cartList[i].pro_attrs == cartJson.pro_attrs) {
            cartList[i].pro_count += cartJson.pro_count;
          }
        }

      } else {
        //不存在当前产品
        cartList.push(cartJson);
      }
      this.storage.set('cartList', cartList);

    } else {
      //购物车无数据
      var tempArr: any[] = [];

      tempArr.push(cartJson);
      this.storage.set('cartList', tempArr);
      cartList = tempArr;
    }

    //重新统计购物车数量
    this.cartNum = this.cart.getCartNum(cartList);
    this.codeTip('Add to Cart successful');
    this.closeModal();
  }

  //立即购买
  buynow() {
    this.showAttrTab();
  }
  dobuynow() {
    var pro_title = this.prodata['title'],
      pro_id = this.prodata['_id'],
      pro_pic = this.prodata['pic'],
      pro_price = this.prodata['price'],
      pro_count = this.buyNum,
      pro_attrs: any = '',
      spanActive = document.querySelectorAll('#allattr .actives');

    for (var i = 0; i < spanActive.length; i++) {
      if (i == 0) {
        pro_attrs += spanActive[i].children[0].innerHTML;
      } else {
        pro_attrs += '/' + spanActive[i].children[0].innerHTML;
      }
    }
    var cartJson = {
      pro_attrs,
      pro_title,
      pro_id,
      pro_pic,
      pro_price,
      pro_count,
      ischeck: true
    }, buynowList = [];
    buynowList.push(cartJson);

    this.storage.set('checkoutlist', buynowList);
    this.navi.navigateForward('/checkout');
  }

  //头部锚点导航
  headNavi(e) {
    document.getElementById(e.detail.value).scrollIntoView();
  }

  /* 轮播图组件 事件 */
  //滑动
  slideMove() {
    this.proslide.getActiveIndex().then((index) => {
      this.slideMsg.activeNum = index + 1;
    })
    this.proslide.length().then((index) => {
      this.slideMsg.allPic = index;
    })
  }

  /* 显示模态框 */
  //活动页
  showActiveTab() {
    this.modalOpenArr.activeModalOpen = true;
    this.maskShow = true;
  }
  showAttrTab() {
    this.modalOpenArr.attrModalOpen = true;
    this.maskShow = true;
  }
  //关闭模态框
  closeModal() {
    this.modalOpenArr.attrModalOpen = false;//关闭规格tab框
    this.modalOpenArr.activeModalOpen = false;//关闭活动tab框
    this.maskShow = false;//遮罩层关闭
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

  //打开模态组件
  async openCartModal() {
    // const modal = await this.modals.create({
    //   component: Tab3Page
    // });
    // return await modal.present();
    this.navi.navigateRoot('/tabs/tab3');
  }

  goService() {
    this.codeTip('功能开发中');
  }
  // 实时监听屏幕滚动距离
  ionScroll() {
    const scrollElement: Promise<HTMLElement> = this.elContent.getScrollElement();

    console.log(scrollElement);
    let proDom = this.elementRef.nativeElement.querySelector('#product').offsetTop;
    let comDom = this.elementRef.nativeElement.querySelector('#comment').offsetTop; 
    let detDom = this.elementRef.nativeElement.querySelector('#detail').offsetTop; 
    let recDom = this.elementRef.nativeElement.querySelector('#recommend').offsetTop; 
    scrollElement.then((Element) => {
      let sclLenght = Element.scrollTop;
      if (sclLenght < comDom) {
        this.tabFlag = "product";
      }else if(comDom< sclLenght < detDom) {
        this.tabFlag = "comment";
      } else if (detDom < sclLenght < recDom) {
        this.tabFlag = "detail"
      }
      if (Element.scrollTop > 210) { // 设置当滚动条距离顶部的距离为110时返回顶部按钮显示
        this.elBackTop.style.display = 'block';
      } else { // 设置当滚动条距离顶部的距离为0时返回顶部按钮隐藏
        this.elBackTop.style.display = 'none';
      }
    });
  }
  showImg(index) {
    let imgDom = document.querySelector(".clShowImg");
  }
}
