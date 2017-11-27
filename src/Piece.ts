class Piece
{
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
        this.pointX = 9 - Math.round((x - Board.startX)/Board.gridX)+1;
        this.pointY = 10 - Math.round((y - Board.startY)/Board.gridY)+1;
    }
    public transformToPosition(pointX:number,pointY:number,name:string,color:number):void
    {
        this.pointX = pointX;
        this.pointY = pointY;
        this.name = name;
        this.color = color;
        this.x = Board.startX + (9-pointX)*Board.gridX ;
        this.y = Board.startY + (10-pointY)*Board.gridY ;
    }
}