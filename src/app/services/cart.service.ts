import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  //购物车是否存在数据
  hasData(cartList, current) {
    if (cartList && cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].pro_id == current.pro_id && cartList[i].pro_attrs == current.pro_attrs) {
          return true;
        }
      }
      return false;
    }

    return false;
  }

  getCartNum(cartList) {
    var sum = 0;

    for (var i = 0; i < cartList.length; i++){
      sum += cartList[i].pro_count;
    }

    return sum;
  }

  //获取购物车合计
  getCarSum(cartList) {
    var sumprice = 0;

    for (var i = 0; i < cartList.length; i++){
      if (cartList[i].ischeck){
        sumprice += cartList[i].pro_count * cartList[i].pro_price;
      }
    }

    return sumprice.toFixed(2);
  }

  //获取选中的数量
  getCartCheckNum(cartList) {
    var checkNum = 0;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].ischeck) {
        checkNum++;
      }
    }

    return checkNum;
  }
}
