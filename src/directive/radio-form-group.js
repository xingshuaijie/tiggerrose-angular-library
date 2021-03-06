(function () {
    'use strict';
    angular.module('tiggerrose.theme')
        .directive('radioFormGroup', ['toastr', '$q', textFormGroup]);

    /** @ngInject */
    function textFormGroup(toastr, $q) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                radioModel: '=',
                radioModelKey: '@',
                radioLabel: '@',
                radioPlaceholder: '@',
                radioForm: '=?',
                radioDisabled: '=?',
                radioRequired: '=?',
                radioEvents: '=?',
                radioRemoteValid: '=?',
                radioDataItems: '=',
                radioKey: '@',
                radioText: '@',
            },
            template: function (elem, attrs) {
                return '<div>\
                            <div class="controls radio-controls form-group">\
                                <label class="radio-header">{{radioLabel}}&nbsp;</label>\
                                <span class="radio-items" ng-class="{\'has-error\': radioForm[id].$invalid && (radioForm[id].partnerId.$dirty || radioForm.$submitted)}">\
                                    <label ng-repeat="item in radioDataItems" class="radio custom-radio">\
                                        <input type="radio" ng-model="radioModel[radioModelKey]" name="{{id}}" value="{{item[radioKey]}}" ng-checked="item.defaultChecked" ng-required="radioRequired"/>\
                                        <span ng-bind="item[radioText]"></span>\
                                    </label>\
                                </span>\
                            </div>\
                        </div>';
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var inputElm = element.find('input'),
                    _ngModelCtrl;
                scope.id = attrs.radioModel.replace(/\./ig, '_') + '_' + scope.radioModelKey;
                scope.radioKey = scope.selectKey || 'value';
                scope.radioText = scope.selectText || 'label';

                if (!!scope.radioForm) {
                    // ????????? ngModelCtrl ????????????????????????
                    Object.defineProperty(scope.radioForm, scope.id, {
                        get: function () {
                            return _ngModelCtrl;
                        },
                        set: function (val) {
                            _ngModelCtrl = val;
                            initModelCtrl(_ngModelCtrl);
                        },
                        configurable: true
                    });
                }

                function initModelCtrl(modelCtrl) {
                    // // var baseRender = modelCtrl.$render;
                    // // 1?????? $modelValue ????????? $viewValue
                    // modelCtrl.$formatters.push(function(modelValue) {
                    //     return modelValue;
                    // });

                    // // 2?????? $viewValue ??????????????????????????????
                    // modelCtrl.$render = function() {
                    // };

                    // 3?????? ng-Model ??????????????? $viewValue ????????? $modelValue
                    modelCtrl.$parsers.push(function (viewValue) {
                        modelCtrl.$modelValue = scope.radioModel[scope.radioModelKey] = viewValue;
                        return viewValue;
                    });
                }
            }
        };
    }
})();