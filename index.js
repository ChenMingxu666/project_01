var boardData = []
var isBlack = true
// 是否获胜
var success = false
// 记录历史, history和浏览器历史记录重名了，所以需要改个名字
var boardHistory = []

/**
 * 重置数据
 */
function initData() {
    // 通过二维数组描述棋盘。每个一个值，0代表未落子，1已落黑子，2白子
  /*   isBlack = true; */
    /* success = false; */
    boardData = [];
    /* boardHistory = []; */
    for (var i = 0; i < 15; i++) {
        // js原生通过原型链实现继承
        var rowData = []
        for(var j = 0; j < 15; j++){
            rowData.push(0)
        }
        // var rowData = new Array(15)
        // rowData.fill(0)
        boardData.push(rowData)
    }
}

function initView() {
    // 原生JavaScript
    var boardDom = document.getElementById("board")
    // jQuery
    // $('board')

    boardDom.innerHTML = "";

    for (var i = 0; i < boardData.length; i++) {
        // 创建出来一行
        var rowDom = createDomWithClass("div", "row");
        for (var j = 0; j < boardData[i].length; j++) {
            // 给这一行添加15格子
            // 反引号允许我们在字符串中间有空格
            // rowDom.innerHTML += "<div class='cell'>" +
            //     "<div class='row-cell'></div>" +
            //     "<div class='col-cell'></div>" +
            //     "</div>";
            var cellDom = createDomWithClass("div", "cell");
                // 行dom
                var rowCellDom = createDomWithClass("div", "row-cell");
                // 列Dom
                var colCellDom = createDomWithClass("div", "col-cell");

                // 在单元格添加行和列
                cellDom.appendChild(rowCellDom)
                cellDom.appendChild(colCellDom)
            // 是把构建好的单元格加到row里
            rowDom.appendChild(cellDom)

            if (i == 0) {
                colCellDom.style.height = "50%"
                colCellDom.style.top = "50%"
            } else if (i == 14) {
                colCellDom.style.height = "50%"
            }
            if (j == 0) {
                rowCellDom.style.width = "50%"
                rowCellDom.style.left = "50%"
            } else if (j == 14) {
                rowCellDom.style.width = "50%"
            }

            // 添加点击事件的操作
            // data-*
            cellDom.dataset.rowIndex = i;
            cellDom.dataset.colIndex = j;
            cellDom.onclick = onTap;
            if (boardData[i][j] == 1) {
                // 这里需要一个元素
                var piecesDom = createDomWithClass("div", "pieces");
                piecesDom.style.backgroundColor = "black";
                cellDom.appendChild(piecesDom)
            } else if (boardData[i][j] == 2) {
                var piecesDom = createDomWithClass("div", "pieces");
                piecesDom.style.backgroundColor = "white"
                cellDom.appendChild(piecesDom)
            }


        }
        // 将这一行添加到棋盘中
        boardDom.appendChild(rowDom);
    }
}

/**
 * 创建一个带样式的DOM元素
 * 输入： 标签， 样式
 * 输出：创建好的DOM对象
 */
function createDomWithClass(tagName, className) {
    var dom = document.createElement(tagName);
    dom.className = className;
    return dom;
}

function onTap() {
    if (success) {
        alert("游戏已经结束请重新开始")
        return
    }
    var rowIndex = Number.parseInt(this.dataset.rowIndex);
    var colIndex = Number.parseInt(this.dataset.colIndex);
    if (boardData[rowIndex][colIndex] != 0) {
        return;
    }

    // 给界面添加棋子
    var piecesDom = document.createElement("div")
    piecesDom.className = "pieces";
    if (isBlack) {
        piecesDom.style.backgroundColor = "black"
        boardData[rowIndex][colIndex] = 1

    } else {
        piecesDom.style.backgroundColor = "white"
        boardData[rowIndex][colIndex] = 2
    }

    this.appendChild(piecesDom)
    boardHistory.push({
        rowIndex: rowIndex,
        colIndex: colIndex
    })


    // 落子之后判定胜利

    if (isSuccess(boardData, rowIndex, colIndex)) {
        success = true;
        // alert((isBlack ? "黑棋" : "白棋") + "获胜!!!")
        // 由于alert弹出框会阻断渲染进程
        // 特此设置延时弹出
        setTimeout(() => alert((isBlack ? "黑棋" : "白棋") + "获胜!!!"), 500)
    } else {
        isBlack = !isBlack;

    }
    saveData()
}

