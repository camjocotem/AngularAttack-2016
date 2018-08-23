(function () {
    'use strict';

    angular
        .module('PongApp')
        .factory('pongMovementService', function () {

            var movementService = {};

            movementService.movePaddleDown = function (paddle) {
                if (paddle.height !== 82 && paddle.height < 82) {
                    paddle.height = paddle.height + paddle.movementSpeed;
                }
            };

            movementService.movePaddleUp = function (paddle) {
                if (paddle.height !== 5 && paddle.height > 5) {
                    paddle.height = paddle.height - paddle.movementSpeed;
                }
            };

            movementService.increaseBallAndPaddleSpeed = function (ball, paddleOne, paddleTwo) {
                if (ball.xSpeed <= 2.4) {
                    ball.xSpeed = ball.xSpeed * 1.1;
                } else {
                    paddleOne.movementSpeed = paddleOne.movementSpeed * 1.05;
                    paddleTwo.movementSpeed = paddleTwo.movementSpeed * 1.05;
                }
                ball.ySpeed = ball.ySpeed * 1.1;
            };

            movementService.ballMadeContactWithRightPaddle = function(pongBall, paddleTwo) {
                if ((pongBall.right >= paddleTwo.left) && ((pongBall.top < paddleTwo.bottom) && (pongBall.bottom > paddleTwo.top))) {
                    return true;
                }

                return false;
            };

            movementService.ballMadecontactWithLeftPaddle = function(pongBall, paddleOne) {
                if ((pongBall.left <= paddleOne.right) && ((pongBall.top < paddleOne.bottom) && (pongBall.bottom > paddleOne.top))) {
                    return true;
                }

                return false;
            };



            return movementService;

        });
})(window.angular);
