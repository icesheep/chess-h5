var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Board = (function (_super) {
    __extends(Board, _super);
    function Board() {
        return _super.call(this) || this;
    }
    Board.prototype.init = function () {
        console.log(RES.getRes("piece_json"));
        var len = RES.getRes("piece_json").length;
        var piece = RES.getRes("piece_json");
        var board = RES.getRes("board_json");
        for (var i = 0; i < len; i++) {
            var b = new egret.Bitmap();
            b.texture = RES.getRes(piece[i].name + "_png");
            this.addChild(b);
            b.name = piece[i].name;
            b.x = board[piece[i].x][piece[i].y].x;
            b.y = board[piece[i].x][piece[i].y].y;
            b.anchorOffsetX = 40;
            b.anchorOffsetY = 40;
            b.touchEnabled = true;
            b.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    Board.prototype.click = function (evt) {
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
    };
    return Board;
}(egret.DisplayObjectContainer));
__reflect(Board.prototype, "Board");
//# sourceMappingURL=Board.js.map