import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public config: any = {
    domain: 'http://jd.itying.com/',
  }
  constructor(public http: HttpClient) { }

  // url 接口中传入的参数
  ajaxGet(url) {

    var api = this.config.domain + url;
    // Promise对象解决请求数据异步的问题
    let flag = new Promise((resolve, reject) => {
      this.http.get(api).subscribe(
        (res: any) => {
          resolve(res);
        }, 
        (err) => {
          reject(err)
        }
      )
    })  
    return flag;
  }

  ajaxPost(url, jsons) {
    // 首先定义请求类型【固定写法】
    const headers = {headers:new HttpHeaders({'Content-Type':'application/json'})};

    var api = this.config.domain + url;
    console.log(url, jsons);
    return new Promise((resove, reject) => {
      // subscribe有成功失败两个回调函数
      this.http.post(api, jsons, headers).subscribe(
        (res) => {
          resove(res);
        }, 
        (err) => {
          reject(err);
        }
      )
    })
  }

  getDeceSign(data) {
    var tempArr = [],
      signStr = '';

    for (var v in data) {
      tempArr.push(v);
    }

    tempArr = tempArr.sort();

    for (var j = 0; j < tempArr.length; j++) {
      signStr += tempArr[j] + data[tempArr[j]];
    }

    return Md5.hashStr(signStr);
  }
}
