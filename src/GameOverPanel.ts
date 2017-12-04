class GameOverPanel extends egret.Sprite
{
    public constructor()
    {
        super();
        this.init();
    }

    private _score:egret.TextField;
    private _startGameBtn:egret.TextField;

    private init():void
    {

        this._score = new egret.TextField();
        this._score.textColor = 0xB22222;
        if(Board.playerColor === 1) {
            this._score.text = "红方获胜！" ;
        } else {
            this._score.text = "黑方获胜！" ;
        }
        this._score.size = 50;
        this._score.x = Board.startX+3*Board.gridX;
        this._score.y = Board.startY+3*Board.gridY;
        this.addChild( this._score );

        this._startGameBtn = new egret.TextField();
        this._startGameBtn.text = "重玩";
        this._startGameBtn.size = 40;
        this._startGameBtn.textColor = 0xB22222;
        this._startGameBtn.x = Board.startX+3*Board.gridX;
        this._startGameBtn.y = Board.startY+4*Board.gridY;
        this.addChild( this._startGameBtn );
        this._startGameBtn.touchEnabled = true;
        this._startGameBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.restartGame,this);

    }

    private restartGame(evt:egret.TouchEvent)
    {
        var event:GameEvent = new GameEvent(GameEvent.GAME_START);
        this.dispatchEvent(event);
    }
}