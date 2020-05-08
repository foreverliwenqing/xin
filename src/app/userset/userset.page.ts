import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { EventemitterService } from '../services/eventemitter.service';

@Component({
  selector: 'app-userset',
  templateUrl: './userset.page.html',
  styleUrls: ['./userset.page.scss'],
})
export class UsersetPage implements OnInit {
  public userinfo:any = {
    'ava': '',
    'username': '',
    'gender': '男',
    'tel': '',
    'language': '',
    'openmsg': '',
    'salt': '',
    '_id': ''
  }
  public isLogOut = false; //退出按钮标记 如果点击退出按钮不要触发离开页面事件 否则无法退出

  constructor(
    public ialert:AlertController, 
    public storage:StorageService, 
    public actionsheet:ActionSheetController,
    public navi: NavController,
    public eventemitter: EventemitterService,
    public toast: ToastController, 
    ) { }

  ngOnInit() {
    var userinfos = this.storage.get('userinfo');
    if (!userinfos) {
      this.navi.navigateRoot('/tabs/tab1');
    }

    this.userinfo.username = userinfos.username;
    this.userinfo.tel = userinfos.tel;
    this.userinfo.gender = userinfos.gender;
    this.userinfo.salt = userinfos.salt;
    this.userinfo._id = userinfos._id;
  }

  //用户名编辑
  async usernameEdit() {
    const alert = await this.ialert.create({
      header: '修改用户名',
      inputs: [
        {
          name: 'subusername',
          type: 'text',
          value: this.userinfo.username,
          placeholder: '输入用户名'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '提交',
          handler: (msg) => {
            console.log(msg);
            //提交修改
            this.userinfo.username = msg.subusername;
          }
        }
      ]
    });
    await alert.present();
  }

  //性别编辑
  async genderEdit() {
    const actionSheet = await this.actionsheet.create({
      header: 'Albums',
      buttons: [{
        text: '男',
        role: 'destructive',
        handler: () => {
          this.userinfo.gender = '男';
        }
      }, {
        text: '女',
        handler: () => {
          this.userinfo.gender = '女';
        }
      }, {
        text: '取消',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  //退出登录
  logout() {
    this.isLogOut = true;
    this.storage.removeAll('userinfo');
    this.eventemitter.eventE.emit('useraction');//通知登录页面改变信息
    this.codeTip('退出成功');
    this.navi.navigateBack('/tabs/tab4');
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
  //离开页面时储存当前的用户信息
  ionViewDidLeave() {
    if (!this.isLogOut){
      this.storage.set('userinfo',this.userinfo);
    }
  }
}
