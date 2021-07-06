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
                    // 当创建 ngModelCtrl 对象时的监听事件
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
                    // // 1、将 $modelValue 转变成 $viewValue
                    // modelCtrl.$formatters.push(function(modelValue) {
                    //     return modelValue;
                    // });

                    // // 2、将 $viewValue 渲染到指令模板中去。
                    // modelCtrl.$render = function() {
                    // };

                    // 3、当 ng-Model 变更时，将 $viewValue 转变成 $modelValue
                    modelCtrl.$parsers.push(function (viewValue) {
                        modelCtrl.$modelValue = scope.radioModel[scope.radioModelKey] = viewValue;
                        return viewValue;
                    });
                }
            }
        };
    }
})();