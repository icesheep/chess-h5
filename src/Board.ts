
class Board extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }
    private startX:number;
    private startY:number;
    private gridX:number;
    private gridY:number;
    private cage:egret.Shape = new egret.Shape(); //选中的方框
    private con:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //选中框的容器
    private chooseFlag:boolean = false;
    private eat:boolean = false;
    private choose:egret.Bitmap;
    public init(color:number,x:number,y:number,gridX:number,gridY:number)
    {
        console.log(x,y,gridX,gridY);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.judge,this,true,1);
        this.addChild(this.con);
        // this.startX = x;this.startY=y;this.gridX = gridX;this.gridY = gridY;
        this.startX = 25;this.startY=222;this.gridX = 75;this.gridY = 78;
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
            b.width = 60;
            b.height = 60;
            b.anchorOffsetX = 30;
            b.anchorOffsetY = 30;
            b.touchEnabled = true;
            b.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this,true,0);
        }
    }
    private click(evt:egret.TouchEvent)
    {
        console.log(evt,"c");
        if(this.eat) {
            this.removeChild(evt.target);
            this.eat = false;
        }
        if(this.con.x == evt.target.x-37.5 && this.con.y == evt.target.y-39 && this.chooseFlag) { //选中状态且目标点坐标与选中坐标相同，取消选择状态
            this.con.removeChildren();
            this.chooseFlag = false;
        }else {
            this.cage.graphics.lineStyle(2, 0x00CD00, 1, true)
            this.cage.graphics.drawRect(0,0,75,78);
            this.cage.graphics.endFill();
            this.con.addChild(this.cage);
            this.con.x = evt.target.x-37.5;
            this.con.y = evt.target.y-39;
            this.chooseFlag = true;
            this.choose = evt.target;
        }
    }
    private judge(evt:egret.TouchEvent)
    {
        if(this.chooseFlag) {
            console.log(evt,"judge");
            if(true) { //能够移动
                let p:Piece;
                p = this.transformToPoint(evt.stageX,evt.stageY);
                p = this.transformToPosition(p.pointX,p.pointY);
                this.choose.x = p.x;
                this.choose.y = p.y;
                this.chooseFlag = false;
                this.choose = null;
                this.con.removeChildren();
            }
        }
    }
    
    private transformToPoint(x:number,y:number):Piece
    {
        let p = new Piece();
        p.x = x;
        p.y = y;
        p.pointY = Math.round((x - this.startX)/this.gridX)+1;
        p.pointX = Math.round((y - this.startY)/this.gridY)+1;
        return p;
    }
    private transformToPosition(x:number,y:number):Piece
    {
        let p = new Piece();
        p.pointX = x;
        p.pointY = y;
        p.x = this.startX + (y-1)*this.gridX ;
        p.y = this.startY + (x-1)*this.gridY ;
        return p;
    }
}
