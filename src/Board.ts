
class Board extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }

    public init()
    {
        console.log(RES.getRes("piece_json"));
        let len:number = RES.getRes("piece_json").length;
        let piece = RES.getRes("piece_json");
        let board = RES.getRes("board_json");
        for(let i:number = 0; i<len; i++)
        {
            let b:egret.Bitmap = new egret.Bitmap();
            b.texture = RES.getRes(piece[i].name+"_png");
            this.addChild(b);
            b.name = piece[i].name;
            b.x = board[piece[i].x][piece[i].y].x;
            b.y = board[piece[i].x][piece[i].y].y;
            b.anchorOffsetX = 40;
            b.anchorOffsetY = 40;
            b.touchEnabled = true;
            b.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
        }
    }
    private click(evt:egret.TouchEvent)
    {
        // var rel:boolean = this.check( evt.target.name );
        // if( rel )
        // {

            evt.target.parent.removeChild(evt.target);
        //     this._reqs[this._curReq].ns--;
        //     this.update();

        //     if( this._reqs[this._curReq].ns==0 )
        //     {
        //         this._curReq ++;
        //         this.playNew();
        //     }
        // }

    }
}
