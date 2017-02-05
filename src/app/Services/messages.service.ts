import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService{

    messages: Message[] = [];

    constructor (){
        console.log('Logger: Создан сервис');
    }

    addMessage( mes: Message ){
        let conntext = this;
        this.messages.push( mes );
        setTimeout(function() { conntext.messages.forEach( item => item.isShow = false); }, 3000);
        setTimeout(function() { conntext.messages.forEach( item => item.fadeOut = true ); }, 2000);
    }
}

export class Message{
    title: string;
    content: string;
    isShow: boolean;
    type: string;
    fadeOut: boolean;

    constructor( value: { title: string, content: string, isShow?: boolean, type: string, fadeOut?: boolean}){
        this.title = value.title;
        this.content = value.content;
        this.isShow = true;
        this.type = value.type;
        this.fadeOut = false;
    }
}