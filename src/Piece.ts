class Piece
{
    public key:number;
    public name:string = "";
    public x:number = 0;
    public y:number = 0;
    public color:number = 0;
    public pointX:number = 0; //棋盘坐标
    public pointY:number = 0;
    public bitMap:egret.Bitmap;

    public transformToPoint(x:number,y:number,name:string,color:number):void
    {
        this.x = x;
        this.y = y;
        this.name = name;
        this.color = color;
        this.pointX = Math.round((x - Board.startX)/Board.gridX)+1;
        this.pointY = Math.round((y - Board.startY)/Board.gridY)+1;
    }
    public transformToPosition(pointX:number,pointY:number,name:string,color:number):void
    {
        this.pointX = pointX;
        this.pointY = pointY;
        this.name = name;
        this.color = color;
        if(Board.playerColor === Color.Red) {
            this.x = Board.startX + (9-pointX)*Board.gridX ;
            this.y = Board.startY + (10-pointY)*Board.gridY ;
        } else {
            this.x = Board.startX + (pointX-1)*Board.gridX ;
            this.y = Board.startY + (pointY-1)*Board.gridY ;
        }
    }
}