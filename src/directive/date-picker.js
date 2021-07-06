(function () {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('trDatePicker', ['$filter', trDatePicker]);

    /** @ngInject */
    function trDatePicker($filter) {
        return {
            restrict: 'A',
            require: '?^ngModel',
            scope: {
                option: '=?trDatePickerOption'
            },
            link: function (scope, elem, attr, ngModel) {
                // bower install eonasdan-bootstrap-datetimepicker#latest --save-dev
                // "eonasdan-bootstrap-datetimepicker": "^4.17.47"
                var defaultOpt = {
                    // language: 'zh-CN',
                    // locale:moment.locale('zh-cn'),
                    locale: scope.option.locale,
                    // autoclose: true,
                    // clearBtn: false,
                    // todayBtn: true,
                    // todayHighlight: true,
                    // bootcssVer: 3,
                    // fontAwesome: true,
                    format: 'YYYY-MM-DD',
                    // minView: "month"
                },
                    rendered = false,
                    instance;

                // 添加默认 option
                angular.extend(defaultOpt, scope.option || {});
                scope.option = defaultOpt;
                instance = elem.datetimepicker(scope.option)
                    .on('changeDate', function (ev) {
                        if (ev.date) {
                            var formartStr = getFormart();
                            var viewValue = $filter('date')(ev.date, formartStr);
                            ngModel.$setViewValue(viewValue);
                            elem.val(viewValue);
                            instance.datetimepicker('update');
                        }
                        if (scope.option.onDateChange && angular.isFunction(scope.option.onDateChange)) {
                            scope.option.onDateChange(ev);
                        }
                    })
                    .on('show', function (ev) {
                        if (scope.option.onShow && angular.isFunction(scope.option.onShow)) {
                            scope.option.onShow(ev);
                        }
                    });

                var selfRender = ngModel.$render;

                // 1、将 $modelValue 转变成 $viewValue
                ngModel.$formatters.push(function (modelValue) {
                    if (rendered && !ngModel.$dirty && ngModel.$isEmpty(modelValue)) {
                        ngModel.$setDirty();
                    }
                    if (!!modelValue) {
                        var date;
                        if (angular.isString(modelValue)) {
                            date = new Date(modelValue);
                        } else {
                            date = modelValue;
                        }
                        var formartStr = getFormart();
                        return $filter('date')(date, formartStr);
                    }
                    return modelValue;
                });

                // 2、将 $viewValue 渲染到指令模板中去。
                ngModel.$render = function () {
                    rendered = true;
                    selfRender();
                };

                // 3、当 ng-Model 变更时，将 $viewValue 转变成 $modelValue
                ngModel.$parsers.push(function (viewValue) {
                    if (!ngModel.$isEmpty(viewValue) && angular.isString(viewValue)) {
                        if (defaultOpt.minView == 'hour' || defaultOpt.minView == 'day') {
                            viewValue = viewValue + ':00';
                            if (defaultOpt.minView == 'day') {
                                var dt = new Date(viewValue);
                                dt.setMinutes(0);
                                dt.setSeconds(0);
                                return dt;
                            }
                        }
                        return new Date(viewValue);
                    }
                    return viewValue;
                });

                function getFormart() {
                    switch (defaultOpt.minView) {
                        case 'hour':
                            return 'yyyy-MM-dd HH:mm';
                        case 'day':
                            return 'yyyy-MM-dd HH:00';
                        case 'month':
                            return 'yyyy-MM-dd';
                    }
                    return 'yyyy-MM-dd';
                }
            }
        };
    }
})();