import { Injectable } from '@angular/core';

import { EventEmitter } from 'eventemitter3';

//广播信息 可以实现页面间通信 on = get  emit = set
@Injectable({
  providedIn: 'root'
})
export class EventemitterService {

  public eventE:any;

  constructor() {
    this.eventE = new EventEmitter();
  }

  
}

