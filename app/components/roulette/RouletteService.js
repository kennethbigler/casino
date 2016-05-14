/*global app*/
app.factory('RouletteService', ['$log', '$storage', '$http', function ($log, $storage, $http) {
    "use strict";
    var factory = {},
        crap = {},
        stats = [],
        check = [];

    // this function loads data from the server
    function loadStats() {
        $http.get("/casino/assets/php/getStats.php")
            .success(function (data) {
                stats = data;
            }).error(function () {
                $log.error("An unexpected error ocurred!");
                stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            });
    }
    loadStats();
    // this function saves the stats to a text document on the server
    function saveStats(roll, payout) {
        //$log.log("post starts");
        stats[roll] += 1;
        stats[stats.length - 1] += payout;
        $http.post('/casino/assets/php/postStats.php', JSON.stringify(stats))
            .error(function (status) {
                $log.log(status);
            });
        $log.log(stats);
        //$log.log("post finished");
    }
    // this function resets the stats then saves the cleared data to the server
    function clearStats() {
        //post to the server
        stats = [];
        $http.post('/casino/assets/php/postStats.php', JSON.stringify(stats))
            .error(function (status) {
                $log.log(status);
            });
        $log.log("Statistics cleared and saved");
    }
    
    // evaluate stats to meaningful data
    function evalStats() {
        var result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 28, 30, 32, 34, 36],
            black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 29, 31, 33, 35],
            sum = 0,
            i = 0;
        for (i = 0; i < stats.length; i += 1) {
            sum += stats[i];
        }
        for (i = 0; i < stats.length; i += 1) {
            result[i] = stats[i] / sum;
            if (red.indexOf(i) !== -1) {
                result[stats.length] += result[i];
            } else if (black.indexOf(i) !== -1) {
                result[stats.length + 1] += result[i];
            } else {
                result[stats.length + 2] += result[i];
            }
        }
    }
    
    // 37 is 00
    factory.spin = function () {
        var roll = Math.floor(Math.random() * 38);
        if (roll > 37) {
            roll = 37;
        }
        saveStats(roll);
        return roll;
    };
    
    // subtract bet money, add to bet, add to check array
    factory.placeBet = function (i, bet) {
        $storage.sub(bet, 0);
        crap[i].bet += bet;
        if (check.indexOf(i) === -1) {
            check.push(i);
        }
    };
    
    // evalaute the players hand
    factory.evaluate = function (spin) {
        var payout = 0,
            i = 0;
        // iterate through check array for payout
        for (i = 0; i < check.length; i += 1) {
            if (crap[check[i]].val.indexOf(spin) !== -1) {
                payout += (crap[check[i]].payout * crap[check[i]].bet);
            }
        }
        // pay player
        $storage.add(payout, 0);
        return payout;
    };
    
    // reset the check array and bets
    factory.reset = function () {
        while (check.length > 0) {
            crap[check.pop()].bet = null;
        }
    };
    
    // Model - [$index: {val: [], payout: int, bet: int}]
    crap = [
        {val: [37], payout: 36, bet: null},
        {val: [0, 3], payout: 18, bet: null},
        {val: [3], payout: 36, bet: null},
        {val: [3, 6], payout: 18, bet: null},
        {val: [6], payout: 36, bet: null},
        {val: [6, 9], payout: 18, bet: null},
        {val: [9], payout: 36, bet: null},
        {val: [9, 12], payout: 18, bet: null},
        {val: [12], payout: 36, bet: null},
        {val: [12, 15], payout: 18, bet: null},
        {val: [15], payout: 36, bet: null},
        {val: [15, 18], payout: 18, bet: null},
        {val: [18], payout: 36, bet: null},
        {val: [18, 21], payout: 18, bet: null},
        {val: [21], payout: 36, bet: null},
        {val: [21, 24], payout: 18, bet: null},
        {val: [24], payout: 36, bet: null},
        {val: [24, 27], payout: 18, bet: null},
        {val: [27], payout: 36, bet: null},
        {val: [27, 30], payout: 18, bet: null},
        {val: [30], payout: 36, bet: null},
        {val: [30, 33], payout: 18, bet: null},
        {val: [33], payout: 36, bet: null},
        {val: [33, 36], payout: 18, bet: null},
        {val: [36], payout: 36, bet: null},
        {val: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], payout: 3, bet: null},
        {val: [37, 2, 3], payout: 12, bet: null},
        {val: [2, 3], payout: 18, bet: null},
        {val: [2, 3, 5, 6], payout: 9, bet: null},
        {val: [5, 6], payout: 18, bet: null},
        {val: [5, 6, 8, 9], payout: 9, bet: null},
        {val: [8, 9], payout: 18, bet: null},
        {val: [8, 9, 11, 12], payout: 9, bet: null},
        {val: [11, 12], payout: 18, bet: null},
        {val: [11, 12, 14, 15], payout: 9, bet: null},
        {val: [14, 15], payout: 18, bet: null},
        {val: [14, 15, 17, 18], payout: 9, bet: null},
        {val: [17, 18], payout: 18, bet: null},
        {val: [17, 18, 20, 21], payout: 9, bet: null},
        {val: [20, 21], payout: 18, bet: null},
        {val: [20, 21, 23, 24], payout: 9, bet: null},
        {val: [23, 24], payout: 18, bet: null},
        {val: [23, 24, 26, 27], payout: 9, bet: null},
        {val: [26, 27], payout: 18, bet: null},
        {val: [26, 27, 29, 30], payout: 9, bet: null},
        {val: [29, 30], payout: 18, bet: null},
        {val: [29, 30, 32, 33], payout: 9, bet: null},
        {val: [32, 33], payout: 18, bet: null},
        {val: [32, 33, 35, 36], payout: 9, bet: null},
        {val: [35, 36], payout: 18, bet: null},
        {val: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 30, 32, 33, 35, 36], payout: 2, bet: null},
        {val: [37, 0], payout: 18, bet: null},
        {val: [37, 0, 2], payout: 12, bet: null},
        {val: [2], payout: 36, bet: null},
        {val: [2, 5], payout: 18, bet: null},
        {val: [5], payout: 36, bet: null},
        {val: [5, 8], payout: 18, bet: null},
        {val: [8], payout: 36, bet: null},
        {val: [8, 11], payout: 18, bet: null},
        {val: [11], payout: 36, bet: null},
        {val: [11, 14], payout: 18, bet: null},
        {val: [14], payout: 36, bet: null},
        {val: [14, 17], payout: 18, bet: null},
        {val: [17], payout: 36, bet: null},
        {val: [17, 20], payout: 18, bet: null},
        {val: [20], payout: 36, bet: null},
        {val: [20, 23], payout: 18, bet: null},
        {val: [23], payout: 36, bet: null},
        {val: [23, 26], payout: 18, bet: null},
        {val: [26], payout: 36, bet: null},
        {val: [26, 29], payout: 18, bet: null},
        {val: [29], payout: 36, bet: null},
        {val: [29, 32], payout: 18, bet: null},
        {val: [32], payout: 36, bet: null},
        {val: [32, 35], payout: 18, bet: null},
        {val: [35], payout: 36, bet: null},
        {val: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], payout: 3, bet: null},
        {val: [0], payout: 36, bet: null},
        {val: [0, 1, 2], payout: 12, bet: null},
        {val: [1, 2], payout: 18, bet: null},
        {val: [1, 2, 4, 5], payout: 9, bet: null},
        {val: [4, 5], payout: 18, bet: null},
        {val: [4, 5, 7, 8], payout: 9, bet: null},
        {val: [7, 8], payout: 18, bet: null},
        {val: [7, 8, 10, 11], payout: 9, bet: null},
        {val: [10, 11], payout: 18, bet: null},
        {val: [10, 11, 13, 14], payout: 9, bet: null},
        {val: [13, 14], payout: 18, bet: null},
        {val: [13, 14, 16, 17], payout: 9, bet: null},
        {val: [16, 17], payout: 18, bet: null},
        {val: [16, 17, 19, 20], payout: 9, bet: null},
        {val: [19, 20], payout: 18, bet: null},
        {val: [19, 20, 22, 23], payout: 9, bet: null},
        {val: [22, 23], payout: 18, bet: null},
        {val: [22, 23, 25, 26], payout: 9, bet: null},
        {val: [25, 26], payout: 18, bet: null},
        {val: [25, 26, 28, 29], payout: 9, bet: null},
        {val: [28, 29], payout: 18, bet: null},
        {val: [28, 29, 31, 32], payout: 9, bet: null},
        {val: [31, 32], payout: 18, bet: null},
        {val: [31, 32, 34, 35], payout: 9, bet: null},
        {val: [34, 35], payout: 18, bet: null},
        {val: [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28, 29, 31, 32, 34, 35], payout: 2, bet: null},
        {val: [0, 1], payout: 18, bet: null},
        {val: [1], payout: 36, bet: null},
        {val: [1, 4], payout: 18, bet: null},
        {val: [4], payout: 36, bet: null},
        {val: [4, 7], payout: 18, bet: null},
        {val: [7], payout: 36, bet: null},
        {val: [7, 10], payout: 18, bet: null},
        {val: [10], payout: 36, bet: null},
        {val: [10, 13], payout: 18, bet: null},
        {val: [13], payout: 36, bet: null},
        {val: [13, 16], payout: 18, bet: null},
        {val: [16], payout: 36, bet: null},
        {val: [16, 19], payout: 18, bet: null},
        {val: [19], payout: 36, bet: null},
        {val: [19, 22], payout: 18, bet: null},
        {val: [22], payout: 36, bet: null},
        {val: [22, 25], payout: 18, bet: null},
        {val: [25], payout: 36, bet: null},
        {val: [25, 28], payout: 18, bet: null},
        {val: [28], payout: 36, bet: null},
        {val: [28, 31], payout: 18, bet: null},
        {val: [31], payout: 36, bet: null},
        {val: [31, 34], payout: 18, bet: null},
        {val: [34], payout: 36, bet: null},
        {val: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], payout: 3, bet: null},
        {val: [0, 37, 1, 2, 3], payout: 7, bet: null},
        {val: [1, 2, 3], payout: 12, bet: null},
        {val: [1, 2, 3, 4, 5, 6], payout: 6, bet: null},
        {val: [4, 5, 6], payout: 12, bet: null},
        {val: [4, 5, 6, 7, 8, 9], payout: 6, bet: null},
        {val: [7, 8, 9], payout: 12, bet: null},
        {val: [7, 8, 9, 10, 11, 12], payout: 6, bet: null},
        {val: [10, 11, 12], payout: 12, bet: null},
        {val: [10, 11, 12, 13, 14, 15], payout: 6, bet: null},
        {val: [13, 14, 15], payout: 12, bet: null},
        {val: [13, 14, 15, 16, 17, 18], payout: 6, bet: null},
        {val: [16, 17, 18], payout: 12, bet: null},
        {val: [16, 17, 18, 19, 20, 21], payout: 6, bet: null},
        {val: [19, 20, 21], payout: 12, bet: null},
        {val: [19, 20, 21, 22, 23, 24], payout: 6, bet: null},
        {val: [22, 23, 24], payout: 12, bet: null},
        {val: [22, 23, 24, 25, 26, 27], payout: 6, bet: null},
        {val: [25, 26, 27], payout: 12, bet: null},
        {val: [25, 26, 27, 28, 29, 30], payout: 6, bet: null},
        {val: [28, 29, 30], payout: 12, bet: null},
        {val: [28, 29, 30, 31, 32, 33], payout: 6, bet: null},
        {val: [31, 32, 33], payout: 12, bet: null},
        {val: [31, 32, 33, 34, 35, 36], payout: 6, bet: null},
        {val: [34, 35, 36], payout: 12, bet: null},
        {val: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], payout: 3, bet: null},
        {val: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], payout: 3, bet: null},
        {val: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], payout: 3, bet: null},
        {val: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], payout: 2, bet: null},
        {val: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36], payout: 2, bet: null},
        {val: [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 28, 30, 32, 34, 36], payout: 2, bet: null},
        {val: [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 29, 31, 33, 35], payout: 2, bet: null},
        {val: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35], payout: 2, bet: null},
        {val: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], payout: 2, bet: null}
    ];
    factory.crap = crap;
    
    return factory;
}]);