"use strict";
import Feed from './feed.json';
export default class Store {
    static saveData(){
        localStorage.setItem('feed', JSON.stringify(Feed));
    }
    static getData(startPosition,length){
        let a =  JSON.parse( localStorage.getItem('feed') );
        return {"data":a.slice(startPosition, startPosition+length),"nextPosition":startPosition+length};
    }
}
Store.saveData();