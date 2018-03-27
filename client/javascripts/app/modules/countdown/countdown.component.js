angular.module('hackathonRegistrationApp').component('countdown', {
  templateUrl: 'countdown/countdown.template.html',
  controller: ['$interval', function countdownController($interval) {
    var ctrl = this;

    ctrl.$onChanges = function() {
      ctrl.countDownDate = new Date(ctrl.countdownTimestamp).getTime();

      //Set days, hours, minutes, seconds
      distance = setDateDifference();

      //If registration open date is in the future then countdown.
      //Else return countdownOver
      if (distance > 0) {
        ctrl.showCountdown = true;

        // Update the count down every 1 second
        ctrl.counter = $interval(function() {
          //Update days, hours, minutes, seconds
          var distance = setDateDifference();

          // If the count down is finished, clear interval and return
          //countdownOver
          if (distance < 0) {
            $interval.cancel(ctrl.counter);
            ctrl.countdownOver({over: true});
          }
        }, 1000);
      } else {
        ctrl.countdownOver({over: true});
      }
    }

    function setDateDifference() {
      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = ctrl.countDownDate - now;

      if (distance >= 0) {
        // Time calculations for days, hours, minutes and seconds
        ctrl.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        ctrl.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        ctrl.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        ctrl.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      } else {
        ctrl.days = 0;
        ctrl.hours = 0;
        ctrl.minutes = 0;
        ctrl.seconds = 0;
      }

      return distance;
    }
  }],
  bindings: {
    countdownTimestamp: '@',  //Timestamp to coundown to
    countdownOver: '&'          //
  }
});
