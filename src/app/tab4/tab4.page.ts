import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { EventemitterService } from '../services/eventemitter.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  public userInfo: any;

  constructor(public storage: StorageService, public eventemitter: EventemitterService) { }

  ngOnInit() {
    this.eventemitter.eventE.on('useraction',() => {//监听登录页面数据信息
      var userInfo = this.storage.get('userinfo');
      if (userInfo && userInfo.username) {
        this.userInfo = userInfo;
      }else{
        this.userInfo = '';
      }
    })
  }
  // 当进入页面时触发。。。
  ionViewDidEnter() {
    var userInfo = this.storage.get('userinfo');
    console.log(userInfo);
    if (userInfo && userInfo.username) {
      this.userInfo = userInfo;
    } else {
      this.userInfo = '';
    }
  }

}
