angular.module('hackathonRegistrationApp').component('registerTeamMembers', {
  templateUrl: 'register-team-members/register-team-members.template.html',
  controller: [function registerTeamMembersController() {
    var ctrl = this;

    ctrl.$onInit = function() {
      ctrl.getMainElement().style.height = '0px';
      ctrl.members = [];
      ctrl.memberInfoShowing = false;
    }

    ctrl.$onChanges = function() {
      //Note: $onChanges runs before AngularJS displays bindings. $onInit
      //runs after AngularJS displays bindings and doesn't apply changes.
      ctrl.employmentTypes = ctrl.employmentTypes.split(',');
      ctrl.locations = ctrl.locations.split(',');
      ctrl.tshirtSizes = ctrl.tshirtSizes.split(',');
    }

    ctrl.newMember = function() {
      if (!ctrl.memberInfoShowing) {
        ctrl.memberIndex = -1;
        ctrl.tmpMember = {};
        ctrl.buttonText = 'Add Member';
        ctrl.expand();
      }
    }

    ctrl.editMember = function(index) {
      if (!ctrl.memberInfoShowing) {
        ctrl.memberIndex = index;
        ctrl.tmpMember = angular.copy(ctrl.members[index]);
        ctrl.buttonText = 'Update Member';
        ctrl.expand();
      }
    }

    ctrl.addMember = function() {
      if (ctrl.memberIndex < 0) {
        ctrl.members.push(ctrl.tmpMember);
      } else {
        ctrl.members[ctrl.memberIndex] = ctrl.tmpMember;
      }
      ctrl.teamMembers({members: ctrl.members});
      ctrl.collapse();
    }

    ctrl.expand = function() {
      ctrl.memberInfoShowing = true;
      var element = ctrl.getMainElement();
      var height = element.scrollHeight;
      element.style.height = height + 'px';
      element.addEventListener('transitionend', function(e) {
        element.removeEventListener('transitionend', arguments.callee);
        element.style.height = null;
      });
    }

    ctrl.collapse = function() {
      ctrl.memberInfoShowing = false;
      var element = ctrl.getMainElement();
      var height = element.scrollHeight;
      var elementTransition = element.style.transition;
      element.style.transition = '';
      window.requestAnimationFrame(function() {
        element.style.height = height + 'px';
        element.style.transition = elementTransition;
        window.requestAnimationFrame(function() {
          element.style.height = '0px';
        });
      });
    }

    ctrl.getMainElement = function() {
      return angular.element(document.querySelector('#member-information'))[0];
    }
  }],
  bindings: {
    employmentTypes: '@',
    locations: '@',
    tshirtSizes: '@',
    teamMembers: '&'
  }
});
