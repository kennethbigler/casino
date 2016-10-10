/*global app*/
app.factory('DealService', ['$log', function ($log) {
    "use strict";
    var board, factory = {};
    
    board = [{val: 1, sCase: 0, on: true},
            {val: 2, sCase: 0, on: true},
            {val: 5, sCase: 0, on: true},
            {val: 10, sCase: 0, on: true},
            {val: 25, sCase: 0, on: true},
            {val: 50, sCase: 0, on: true},
            {val: 75, sCase: 0, on: true},
            {val: 100, sCase: 0, on: true},
            {val: 200, sCase: 0, on: true},
            {val: 300, sCase: 0, on: true},
            {val: 400, sCase: 0, on: true},
            {val: 500, sCase: 0, on: true},
            {val: 750, sCase: 0, on: true},
            {val: 1000, sCase: 0, on: true},
            {val: 5000, sCase: 0, on: true},
            {val: 10000, sCase: 0, on: true},
            {val: 25000, sCase: 0, on: true},
            {val: 50000, sCase: 0, on: true},
            {val: 75000, sCase: 0, on: true},
            {val: 100000, sCase: 0, on: true},
            {val: 200000, sCase: 0, on: true},
            {val: 300000, sCase: 0, on: true},
            {val: 400000, sCase: 0, on: true},
            {val: 500000, sCase: 0, on: true},
            {val: 750000, sCase: 0, on: true},
            {val: 1000000, sCase: 0, on: true}];
    
    factory.board = function () {
        return board;
    };
    
    factory.openCase = function (x) {
        if (board[x].on) {
            board[x].on = false;
            return board[x].val;
        } else {
            return false;
        }
    };
    
    factory.newGame = function () {
        var i, j, k, temp, cases = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
        
        for (i = 0; i < 100; i += 1) {
            j = Math.floor(Math.random() * 26);
            k = Math.floor(Math.random() * 26);
            // swap
            temp = cases[j];
            cases[j] = cases[k];
            cases[k] = temp;
        }
        
        for (i = 0; i < board.length; i += 1) {
            board[i].on = true;
            board[i].sCase = cases[i];
        }
        
        board.sort(function (a, b) {
            return a.sCase - b.sCase;
        });
        
        return;
    };

    return factory;
}]);