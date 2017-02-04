import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService{

    messages: { title: string, message: string, isShow: boolean, type: string, fadeOut: boolean }[] = [];

    constructor (){
        console.log('Logger: Создан сервис');
    }

    addMessage( mes: { title: string, message: string, type: string } ){
        let conntext = this;
        this.messages.push( { title: mes.title, message: mes.message, isShow: true, type: mes.type, fadeOut: false});
        setTimeout(function() { conntext.messages.forEach( item => item.isShow = false); }, 3000);
        setTimeout(function() { conntext.messages.forEach( item => item.fadeOut = true ); }, 2000);
    }
}
