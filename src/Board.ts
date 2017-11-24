
class Board extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }
    private startX:number;
    private startY:number;
    private grid:number;
    public init(color:number,x:number,y:number,grid:number)
    {
        console.log(x,y,grid);
        this.startX = x;this.startY=y;this.grid = grid;
        let len:number = RES.getRes("piece_json").length;
        let piece = RES.getRes("piece_json");
        let board = RES.getRes("board_json");
        for(let i:number = 0; i<len; i++)
        {
            let b:egret.Bitmap = new egret.Bitmap();
            b.texture = RES.getRes(piece[i].name+"_png");
            this.addChild(b);
            let p:Piece;
            p = this.transformToPosition(piece[i].x,piece[i].y);
            b.name = piece[i].name;
            // b.x = board[piece[i].x][piece[i].y].x;
            // b.y = board[piece[i].x][piece[i].y].y;
            b.x = p.x;
            b.y = p.y;
            b.width = 70;
            b.height = 70;
            b.anchorOffsetX = 35;
            b.anchorOffsetY = 35;
            b.touchEnabled = true;
            b.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        }
    }
    private click(evt:egret.TouchEvent)
    {
        // var rel:boolean = this.check( evt.target.name );
        // if( rel )
        // {
console.log(evt.target.x,evt.target.y,evt.target.name);
            // evt.target.parent.removeChild(evt.target);
        //     this._reqs[this._curReq].ns--;
        //     this.update();

        //     if( this._reqs[this._curReq].ns==0 )
        //     {
        //         this._curReq ++;
        //         this.playNew();
        //     }
        // }

    }

    private transformToPoint(x:number,y:number):Piece
    {
        let p = new Piece();
        console.log(x,y);
        p.x = x;
        p.y = y;
        p.pointX = Math.round((y - this.startX)/this.grid);
        p.pointY = Math.round((x - this.startY)/this.grid);
        return p;

    }
    private transformToPosition(x:number,y:number):Piece
    {
        let p = new Piece();
        p.pointX = x;
        p.pointY = y;
        p.x = this.startX + y*this.grid - this.grid/2;
        p.y = this.startY + x*this.grid - this.grid/2;
        return p;

    }
}
