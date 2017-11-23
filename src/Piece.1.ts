
class Piece1 extends egret.Bitmap {

    public constructor(name: string,x: number,y: number) {
        super();
        this.createBitmapByName();
    }
    private createBitmapByName() {
        let imgLoader:egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once( egret.Event.COMPLETE, this.imgLoadHandler, this );
        imgLoader.load( this.name );
    }

    private imgLoadHandler( evt:egret.Event ):void{
        
        var bmd:egret.BitmapData = evt.currentTarget.data;
        /*** 本示例关键代码段开始 ***/
        /// 将已加载完成的图像显示出来
        var bird:egret.Bitmap = new egret.Bitmap( bmd );
        bird.x = 80;
        bird.y = 80;
        // this.addChild( bird );
        /*** 本示例关键代码段结束 ***/
            
        /// 为定位设置基准点(即锚点)
        bird.anchorOffsetX = bmd.width / 2;
        bird.anchorOffsetY = bmd.height / 2;
        bird.x = this.x;
        bird.y = this.y;

        // this._bgInfo = new egret.Shape;
        // this.addChildAt( this._bgInfo, this.numChildren - 1 );

        // this._bgInfo.x = this._txInfo.x;
        // this._bgInfo.y = this._txInfo.y;
        // this._bgInfo.graphics.clear();
        // this._bgInfo.graphics.beginFill( 0xffffff, .5 );
        // this._bgInfo.graphics.drawRect( 0, 0, this._txInfo.width, this._txInfo.height );
        // this._bgInfo.graphics.endFill();
        
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, ( evt:egret.TouchEvent )=>{
            bird.x = evt.localX ;
            bird.y = evt.localY ;
            console.log(bird.x,bird.y);
        }, this );
        
    }
}
