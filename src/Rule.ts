
class Rule {

    public ifLegal(piece:string,startX:number,startY:number,endX:number,endY:number):boolean {
        let a:{x:number,y:number,z:number,dx:number,dy:number,dz:number} = this.pieceCount(startX,startY,endX,endY);
        // console.log(a,piece);
        switch(piece) {
            case "Rook" : {
                if(startX===endX && a.y === 0) {
                    return true;
                }else if(startY===endY && a.x === 0) {
                    return true;
                }else {
                    return false;
                }
            }
            case "Knight" : {
                if(a.dx===1 && a.dy===2 && a.y===0) {
                    return true;
                }else if(a.dx===2 && a.dy===1 && a.x===0) {
                    return true;
                }else {
                    return false;
                }
            }
            case "Bishop" : {
                if(Board.playerColor === Color.RED) {
                    if(endY > 5) {
                        return false;
                    }
                }else {
                    if(endY < 6) {
                        return false;
                    }
                }
                if(a.dx===2 && a.dy===2 && a.z===0) {
                    return true;
                }else {
                    return false;
                }
            }
            case "Guard" : {
                if(Board.playerColor === Color.RED) {
                    if(endY > 3) {
                        return false;
                    }
                }else {
                    if(endY < 8) {
                        return false;
                    }
                }
                if(a.dx===1 && a.dy===1 && a.y===0) {
                    return true;
                }else {
                    return false;
                }
            }
            case "King" : {
                if(Board.playerColor === Color.RED) {
                    if(endY > 3) {
                        return false;
                    }
                }else {
                    if(endY < 8) {
                        return false;
                    }
                }
                if(a.dx===1 && a.dy===0) {
                    return true;
                }else if(a.dx===0 && a.dy===1) {
                    return true;
                }else {
                    return false;
                }
            }
            case "Gun" : {
                let p:Piece;
                for(let v in Board.pieceMap){
                    if(Board.pieceMap[v].pointX === endX && Board.pieceMap[v].pointY === endY) {
                        p = Board.pieceMap[v];
                    }
                }
                if(p) {
                    if(startX===endX && a.y === 1) {
                        return true;
                    }else if(startY===endY && a.x === 1) {
                        return true;
                    }else {
                        return false;
                    }
                }else {
                    if(startX===endX && a.y === 0) {
                    return true;
                    }else if(startY===endY && a.x === 0) {
                        return true;
                    }else {
                        return false;
                    }
                }
            }
            case "Pawn" : {
                if(Board.playerColor === Color.RED) {
                    if(endY < startY) {
                        return false;
                    }
                }else {
                    if(endY > startY) {
                        return false;
                    }
                }
                if(a.dx===1 && a.dy===0) {
                    if(Board.playerColor === Color.RED) {
                        if(endY <= 5) {
                            return false;
                        }
                    }else {
                        if(endY >= 6) {
                            return false;
                        }
                    }
                    return true;
                }else if(a.dx===0 && a.dy===1) {
                    return true;
                }else {
                    return false;
                }
            }
        }
    }

    private is_line(startX:number,startY:number,endX:number,endY:number):boolean {
        if(startX===endX || startY===endY) {
            return true;
        }else{
            return false;
        }
    }

    private is_knight(startX:number,startY:number,endX:number,endY:number):boolean {
        if(startX===endX || startY===endY) {
            return true;
        }else{
            return false;
        }
    }

    //判断2个棋子之间棋子数
    private pieceCount(startX:number,startY:number,endX:number,endY:number):{x:number,y:number,z:number,dx:number,dy:number,dz:number} {
        let a = {x:0,y:0,z:0,dx:Math.abs(startX-endX),dy:Math.abs(startY-endY),dz:0};
        for(let i:number=Math.min(startX,endX)+1; i<Math.max(startX,endX); i++) {
            for(let v in Board.pieceMap){
                if(Board.pieceMap[v].pointX === i && Board.pieceMap[v].pointY === startY) {
                    a.x++;
                }
            }
        }
        for(let i:number=Math.min(startY,endY)+1; i<Math.max(startY,endY); i++) {
            for(let v in Board.pieceMap){
                if(Board.pieceMap[v].pointY === i && Board.pieceMap[v].pointX === startX) {
                    a.y++;
                }
            }
        }
        for(let i:number=Math.min(startX,endX)+1, j:number=Math.min(startY,endY)+1; i<Math.max(startX,endX), j<Math.max(startY,endY); i++,j++) {
            a.dz++;
            for(let v in Board.pieceMap){
                if(Board.pieceMap[v].pointX === i && Board.pieceMap[v].pointY === j) {
                    a.z++;
                }
            }
        }
        return a;
    }
    
}
