(function () {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('textFormGroup', ['toastr', '$q', textFormGroup]);

    /** @ngInject */
    function textFormGroup(toastr, $q) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, attrs) {
                var template =
                    '<div class="form-group" ng-class="{\'has-error\': txtForm[id].$invalid && (txtForm[id].$dirty || txtForm.$submitted)}">' +
                    '<label for="{{id}}" ng-if="txtLabel!== undefined">{{txtLabel}}&nbsp;</label>' +
                    '<input type="{{txtInputType}}"' +
                    (!!attrs.txtPattern ? ('ng-pattern="' + attrs.txtPattern + '"') : '') +
                    'maxlength="{{txtMaxLength}}"' +
                    'class="form-control"' +
                    'id="{{id}}"' +
                    (!!attrs.txtChange ? 'ng-change="onTextChange(txtModel)"' : '') +
                    'name="{{id}}"' +
                    'placeholder="{{txtPlaceholder}}"' +
                    'ng-model="txtModel"' +
                    'ng-disabled="txtDisabled"' +
                    'ng-required="txtRequired"/>' +
                    '</div>';
                return template;
            },
            scope: {
                txtModel: '=',
                txtLabel: '@',
                txtPlaceholder: '@',
                txtForm: '=?',
                txtDisabled: '=?',
                txtRequired: '=?',
                txtType: '@', // 文本框接收的输入类型[int,mobile,decimal]会为这三种类型单独添加 keypress 事件
                txtInputType: '@', // 文本框的 Type 属性
                txtMaxLength: '@',
                txtPattern: '@?',//正则表单验证
                txtEvents: '=?',
                txtRemoteValid: '=?',
                txtChange: '=?'
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                var inputElm = element.find('input');
                scope.id = !!attrs.id ? attrs.id : attrs.txtModel.replace(/\./ig, '_');
                scope.txtType = scope.txtType || 'text';
                scope.txtInputType = scope.txtInputType || 'text';
                if (!!scope.txtChange && angular.isFunction(scope.txtChange)) {
                    scope.onTextChange = scope.txtChange;
                }
                var mDefineProperty,
                    _ngModelCtrl,
                    _remoteValid;

                // // scope.txtType == 'int' 和 scope.txtType == 'mobile' 的 Object.defineProperty 对象
                // var numberDefineProperty = {
                //     set: function(val) {
                //         _ngModelCtrl = val;
                //         // 3、当 ng-Model 变更时，将 $viewValue 转变成 $modelValue
                //         _ngModelCtrl.$parsers.push(intNumberParsers);
                //         return _ngModelCtrl;
                //     },
                //     writable: true
                // };

                // mobile 只允许输入数字
                if (scope.txtType == 'mobile') {
                    inputElm.on('keypress', numberKeypress)
                        .on('beforepaste', numberBeforepaste);
                    scope.txtMaxLength = 11;
                    // mDefineProperty = numberDefineProperty;
                } else if (scope.txtType == 'int') {
                    var inputElm = element.find('input');
                    inputElm.on('keypress', numberKeypress)
                        .on('beforepaste', numberBeforepaste);
                    // mDefineProperty = numberDefineProperty;
                } else if (scope.txtType == 'decimal') {
                    var inputElm = element.find('input');
                    inputElm.on('keypress', decimalKeypress);
                }

                if (scope.txtEvents) {
                    var i;
                    for (i in scope.txtEvents) {
                        inputElm.on(i, scope.txtEvents[i]);
                    }
                }

                if (scope.txtRemoteValid) {
                    mDefineProperty = mDefineProperty || {};
                    _remoteValid = function (modelValue, viewValue) {
                        var deferred = $q.defer(),
                            currentValue = modelValue || viewValue;
                        if (currentValue) {
                            scope.txtRemoteValid.params = scope.txtRemoteValid.params || {};
                            scope.txtRemoteValid.params[scope.txtRemoteValid.key] = currentValue;
                            scope.txtRemoteValid.api(scope.txtRemoteValid.params)
                                .then(function (result) {
                                    var isValid = scope.txtRemoteValid.valid(result);
                                    if (isValid) {
                                        deferred.resolve(); //It's isValid
                                    } else {
                                        deferred.reject(); //Add isValid to $errors
                                    }
                                }).catch(function () {
                                    deferred.resolve();
                                });
                        } else {
                            deferred.resolve();
                        }
                        return deferred.promise;
                    };

                    angular.extend(mDefineProperty, {
                        $asyncValidators: {
                            remoteValid: _remoteValid
                        }
                    });
                }

                if (!!scope.txtForm) {
                    // 当创建 ngModelCtrl 对象时的监听事件
                    Object.defineProperty(scope.txtForm, scope.id, {
                        get: function () {
                            return _ngModelCtrl;
                        },
                        set: function (val) {
                            _ngModelCtrl = val;
                            angular.extend(_ngModelCtrl, mDefineProperty);
                        },
                        configurable: true
                    });
                }

                // // scope.txtType == 'int' 和 scope.txtType == 'mobile' 的 $parsers 函数
                // function intNumberParsers(viewValue) {
                //     if (!_ngModelCtrl.$isEmpty(viewValue)) {
                //         var num = viewValue.replace(/[^0-9]/ig, "");
                //         _ngModelCtrl.$setViewValue(num);
                //         _ngModelCtrl.$render();
                //         return num;
                //     }
                //     return viewValue;
                // }

                function numberKeypress(e) {
                    e = e || event;
                    return (e.keyCode >= 48 && e.keyCode <= 57);
                }

                function numberBeforepaste() {
                    // 复制粘贴时的处理
                    clipboardData.setData('text', clipboardData.getData('text').replace(/[^0-9]/ig, ''))
                }

                function decimalKeypress(e) {
                    e = e || event;
                    var val = (this.value + e.key);
                    if (val && val.length == 1 && val == '-') {
                        return true;
                    }
                    return !isNaN(val);
                }
            }
        };
    }
})();