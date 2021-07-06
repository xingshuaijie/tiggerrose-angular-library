/**
 * Animated load block
 */
(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('regionPicker', ['$timeout', regionPicker]);

    /** @ngInject */
    function regionPicker($timeout) {
        return {
            restrict: 'E',
            require: '?^ngModel',
            template: '<div class="city-picker-container form-control" data-toggle="city-picker" ng-disabled="setting.readonly" >\
                <input class="form-control" readonly type="text" data-toggle="city-picker"/>\
                <span class="picker-icon" ng-click="setting.picker(\'reset\')"><i class="ion-close-round"></i></span>\
            </div>',
            scope: {
                setting: '=?'
            },
            link: function($scope, elem, attr, ngModelCtrl) {
                var picker = elem.find('input'),
                    rendered = false;
                var inputObj = picker[0];

                $scope.setting = $scope.setting || {};
                if ($scope.setting.readonly) {
                    elem.css({ 'pointer-events': 'none', 'cursor': 'not-allowed' });
                }

                if (!!ngModelCtrl) {
                    var baseRender = ngModelCtrl.$render;
                    // 1、将 $modelValue 转变成 $viewValue
                    ngModelCtrl.$formatters.push(function(modelValue) {
                        if (rendered && !ngModelCtrl.$dirty && ngModelCtrl.$isEmpty(modelValue)) {
                            ngModelCtrl.$setDirty();
                        }

                        if (!ngModelCtrl.$isEmpty(modelValue)) {
                            if ($.isNumeric(modelValue)) {
                                setViewValueWithCode(modelValue);
                                return modelValue;
                            }
                            var result = $scope.setting.getSelected();
                            setViewValueWithStr(modelValue);
                            var arr = result.arrayCode;
                            if (arr.length) {
                                ngModelCtrl.$modelValue = arr[arr.length - 1];
                            }
                            return modelValue;
                        }
                        $scope.setting.picker('reset');
                        return modelValue;
                    });

                    // 2、将 $viewValue 渲染到指令模板中去。
                    ngModelCtrl.$render = function() {
                        rendered = true;
                        baseRender();
                    };

                    // 3、当 ng-Model 变更时，将 $viewValue 转变成 $modelValue
                    ngModelCtrl.$parsers.push(function(viewValue) {
                        selectedChange($scope.setting.getSelected());
                        if (!ngModelCtrl.$isEmpty(viewValue)) {
                            var arr = $scope.setting.picker('getCode').split(/,|\//);
                            return arr[arr.length - 1];
                        }
                        return viewValue;
                    });

                    Object.defineProperty(inputObj, 'value', {
                        set: function(val) {
                            ngModelCtrl.$viewValue = val;
                            if (rendered) {
                                ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                            }
                            return ngModelCtrl.$viewValue;
                        },
                        get: function() {
                            return ngModelCtrl.$viewValue;
                        }
                    });
                }
                var defaultSetting = {
                    simple: false,
                    placeholder: !!attr.placeholder ? attr.placeholder : '请选择省/市/区',
                    level: 'district'
                };

                $scope.setting = $scope.setting || {};
                angular.extend($scope.setting, angular.extend(defaultSetting, $scope.setting));

                /**
                 * 获取当前选择的省市区
                 */
                $scope.setting.getSelected = function() {
                    var code = $scope.setting.picker('getCode');
                    var codeArr = code.split(/,|\//);
                    var codeLen = codeArr.length;

                    var val = $scope.setting.picker('getVal');
                    var valArr = val.split(/,|\//);
                    var valLen = valArr.length;

                    return {
                        arrayCode: codeArr,
                        code: code,
                        provinceCode: codeLen >= 1 ? codeArr[0] || '' : '',
                        cityCode: codeLen >= 2 ? codeArr[1] || '' : '',
                        districtCode: codeLen == 3 ? codeArr[2] || '' : '',
                        arrayText: valArr,
                        text: val,
                        provinceText: valLen >= 1 ? valArr[0] || '' : '',
                        cityText: valLen >= 2 ? valArr[1] || '' : '',
                        districtText: valLen == 3 ? valArr[2] || '' : '',
                    };
                };

                // 绑定 city-Picker 的内置函数
                $scope.setting.picker = function(fnName) {
                    var t = picker.data('citypicker')[fnName];
                    if (angular.isFunction(t)) {
                        var args = [].slice.call(arguments, 1);
                        return t.apply(picker.data('citypicker'), args);
                    }
                    return t;
                };

                picker.citypicker($scope.setting);

                function selectedChange(result) {
                    if ($scope.setting.onSelectChange) {
                        $scope.setting.onSelectChange($scope.setting.picker, result);
                    }
                }

                /**
                 * 根据行政区编码设置 view 文本
                 * @param {number} codeNo 
                 */
                function setViewValueWithCode(codeNo) {
                    var code = codeNo + '';
                    if ($.isNumeric(code) && code.length != 6) {
                        return;
                    }

                    var pCode = code.substr(0, 2),
                        cCode = code.substr(2, 2),
                        dCode = code.substr(4, 2),
                        province = '',
                        city = '',
                        district = '',
                        p, c, d;

                    if (dCode != '00') {
                        p = pCode + '0000';
                        c = pCode + cCode + '00';
                        d = codeNo;
                        city = ChineseDistricts[p][c];
                        district = ChineseDistricts[c][d];
                        province = getProvinceNameByCode(p);
                    } else if (cCode != '00') {
                        p = pCode + '0000';
                        c = pCode + cCode + '00';
                        city = ChineseDistricts[p][c];
                        province = getProvinceNameByCode(p);
                    } else {
                        p = pCode + '0000';
                        province = getProvinceNameByCode(p);
                    }

                    $scope.setting.picker('reset');
                    angular.extend(picker.data('citypicker').options, {
                        province: province,
                        city: city,
                        district: district
                    });
                    $scope.setting.picker('refresh');
                }

                /**
                 * 根据 Province Code 获取 Province Text
                 * @param {number} provinceCode 
                 */
                function getProvinceNameByCode(provinceCode) {
                    var data = ChineseDistricts['86'],
                        cData, ccData;
                    for (var i in data) {
                        cData = data[i];
                        for (var j in cData) {
                            ccData = cData[j];
                            if (ccData.code == provinceCode) {
                                return ccData.address;
                            }
                        }
                    }
                    return '';
                }

                /**
                 * 根据 string 值设置 view 文本
                 * @param {number} codeNo 
                 */
                function setViewValueWithStr(strVal) {
                    var arr = strVal.split(/,|\//);
                    var len = arr.length;
                    $scope.setting.picker('reset');
                    angular.extend(picker.data('citypicker').options, {
                        province: len >= 1 ? arr[0] || '' : '',
                        city: len >= 2 ? arr[1] || '' : '',
                        district: len == 3 ? arr[2] || '' : '',
                    });
                    $scope.setting.picker('refresh');
                }
            }
        };
    }
})();