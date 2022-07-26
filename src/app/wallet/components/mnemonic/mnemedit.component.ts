import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

interface MnemonicEntity {
    word: string;
    selected: boolean;
}
@Component({
    selector: 'app-mnemedit',
    templateUrl: './mnemedit.component.html',
    styleUrls: ['./mnemonic.component.css']
})
export class MnemeditComponent {
    mnemonicShuffled: MnemonicEntity[];
    @Input() mnemonics: string[] = [];

    word1 = '';
    word2 = '';
    word3 = '';
    word4 = '';
    word5 = '';
    word6 = '';
    word7 = '';
    word8 = '';
    word9 = '';
    word10 = '';
    word11 = '';
    word12 = '';
    clicked = false;

    constructor(private route: Router, private locat: Location) {
        this.mnemonicShuffled = this.shuffle(sessionStorage.mnemonic.split(' ')).map(
            item => {
                return {
                    word: item,
                    selected: false
                };
            }
        );
        console.log('this.mnemonicShuffled=', this.mnemonicShuffled);
    }

    shuffle(array) {
        var currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    mnemonicsClicked(mnemonics) {
        mnemonics.selected = !mnemonics.selected;
        const word = mnemonics.word;
        if(mnemonics.selected) {
            if(!this.word1 || !this.word1.trim()) {
                this.word1 = word;
            } else 
            if(!this.word2 || !this.word2.trim()) {
                this.word2 = word;
            } else 
            if(!this.word3 || !this.word3.trim()) {
                this.word3 = word;
            } else    
            if(!this.word4 || !this.word4.trim()) {
                this.word4 = word;
            } else  
            if(!this.word5 || !this.word5.trim()) {
                this.word5 = word;
            } else  
            if(!this.word6 || !this.word6.trim()) {
                this.word6 = word;
            } else  
            if(!this.word7 || !this.word7.trim()) {
                this.word7 = word;
            } else  
            if(!this.word8 || !this.word8.trim()) {
                this.word8 = word;
            } else  
            if(!this.word9 || !this.word9.trim()) {
                this.word9 = word;
            } else 
            if(!this.word10 || !this.word10.trim()) {
                this.word10 = word;
            } else  
            if(!this.word11 || !this.word11.trim()) {
                this.word11 = word;
            } else  
            if(!this.word12 || !this.word12.trim()) {
                this.word12 = word;
            }                                                                                     
        } else {
            if(this.word1 == word) {
                this.word1 = '';
            } else
            if(this.word2 == word) {
                this.word2 = '';
            } else
            if(this.word3 == word) {
                this.word3 = '';
            } else
            if(this.word4 == word) {
                this.word4 = '';
            } else
            if(this.word5 == word) {
                this.word5 = '';
            } else
            if(this.word6 == word) {
                this.word6 = '';
            } else
            if(this.word7 == word) {
                this.word7 = '';
            } else
            if(this.word8 == word) {
                this.word8 = '';
            } else
            if(this.word9 == word) {
                this.word9 = '';
            } else
            if(this.word10 == word) {
                this.word10 = '';
            } else
            if(this.word11 == word) {
                this.word11 = '';
            } else
            if(this.word12 == word) {
                this.word12 = '';
            }
        }
    }

    sanitize(word: string) {
        // convert to lowercase from upper case if any
        // remove any unwated space and/or characters
        const p = String(word).toLowerCase();
        p.replace(/\s+/g, '');
        let q = '';

        for (let i = 0; i < p.length; i++) {
            if (p[i].match(/[a-z]/i)) {
                q += p[i];
            }
        }

        return q;
    }

    confirm() {
        const mnem = this.sanitize(this.word1) + ' ' + this.sanitize(this.word2) + ' ' + this.sanitize(this.word3) + ' '
            + this.sanitize(this.word4) + ' ' + this.sanitize(this.word5) + ' ' + this.sanitize(this.word6) + ' '
            + this.sanitize(this.word7) + ' ' + this.sanitize(this.word8) + ' ' + this.sanitize(this.word9) + ' '
            + this.sanitize(this.word10) + ' ' + this.sanitize(this.word11) + ' ' + this.sanitize(this.word12);

        if (mnem === sessionStorage.mnemonic) {
            this.route.navigate(['/wallet/pwd']);           
        } else {
            this.clicked = true;
        }
    }

    back() {
        this.locat.back();
    }
}
