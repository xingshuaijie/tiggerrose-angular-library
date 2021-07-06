(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('textareaFormGroup', textareaFormGroup);

    var template =
        '<div class="form-group" ng-class="{\'has-error\': txtForm[id].$invalid && (txtForm[id].$dirty || txtForm.$submitted)}">\
            <label for="{{id}}" ng-bind="txtLabel"></label>\
            <textarea type="text" maxlength="{{txtMaxLength}}" class="form-control" id="{{id}}" name="{{id}}" placeholder="{{txtPlaceholder}}" ng-model="txtModel" ng-class="{\'has-error\': txtForm[id].$invalid && (txtForm[id].$dirty || txtForm.$submitted)}" ng-disabled="txtDisabled" ng-required="txtRequired"></textarea>\
        </div>';
    /** @ngInject */
    function textareaFormGroup() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                txtModel: '=',
                txtLabel: '@',
                txtPlaceholder: '@',
                txtForm: '=?',
                txtDisabled: '=?',
                txtRequired: '=?',
                txtMaxLength: '@'
            },
            // templateUrl: 'app/theme/components/textareaFormGroup/textareaFormGroup.html',
            template: template,
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.id = attrs.txtModel.replace(/\./ig, '_');
            }
        };
    }
})();