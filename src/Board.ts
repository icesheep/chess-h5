
class Board extends egret.DisplayObjectContainer {

    public constructor() {
        super();
    }
    public static startX:number = 113;
    public static startY:number = 113;
    public static gridX:number = 140;
    public static gridY:number = 140;
    private cage:egret.Shape = new egret.Shape(); //选中的方框
    private endCage:egret.Shape = new egret.Shape(); //选中的方框
    private con:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //选中框的容器
    private endCon:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //选中框的容器
    private cage2:egret.Shape = new egret.Shape(); //对方选中的方框
    private endCage2:egret.Shape = new egret.Shape(); //对方选中的方框
    private con2:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //对方选中框的容器
    private endCon2:egret.DisplayObjectContainer = new egret.DisplayObjectContainer(); //对方选中框的容器
    private chooseFlag:boolean = false;
    private eat:boolean = false;
    private choose:Piece;
    private rule:Rule = new Rule();
    private socket:WebSocket;
    private response:any;
    public static pieceMap:{[key:string]:Piece} = {};
    public static playerColor:number;
    public static winner:number;
    private go:boolean;
    public init()
    {
        this.initSocket();
    }
    //初始化棋子
    public start()
    {
        this.removeChildren();
        console.log(Board.startX,Board.startY,Board.gridX,Board.gridY);
        Board.playerColor = this.response.color;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,this.judge,this,true,1);
        this.addChild(this.con);
        this.addChild(this.con2);
        this.addChild(this.endCon);
        this.addChild(this.endCon2);
        // this.startX = x;this.startY=y;this.gridX = gridX;this.gridY = gridY;
        let len:number = RES.getRes("piece_json").length;
        let piece = RES.getRes("piece_json");
        let board = RES.getRes("board_json");
        for(let i:number = 0; i<len; i++)
        {
            let color:string;
            if(i<16) {
                color = 'RED';
            }else {
                color = 'BLACK';
            }
            let b:egret.Bitmap = new egret.Bitmap();
            // b.texture = RES.getRes(piece[i].name + (Color.RED + Math.floor(i/16)) +"_png");
            b.texture = RES.getRes("pieces."+color+piece[i].name.toUpperCase());
            // console.log(RES.getRes("pieces."+color+piece[i].name.toUpperCase()));
            // b.texture = RES.getRes("pieces.REDKING");
            this.addChild(b);
            let p:Piece = new Piece();
            p.transformToPosition(piece[i].x,piece[i].y,piece[i].name,Color.RED + Math.floor(i/16));
            p.bitMap = b;
            p.key = i;
            Board.pieceMap[i] = p;
            b.name = piece[i].name;
            b.x = p.x;
            b.y = p.y;
            // b.width = Board.gridX;
            // b.height = Board.gridX;
            b.anchorOffsetX = b.width/2;
            b.anchorOffsetY = b.height/2;
            b.scaleX = 0.2;
            b.scaleY = 0.2;
            // console.log(p.x,p.y,p.pointX,p.pointY);
            // b.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this,true,0);
        }
        let sound:egret.Sound = RES.getRes( "1_mp3" ); 
        let channel:egret.SoundChannel = sound.play(0,-1);
    }

    //连接websocket
    initSocket() {
        this.socket = new WebSocket("ws://game.zhuran.tw:10222/ws");
        let that = this;
        this.socket.onmessage = function(event) {
            that.response = JSON.parse(event.data);
            if(that.response.force && that.response.force === 'RED') {
                // console.log(that.response.force);
                that.response.color = Color.RED;
            }else {
                that.response.color = Color.BLACK;
            }
            // console.log(that.response,that.response["type"],that.response["orderType"]);
            if(that.response.type === 'ORDER' && that.response.orderType === 'START_GAME') {
                if(that.response.color === Color.RED) {
                    that.go = true;
                }
                that.start();
            }else if(that.response.type === 'ORDER' && that.response.orderType === 'END_GAME') {
                that.go = false;
                let event:GameEvent = new GameEvent(GameEvent.GAME_OVER);
                that.dispatchEvent(event);
            } else {
                // console.log(that.response);
                let startP:Piece = that.findPiece(that.response.from.x,that.response.from.y);
                let endP:Piece = that.findPiece(that.response.to.x,that.response.to.y);
                that.drawRect(startP.x,startP.y,'start1');
                if(endP) {
                    // startP.bitMap.x = endP.x;
                    // startP.bitMap.y = endP.y;
                    egret.Tween.get(startP.bitMap).to( {x:endP.x,y:endP.y}, 300, egret.Ease.sineIn );
                    startP.x = endP.x;
                    startP.y = endP.y;
                    startP.pointX = endP.pointX;
                    startP.pointY = endP.pointY;
                    delete Board.pieceMap[endP.key];
                    that.removeChild(endP.bitMap);            
                    that.drawRect(endP.x,endP.y,'end1');
                }else {
                    let temp = that.findPosition(that.response.to.x,that.response.to.y);
                    // startP.bitMap.x = temp.x;
                    // startP.bitMap.y = temp.y;
                    egret.Tween.get(startP.bitMap).to( {x:temp.x,y:temp.y}, 300, egret.Ease.sineIn );
                    startP.x = temp.x;
                    startP.y = temp.y;
                    startP.pointX = that.response.to.x;
                    startP.pointY = that.response.to.y;
                    that.drawRect(temp.x,temp.y,'end1');
                }
                that.go = true;
            }
        };
    }
    //棋盘点击事件
    private judge(evt:egret.TouchEvent)
    {
        if(!this.go){
            return;
        }
        let temp:{pointX:number,pointY:number} = this.findPoint(evt.stageX,evt.$stageY);
        if(!temp) {
            return;
        }
        let p:Piece = this.findPiece(temp.pointX,temp.pointY);
        if(this.chooseFlag) {  //第一次已经选中棋子
            // console.log(evt,"judge");
            let sendData = {
                type: "ACTION",
                force: Board.playerColor === 1 ? "RED" : "BLACK",
                kind: this.choose.name.toUpperCase(),
                actionType: "MOVE",
                from: {
                    x: this.choose.pointX.toString(),
                    y: this.choose.pointY.toString(),
                },
                to: {},
            };
            if(p) { //第二次选中的棋子
                if(p.color !== Board.playerColor) { //第二次选择的对面的棋子
                    if(this.rule.ifLegal(this.choose.name,this.choose.pointX,this.choose.pointY,p.pointX,p.pointY)) { //能够移动
                        // this.con.removeChildren(); //去掉选择框
                        //吃子
                        this.drawRect(p.x,p.y,'end');
                        this.choose.x = p.x;
                        this.choose.y = p.y;
                        this.choose.pointX = p.pointX;
                        this.choose.pointY = p.pointY;
                        // this.choose.bitMap.x = p.x;
                        // this.choose.bitMap.y = p.y;
                        egret.Tween.get(this.choose.bitMap).to( {x:p.x,y:p.y}, 300, egret.Ease.sineIn );
                        // if(p.name === 'King') {
                        //     var event:GameEvent = new GameEvent(GameEvent.GAME_OVER);
                        //     this.dispatchEvent(event);
                        // }
                        delete Board.pieceMap[p.key];
                        this.chooseFlag = false;
                        this.choose = null;
                        this.removeChild(p.bitMap);
                        sendData.to = {
                            x : p.pointX,
                            y : p.pointY,
                        };
                        sendData.actionType = 'CAPTURE';
                        console.log(sendData);
                        this.socket.send(JSON.stringify(sendData));
                        this.go = false;
                        this.drawRect(p.x,p.y,'end');
                    }
                } else { //第二次选择的自己的棋子，重新画框
                    this.drawRect(p.x,p.y,'start');
                    this.chooseFlag = true;
                    this.choose = p;
                }
            }else {  //第二次选择的空白区域
                let tempx:number;
                let tempy:number;
                if(Board.playerColor === Color.RED) {
                    tempx = Board.startX + (9-temp.pointX)*Board.gridX ;
                    tempy = Board.startY + (10-temp.pointY)*Board.gridY ;
                } else {
                    tempx = Board.startX + (temp.pointX-1)*Board.gridX ;
                    tempy = Board.startY + (temp.pointY-1)*Board.gridY ;
                }
                if(this.rule.ifLegal(this.choose.name,this.choose.pointX,this.choose.pointY,temp.pointX,temp.pointY)){  //可以移动
                    // this.con.removeChildren(); //去掉选择框               
                    this.choose.x = tempx;
                    this.choose.y = tempy;
                    this.choose.pointX = temp.pointX;
                    this.choose.pointY = temp.pointY;
                    // this.choose.bitMap.x = tempx;
                    // this.choose.bitMap.y = tempy;
                    egret.Tween.get(this.choose.bitMap).to( {x:tempx,y:tempy}, 300, egret.Ease.sineIn );
                    this.chooseFlag = false;
                    // this.choose = null;
                    sendData.to = {
                        x : temp.pointX.toString(),
                        y : temp.pointY.toString(),
                    };
                    console.log(sendData);
                    this.socket.send(JSON.stringify(sendData));
                    this.go = false;
                    this.drawRect(tempx,tempy,'end');
                }
            }
        }else { //未选择棋子，进行第一次选择
            // console.log(p,"judge");
            if(p && p.color === Board.playerColor) {
                this.drawRect(p.x,p.y,'start');
                this.chooseFlag = true;
                this.choose = p;
            }
        }
    }

    //根据棋盘坐标获取棋子
    private findPiece(pointX:number,pointY:number):Piece {
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
        if(Board.playerColor === Color.RED) {
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

    //根据棋盘坐标获取点击坐标
    private findPosition(pointX:number,pointY:number):{x:number,y:number} {
        let x:number;
        let y:number;
        if(Board.playerColor === Color.RED) {
            x = Board.startX + (9-pointX)*Board.gridX ;
            y = Board.startY + (10-pointY)*Board.gridY ;
        } else {
            x = Board.startX + (pointX-1)*Board.gridX ;
            y = Board.startY + (pointY-1)*Board.gridY ;
        }
        return {x:x, y:y};
    }

    //画选择框
    private drawRect(x:number,y:number,type:string):void {
        if(type === 'start') {   
            this.cage.graphics.lineStyle(2, 0x00CD00, 1, true)
            this.cage.graphics.drawRect(0,0,64,64);
            this.cage.graphics.endFill();
            this.con.addChild(this.cage);
            this.con.x = x-Board.gridX/2;
            this.con.y = y-Board.gridY/2;
        }else if(type === 'end') {
            this.endCage.graphics.lineStyle(2, 0x00CD00, 1, true)
            this.endCage.graphics.drawRect(0,0,64,64);
            this.endCage.graphics.endFill();           
            this.endCon.addChild(this.endCage);
            this.endCon.x = x-Board.gridX/2;
            this.endCon.y = y-Board.gridY/2;
        }else if(type === 'start1') {  
            this.cage2.graphics.lineStyle(2, 0xFF4500, 1, true)
            this.cage2.graphics.drawRect(0,0,64,64);
            this.cage2.graphics.endFill();      
            this.con2.addChild(this.cage2);
            this.con2.x = x-Board.gridX/2;
            this.con2.y = y-Board.gridY/2;
        }else if(type === 'end1') { 
            this.endCage2.graphics.lineStyle(2, 0xFF4500, 1, true)
            this.endCage2.graphics.drawRect(0,0,64,64);
            this.endCage2.graphics.endFill();          
            this.endCon2.addChild(this.endCage2);
            this.endCon2.x = x-Board.gridX/2;
            this.endCon2.y = y-Board.gridY/2;
        }
    }
    

}
