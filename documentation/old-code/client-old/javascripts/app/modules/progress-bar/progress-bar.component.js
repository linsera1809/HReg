angular.module('hackathonRegistrationApp').component('progressBar', {
  templateUrl: 'progress-bar/progress-bar.template.html',
  controller: [function progressBarController() {
    var ctrl = this;
    ctrl.steps = function() {
      return new Array(ctrl.numOfSteps - 1);
    }
  }],
  bindings: {
    numOfSteps: '<',  //integer value, number of steps
    currentStep: '<'  //integer value, current step
  }
});
