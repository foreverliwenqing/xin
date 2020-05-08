import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  set(key,value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  removeAll(key){
    console.log(key);
    localStorage.removeItem(key);
  }
}
