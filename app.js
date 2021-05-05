const board = document.querySelector('.board');
const selectionDiv = document.querySelector('.selection');


// Used to determine if a user is clicking and holding on the board to create a new memo.
let mouseClicked = false;

// Used to determine if the user is currently dragging / repositioning a memo.
let movingMemo = false;

// Used to determine if the user is currently resizing a memo.
let resizingMemo = false;

let offsetXStart = 0;
let offsetYStart = 0;
let offsetXEnd = 0;
let offsetYEnd = 0;

let offsetYCurrent = 0;
let offetXCurrent = 0;

board.addEventListener('mousedown', (e) => {
    mouseClicked = true;
    offsetXStart = e.offsetX;
    offsetYStart = e.offsetY;

    if(!movingMemo){
        selectionDiv.style.top = `${offsetYStart}px`;
        selectionDiv.style.left = `${offsetXStart}px`;
        selectionDiv.style.display = 'block';
        board.style.cursor = 'crosshair';
    }
})
    

board.addEventListener('mouseup', (e) => {
    mouseClicked = false;
    offsetXEnd = e.offsetX;
    offsetYEnd = e.offsetY;
    
    let width = offsetXEnd - offsetXStart;
    let height = offsetYEnd - offsetYStart;

    // Memo has to be larger than 50px * 50px and user should not be currently repositioning another memo.
    if(width > 50 && height > 50 && !movingMemo){
        new Memo(
            {left: offsetXStart, top: offsetYStart},
            {width, height}
        )
    }
    selectionDiv.style.width = '0px';
    selectionDiv.style.height = '0px';
    selectionDiv.style.display = 'none';
    board.style.cursor = 'default';
})

board.addEventListener('mousemove', (e) => {

    if(mouseClicked){
        offsetXCurrent = e.offsetX - offsetXStart;
        offsetYCurrent = e.offsetY - offsetYStart;
        
        selectionDiv.style.width = `${offsetXCurrent}px`;
        selectionDiv.style.height = `${offsetYCurrent}px`;
    } 
})


class Memo{
    constructor(position, size){
        this.position = position;
        this.size = size;
        this.adjustSize = false;
        this.move = false;
        this.createMemo();
    }

    createMemo(){
        this.div = document.createElement('div');
        this.div.classList.add('memo');
    
        this.div.style.top = `${this.position.top}px`;
        this.div.style.left = `${this.position.left}px`;
        this.div.style.width = `${this.size.width}px`;
        this.div.style.height = `${this.size.height}px`;

        this.move = document.createElement('div');
        this.move.classList.add('move');
        this.move.addEventListener('mousedown', this.mouseDownMove.bind(this));
        window.addEventListener('mouseup', this.mouseUp.bind(this));
        window.addEventListener('mousemove', this.moveMemo.bind(this));
        this.div.appendChild(this.move);

        this.close = document.createElement('div');
        this.close.classList.add('close');
        this.move.appendChild(this.close);
        this.close.addEventListener('click', this.deleteMemo.bind(this));

        this.text = document.createElement('textarea');
        this.text.classList.add('text');
        this.div.appendChild(this.text);

        this.resize = document.createElement('div');
        this.resize.classList.add('resize');
        this.resize.addEventListener('mousedown', this.mouseDownResize.bind(this));
        this.div.appendChild(this.resize);

        board.appendChild(this.div);
    }

    mouseDownMove(e){
        // Set to true to stop another memo being created whilst we are moving a memo.
        movingMemo = true;

        // Used in the moveMemo function.
        this.move = true 

        // determine where the grab cursor is to position the memo relative the the offset and mouse position.
        this.movingXDist = e.clientX - this.position.left;
        this.movingYDist = e.clientY - this.position.top;
    }

    mouseDownResize(e){
        resizingMemo = true;
        this.resizing = true;
    }

    mouseUp(){
        movingMemo = false;
        resizingMemo = false;

        this.move = false 
        this.resize = false;

        // Rest the div position once the element has been moved
        this.position.top = this.div.offsetTop;
        this.position.left = this.div.offsetLeft;

        // Adjust memo positions if they are dragged out of bounds

        if(this.position.top < 0){
            this.position.top = 0;
            this.div.style.top = 0;
        }
        
        let boardHeight = board.getBoundingClientRect().bottom;

        if(this.position.top + this.size.height > boardHeight){
            this.position.top = boardHeight - (this.size.height + 10);
            this.div.style.top = `${this.position.top}px`;
        }

        if (this.position.left < 0){
            this.position.left = 0;
            this.div.style.left = '0px';
        }

        let boardRight = board.getBoundingClientRect().right;

        if(this.position.left + this.size.width > boardRight){
            this.position.left = boardRight - (this.size.width + 10);
            this.div.style.left= `${this.position.left}px`;
        }
    }

    deleteMemo(){
        this.div.remove();
    }

    moveMemo(e){   
        if(this.move){
            this.div.style.top = `${e.clientY - this.movingYDist}px`;
            this.div.style.left = `${e.clientX - this.movingXDist}px`;   
        }
    }

    reseizeMemo(){

    }
}


