/*global $, console, app, $scope */

app.controller('BlackjackController', ['$scope', '$deck', '$storage', function ($scope, $deck, $storage) {
    "use strict";
    // prepare data
    var humans = 1,
        bet = 5,
        hands = [];
    $scope.turn = 0;
    $scope.ai = 5;
    
    /********************     Gameplay Helper Functions     ********************/
    function isBlackjack(n) {
        if ((hands[n][0].rank === 14 || hands[n][1].rank === 14) && (10 <= hands[n][0].rank <= 13 || 10 <= hands[n][1].rank <= 13)) {
            return true;
        } else {
            return false;
        }
    }
    /********************     Gameplay Helper Functions     ********************/
    // bet
    $scope.setBet = function (n) {
        bet += parseInt(n, 10);
    };
    // reveal cards
    // if dealer has 21, game over
    // if player has 21, game over
    
    /* todo list:
     * make the dealers hand a separate variable
     * change ui so that it is dealer and 6 players
     * enable betting for 6 players, not just 1
     */
    
    $scope.checkBlackjack = function () {
        var i;
        if (isBlackjack(hands.length - 1)) {
            for (i = 0; i < hands.length - 1; i += 1) {
                if (isBlackjack(i)) {
                    // do nothing
                    continue;
                } else {
                    
                }
            }
        }
    };
    // hit / stay / split / double down player
    // bust ends
    // else, hit or stay
    // next player
        // repeat
    // dealer
    // hit or stay
    // bust pays players left
    // evaluate
        // check for special conditions
        // check for higher score <= 21
        // return payout
    // payout
    // new game
    $scope.newGame = function () {
        var i;
        $scope.turn = 0;
        $deck.shuffle();
        for (i = 0; i < (humans + $scope.ai); i += 1) {
            hands[i] = $deck.deal(2);
            hands[i].sort($deck.rankSort);
        }
        $scope.hands = hands;
        $scope.hand = hands[$scope.turn];
    };
    
    /********************     UI Functions     ********************/
    // update ai and human players
    $scope.updateAI = function (n) {
        humans = n;
        $scope.ai = 6 - n;
        $('.btn-danger').removeClass('btn-danger');
        $('#b' + n).addClass('btn-danger');
    };
    /********************     Testing Code     ********************/
    $scope.newGame();
}]);

/* Computer Algorithm
https://www.blackjackinfo.com/blackjack-basic-strategy-engine/

Blackjack
    Delt a A and a 10, should pay 3:2, but most casinos do 6:5

Double Down:
    This option is available with a two card hand, before another card has been drawn
    double your bet and receive one (and only one) additional card to your hand

Splitting Pairs
    When you are dealt a pair of cards of the same rank
    allowed to split into two separate hands and play them independently
    Double after split is ok
    
Resplitting
    When you get additional pairs in the first two cards of a hand you can resplit
    Typically a player is allowed to split up to 3 times (delt 4 of a kind)
    
Splitting Aces
    Player is limited to drawing only one additional card on each Ace
    If you draw a ten-valued card on one of your split Aces, the hand is not considered a Blackjack (treated as a normal 21)
    Can re-split aces
    

Dealer hits on 16 or less and soft 17
Minimum bet is $5
*/