// 判定胜利操作
// 输入： 二维数组，棋子横纵坐标
// 输出： 是否获胜。 true获胜，false没有获胜
function isSuccess(boardData, rowIndex, colIndex) {
    // // 五子棋如何判定胜利，胜利一定和这颗棋子有关
    // if (rowSuccess(boardData, rowIndex, colIndex)) {
    //     // 横向上如果有五个一样的胜利了
    //     return true;
    // } else if (colSuccess(boardData, rowIndex, colIndex)) {
    //     // 纵向上如果有五个一样的胜利了
    //     return true;
    // } else if (rightSuccess(boardData, rowIndex, colIndex)) {
    //     // 右斜如果有五个一样的胜利了
    //     return true;
    // } else if (leftSuccess(boardData, rowIndex, colIndex)) {
    //     // 左斜如果有五个一样的胜利了
    //     return true;
    // } else {
    //     return false;
    // }

    return rowSuccess(boardData, rowIndex, colIndex) || colSuccess(boardData, rowIndex, colIndex)
        || rightSuccess(boardData, rowIndex, colIndex) || leftSuccess(boardData, rowIndex, colIndex)
}

// 判定横向是否胜利
// 输入： 二维数组，棋子横纵坐标
// 输出： 是否获胜。 true获胜，false没有获胜
function rowSuccess(boardData, rowIndex, colIndex) {
    // 有几个一样的棋子
    var num = 1;
    // 先找它的左侧有几个一样的
    for (var i = 1; colIndex - i >= 0; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex][colIndex - i]) {
            // 连续
            num++;
        } else {
            // 不连续，退出循环
            break;
        }
    }
    for (var i = 1; colIndex + i < 15; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex][colIndex + i]) {
            // 连续
            num++;
        } else {
            // 不连续，退出循环
            break;
        }
    }
    console.log(num);
    return num >= 5;
}

// 判定横向是否胜利
// 输入： 二维数组，棋子横纵坐标
// 输出： 是否获胜。 true获胜，false没有获胜
function colSuccess(boardData, rowIndex, colIndex) {
    var num = 1;
    for (var i = 1; rowIndex - i >= 0; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex - i][colIndex]) {
            num++
        } else {
            break;
        }
    }
    for (var i = 1; rowIndex + i < 15; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex + i][colIndex]) {
            num++
        } else {
            break;
        }
    }
    return num >= 5;
}

/**
 *  右上方斜
 */
function rightSuccess(boardData, rowIndex, colIndex) {
    var num = 1;
    for (var i = 1; rowIndex - i >= 0 && colIndex + i < 15; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex - i][colIndex + i]) {
            num++
        } else {
            break;
        }
    }
    for (var i = 1; rowIndex + i < 15 && colIndex - i >= 0; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex + i][colIndex - i]) {
            num++
        } else {
            break;
        }
    }
    return num >= 5;
}

/**
 *  左上方斜
 */
function leftSuccess(boardData, rowIndex, colIndex) {
    var num = 1;
    for (var i = 1; rowIndex + i < 15 && colIndex + i < 15; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex + i][colIndex + i]) {
            num++
        } else {
            break;
        }
    }
    for (var i = 1; rowIndex - i >= 0 && colIndex - i >= 0; i++) {
        if (boardData[rowIndex][colIndex] == boardData[rowIndex - i][colIndex - i]) {
            num++
        } else {
            break;
        }
    }
    return num >= 5;
}

function restart() {
    initData()
    initView()
    saveData()
}

function back() {
    // 没有获胜才可以悔棋
    if (success) {
        alert("游戏已经结束，请重新开始")
        return;
    }
    if (boardHistory.length == 0) {
        alert("您还没有落子")
        return;
    }


    // 前提条件，每次落子需要有记录落在哪个位置
    var lastOper = boardHistory.pop();
    var rowIndex = lastOper.rowIndex;
    var colIndex = lastOper.colIndex;
    // 二维数组要修改
    boardData[rowIndex][colIndex] = 0;
    // 界面去掉,设计到了一些DOM操作
    // 1. 获取操作的单元格
    var boardDom = document.getElementById("board")
    // 获取到子集 
    var cellDom = boardDom.children[rowIndex].children[colIndex]
    // 找到了棋子的DOM，通过remove的api删除掉这个棋子
    cellDom.children[cellDom.children.length - 1].remove()
    // 落子顺序要改变
    isBlack = !isBlack
    saveData()
}


// localStorage 
//      只能存字符串

function saveData() {
    // 通过二维数组描述棋盘。每个一个值，0代表未落子，1已落黑子，2白子
    //  isBlack = true;
    //  success = false;
    //  boardData = [];
    //  boardHistory = []
    localStorage.setItem("isBlack", isBlack)
    localStorage.setItem("success", success)
    // 对象转成字符串api
    localStorage.setItem("boardData", JSON.stringify(boardData))
    localStorage.setItem("boardHistory", JSON.stringify(boardHistory))
}


