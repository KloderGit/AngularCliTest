export class RingList { 

    arrayItems: any[] = [];
    index: number;
    
    constructor( array?: any[] ) { 
        this.arrayItems = array;
        this.index = 0;
    }

    add(element: any) { 
        this.arrayItems.push(element);
    }

    next() {
        if (this.arrayItems.length >= (this.index + 1) + 1) {
            this.index++;
        } else { 
            this.index = 0;
        }
        return this.arrayItems[this.index];
    }

    prev() { 
        if ((this.index - 1) >= 0) {
            this.index--;
        } else {
            this.index = this.arrayItems.length-1;
        }
        return this.arrayItems[this.index];       
    }

    current() { 
        return this.arrayItems[this.index];
    }

    getIndex() { 
        return this.index;
    }

    getItems() { 
        return this.arrayItems;
    }

}