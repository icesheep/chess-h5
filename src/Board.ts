
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
    private rule:Rule = new Rule();
    public static pieceMap:{[key:string]:Piece} = {};
    public static playerColor:number;
    public init(color:number,x:number,y:number,gridX:number,gridY:number)
    {
        console.log(x,y,gridX,gridY);
        Board.playerColor = color;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.judge,this,true,1);
        this.addChild(this.con);
        // this.startX = x;this.startY=y;this.gridX = gridX;this.gridY = gridY;
        let len:number = RES.getRes("piece_json").length;
        let piece = RES.getRes("piece_json");
        let board = RES.getRes("board_json");
        for(let i:number = 0; i<len; i++)
        {
            let b:egret.Bitmap = new egret.Bitmap();
            b.texture = RES.getRes(piece[i].name + (Color.Red + Math.floor(i/16)) +"_png");
            this.addChild(b);
            let p:Piece = new Piece();
            p.transformToPosition(piece[i].x,piece[i].y,piece[i].name,Color.Red + Math.floor(i/16));
            p.bitMap = b;
            p.key = i;
            Board.pieceMap[i] = p;
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

    //棋盘点击事件
    private judge(evt:egret.TouchEvent)
    {
        let temp:{pointX:number,pointY:number} = this.findPoint(evt.stageX,evt.$stageY);
        if(!temp) {
            return;
        }
        let p:Piece = this.findPiece(temp.pointX,temp.pointY);
        if(this.chooseFlag) {  //第一次已经选中棋子
            console.log(evt,"judge");
            if(p) { //第二次选中的棋子
                if(p.color !== Board.playerColor) { //第二次选择的对面的棋子
                    if(this.rule.ifLegal(this.choose.name,this.choose.pointX,this.choose.pointY,p.pointX,p.pointY)) { //能够移动
                        this.con.removeChildren(); //去掉选择框
                         //吃子
                        this.choose.x = p.x;
                        this.choose.y = p.y;
                        this.choose.pointX = p.pointX;
                        this.choose.pointY = p.pointY;
                        this.choose.bitMap.x = p.x;
                        this.choose.bitMap.y = p.y;
                        egret.Tween.get(this.choose.bitMap).to( {x:p.x,y:p.y}, 2000, egret.Ease.sineIn );
                        if(p.name === 'King') {
                            alert(Board.playerColor+'获胜!');
                        }
                        delete Board.pieceMap[p.key];
                        this.chooseFlag = false;
                        this.choose = null;
                        this.removeChild(p.bitMap);
                    }
                } else { //第二次选择的自己的棋子，重新画框
                    this.drawRect(p);
                }
            }else {  //第二次选择的空白区域
                let tempx:number;
                let tempy:number;
                if(Board.playerColor === Color.Red) {
                    tempx = Board.startX + (9-temp.pointX)*Board.gridX ;
                    tempy = Board.startY + (10-temp.pointY)*Board.gridY ;
                } else {
                    tempx = Board.startX + (temp.pointX-1)*Board.gridX ;
                    tempy = Board.startY + (temp.pointY-1)*Board.gridY ;
                }
                if(this.rule.ifLegal(this.choose.name,this.choose.pointX,this.choose.pointY,temp.pointX,temp.pointY)){  //可以移动
                    this.con.removeChildren(); //去掉选择框               
                    this.choose.x = tempx;
                    this.choose.y = tempy;
                    this.choose.pointX = temp.pointX;
                    this.choose.pointY = temp.pointY;
                    this.choose.bitMap.x = tempx;
                    this.choose.bitMap.y = tempy;
                    egret.Tween.get(this.choose.bitMap).to( {x:tempx,y:tempy}, 1000, egret.Ease.sineIn );
                    this.chooseFlag = false;
                    // this.choose = null;
                }
            }
        }else { //未选择棋子，进行第一次选择
            // console.log(p,"judge");
            if(p && p.color === Board.playerColor) {
                this.drawRect(p);
            }
        }
    }

    //根据棋盘坐标获取棋子
    private findPiece(pointX:number,pointY:number):Piece {
        console.log(Board.pieceMap,pointX,pointY);
        for(let v in Board.pieceMap){
            if(Board.pieceMap[v].pointX === pointX && Board.pieceMap[v].pointY === pointY) {
                return Board.pieceMap[v];
            }
        }
        return null;
    }

    //根据点击坐标获取棋盘坐标
    private findPoint(x:number,y:number):{pointX:number,pointY:number} {
        let pointX:number;
        let pointY:number;
        if(Board.playerColor === Color.Red) {
            pointX = 9 - Math.round((x - Board.startX)/Board.gridX);
            pointY = 10 - Math.round((y - Board.startY)/Board.gridY);
        } else {
            pointX = Math.round((x - Board.startX)/Board.gridX) + 1;
            pointY = Math.round((y - Board.startY)/Board.gridY) + 1;
        }
        if(pointX>=1 && pointX <=9 && pointY>=1 && pointY<=10){
            return {pointX:pointX, pointY:pointY};
        }else{
            return null;
        }
    }

    //画选择框
    private drawRect(p:Piece):void {
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
