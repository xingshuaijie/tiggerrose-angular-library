(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('switcherFormGroup', autoFocus)
        .directive('uiSwitcher', uiSwitcher);

    /** @ngInject */
    function autoFocus() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                switcherModel: '=',
                switcherLabel: '@',
                switcherForm: '=?',
                switcherDisabled: '=?',
                switcherRequired: '=?',
                switcherTrueText: '@',
                switcherFalseText: '@',
            },
            template: function(element, attrs) {
                return '<div class="form-group" ng-class="{\'has-error\': switcherForm[id].$invalid && (switcherForm[id].$dirty || switcherForm.$submitted)}">\
                <label for="{{id}}" ng-bind="switcherLabel" ng-if="switcherLabel!== undefined"></label>\
                <div>\
                    <ui-switcher switcher-style="primary" switcher-value="switcherModel" \
                        true-text="{{switcherTrueText}}" \
                        false-text="{{switcherFalseText}}" \
                        ng-disabled="switcherDisabled" \
                        ng-required="switcherRequired">\
                    </ui-switcher>\
                </div>\
                </div>'
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.id = attrs.switcherModel.replace(/\./ig, '_');
            }
        };
    }

    function uiSwitcher() {
        return {
            template: function() {
                return '<label class="switcher-container">\
                            <input type="checkbox" ng-model="switcherValue">\
                            <div class="switcher" ng-class="::switcherStyle">\
                                <div class="handle-container">\
                                    <span class="handle handle-on">{{trueText}}</span>\
                                    <span class="handle"></span>\
                                    <span class="handle handle-off">{{falseText}}</span>\
                                </div>\
                            </div>\
                        </label>';
            },
            scope: {
                switcherStyle: '@',
                switcherValue: '=',
                trueText: '@',
                falseText: '@'
            }
        };
    }

})();