import { MessagesService } from './Services/messages.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
    constructor( private messages: MessagesService ){}

    showLoggerMessage(){
        return this.messages.messages.filter( mes => mes.isShow );
    }

    styleVisible(message){
        return message.fadeOut ? 'hidden': 'visible';
    }

    styleOpacity(message){
        return message.fadeOut ? 0 : 1;
    }

}
