(function () {
    'use strict';

    var app = angular.module('PongApp');

    app.controller('PongController', ['$scope', '$interval', 'pongMovementService', function ($scope, $interval, pongMovementServce) {

        $scope.playerOne = {};
        $scope.playerTwo = {};
        $scope.playerOne.score = 0;
        $scope.playerTwo.score = 0;
        $scope.playerOne.number = 1;
        $scope.playerTwo.number = 2;
        $scope.roundNumber = 0;
        $scope.instructionsHaveBeenRead = false;
        var move,
            fieldBoundaries = getLocation('#pongField'),
            yIncrement = (fieldBoundaries.bottom - fieldBoundaries.top) / 100;

        function getLocation(elementLocator) {
            return angular.element(document.querySelector(elementLocator))[0].getBoundingClientRect();
        }

        function scorePoint(player) {
            player.score = player.score + 1;
            if (player.score === 3) {
                $scope.gameOver = true;
                player.text = "Winner!";
                $scope.winningPlayer = player.number;
                if(player.number === 1){
                    $scope.losingPlayer = 2;
                }
                else{
                    $scope.losingPlayer = 1;
                }

            } else {
                player.text = "Score!";
            }
            $scope.roundIsOver = true;
            $scope.stopMatch();
        }

        $scope.newRound = function () {
            $scope.paddleOne = {};
            $scope.paddleOne.height = 5; //location
            $scope.paddleOne.movementSpeed = 2;
            $scope.paddleOne.moving = false;
            $scope.playerOne.text = "";

            $scope.paddleTwo = {};
            $scope.paddleTwo.height = 81; //location
            $scope.paddleTwo.movementSpeed = 2;
            $scope.paddleTwo.moving = false;
            $scope.playerTwo.text = "";

            $scope.ball = {};
            $scope.ball.yLoc = 44;
            $scope.ball.xLoc = 49;
            $scope.ball.xMovement = "right";
            $scope.ball.yMovement = "down";
            $scope.ball.xSpeed = 0.8;
            $scope.ball.ySpeed = 0.2;
            $scope.roundIsOver = false;
            $scope.matchStarted = false;
            $scope.roundNumber = $scope.roundNumber + 1;
        };

        $scope.newRound();

        $scope.closeInstructions = function () {
            $scope.instructionsHaveBeenRead = true;
        };

        $scope.playAgain = function () {
            $scope.playerOne.score = 0;
            $scope.playerTwo.score = 0;
            $scope.roundNumber = 0;
            $scope.gameOver = false;
            $scope.roundIsOver = false;
            $scope.matchStarted = false;
            $scope.newRound();
        };

        $scope.startMatch = function () {
            $scope.matchStarted = true;
            move = $interval(function () {
                var pongBall = getLocation('#pongBall'),
                    paddleOne = getLocation('#paddleOne'),
                    paddleTwo = getLocation('#paddleTwo');

                /*
                    Paddle Movement
                */
                if ($scope.paddleOne.moving === true) { //Player 1
                    if ($scope.paddleOne.yMovement === "down") {
                        pongMovementServce.movePaddleDown($scope.paddleOne);
                    }
                    if ($scope.paddleOne.yMovement === "up") {
                        pongMovementServce.movePaddleUp($scope.paddleOne);
                    }
                }

                if ($scope.paddleTwo.moving === true) { //Player 2
                    if ($scope.paddleTwo.yMovement === "down") {
                        pongMovementServce.movePaddleDown($scope.paddleTwo);
                    }
                    if ($scope.paddleTwo.yMovement === "up") {
                        pongMovementServce.movePaddleUp($scope.paddleTwo);
                    }
                }


                /*
                    Ball Movement
                */
                //Move Ball Horizontally
                if ($scope.ball.xMovement === "right") {
                    if (pongMovementServce.ballMadeContactWithRightPaddle(pongBall, paddleTwo)) {
                        $scope.ball.xMovement = "left";
                        pongMovementServce.increaseBallAndPaddleSpeed($scope.ball, $scope.paddleOne, $scope.paddleTwo);
                    } else {
                        $scope.ball.xLoc = $scope.ball.xLoc + $scope.ball.xSpeed;
                        if (pongBall.right >= fieldBoundaries.right) {
                            scorePoint($scope.playerOne);
                        }
                    }
                } else //Move Ball Left
                {
                    if (pongMovementServce.ballMadecontactWithLeftPaddle(pongBall, paddleOne)) {
                        $scope.ball.xMovement = "right";
                        pongMovementServce.increaseBallAndPaddleSpeed($scope.ball, $scope.paddleOne, $scope.paddleTwo);
                    } else {
                        $scope.ball.xLoc = $scope.ball.xLoc - $scope.ball.xSpeed;
                        if (pongBall.left <= fieldBoundaries.left) {
                            scorePoint($scope.playerTwo);
                        }
                    }
                }

                //Move Ball Vertically
                if ($scope.ball.yMovement === "down") { //Move down
                    //Don't move down if at bottom
                    if ((pongBall.bottom + yIncrement) >= fieldBoundaries.bottom) {
                        $scope.ball.yMovement = "up"; //Bounce
                    } else {
                        $scope.ball.yLoc = $scope.ball.yLoc + $scope.ball.ySpeed;
                    }
                } else //Move Ball up
                {
                    if ((pongBall.top - yIncrement) <= fieldBoundaries.top) { //Bounce
                        $scope.ball.yMovement = "down";
                    } else {
                        $scope.ball.yLoc = $scope.ball.yLoc - $scope.ball.ySpeed;
                    }

                }


            }, 25);
        };

        $scope.stopMatch = function () {
            $interval.cancel(move);
        };

        $scope.movePaddle = function (ev) {

            //Player 1
            if (ev.code === "KeyS") {
                $scope.paddleOne.moving = true;
                $scope.paddleOne.yMovement = "down";
            }
            if (ev.code === "KeyW") {
                $scope.paddleOne.moving = true;
                $scope.paddleOne.yMovement = "up";
            }

            //Player 2
            if (ev.code === "KeyK") {
                $scope.paddleTwo.moving = true;
                $scope.paddleTwo.yMovement = "down";
            }
            if (ev.code === "KeyI") {
                $scope.paddleTwo.moving = true;
                $scope.paddleTwo.yMovement = "up";
            }
        };

        $scope.stopPaddle = function (ev) {
            if (ev.code === "KeyS" || ev.code === "KeyW") {
                $scope.paddleOne.moving = false;
            }

            if (ev.code === "KeyK" || ev.code === "KeyI") {
                $scope.paddleTwo.moving = false;
            }
        };
    }]);
})(window.angular);
