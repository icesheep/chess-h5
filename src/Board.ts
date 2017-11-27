
class Board extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }
    public static startX:number = 25;
    public static startY:number = 222;
    public static gridX:number = 75;
    public static gridY:number = 78;
    private cage:egret.Shape = new egret.Shape(); //选中的方框
    private con:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //选中框的容器
    private chooseFlag:boolean = false;
    private eat:boolean = false;
    private choose:Piece;
    public pieceMap:{[key:string]:Piece} = {};
    public init(color:number,x:number,y:number,gridX:number,gridY:number)
    {
        console.log(x,y,gridX,gridY);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.judge,this,true,1);
        this.addChild(this.con);
        // this.startX = x;this.startY=y;this.gridX = gridX;this.gridY = gridY;
        let len:number = RES.getRes("piece_json").length;
        let piece = RES.getRes("piece_json");
        let board = RES.getRes("board_json");
        for(let i:number = 0; i<len; i++)
        {
            let b:egret.Bitmap = new egret.Bitmap();
            b.texture = RES.getRes(piece[i].name+(Color.Red+Math.floor(i/16))+"_png");
            this.addChild(b);
            let p:Piece = new Piece();
            p.transformToPosition(piece[i].x,piece[i].y,piece[i].name,Color.Red+Math.floor(i/16));
            p.bitMap = b;
            this.pieceMap[i] = p;
            b.name = piece[i].name;
            b.x = p.x;
            b.y = p.y;
            b.width = 60;
            b.height = 60;
            b.anchorOffsetX = 30;
            b.anchorOffsetY = 30;
            b.touchEnabled = true;
            console.log(p.x,p.y,p.pointX,p.pointY);
            // b.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this,true,0);
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
                let p:Piece = this.findPiece(evt.stageX,evt.$stageY);
                this.choose.x = p.x;
                this.choose.y = p.y;
                this.chooseFlag = false;
                this.choose = null;
                this.con.removeChildren();
            }
        }else {
            let p:Piece = this.findPiece(evt.stageX,evt.$stageY);
            console.log(p,"judge");
            if(p) {
                this.cage.graphics.lineStyle(2, 0x00CD00, 1, true)
                this.cage.graphics.drawRect(0,0,75,78);
                this.cage.graphics.endFill();
                this.con.addChild(this.cage);
                this.con.x = p.x-37.5;
                this.con.y = p.y-39;
                this.chooseFlag = true;
                this.choose = p;
            }
        }
    }
    
    private findPiece(x,y):Piece {
        let pointX = 9 - Math.round((x - Board.startX)/Board.gridX)+1;
        let pointY = 10 - Math.round((y - Board.startY)/Board.gridY)+1;
        console.log(this.pieceMap,pointX,pointY);
        for(let v in this.pieceMap){
            console.log(this.pieceMap[v]);
            if(this.pieceMap[v].pointX === pointX && this.pieceMap[v].pointY === pointY) {
                return this.pieceMap[v];
            }
        }
        return null;
    }
    
}
