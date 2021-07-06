(function () {
    'use strict';

    var template =
        '<div class="form-group">\
            <label ng-if="!!datepickerLabel" for="{{id}}" ng-bind="datepickerLabel"></label>\
            <div ng-disabled="datepickerDisabled" class="input-date input-group"\
                 ng-class="{\'has-error\': datepickerForm[id].$invalid && (datepickerForm[id].$dirty || datepickerForm.$submitted)}">\
                <input tr-date-picker tr-date-picker-option="datepickerOption" autocomplete="off"\
                    ng-disabled="datepickerDisabled" ng-required="datepickerRequired"\
                    id="{{id}}" name="{{id}}" class="form-control" type="text" ng-model="datepickerModel"\
                    placeholder="{{datepickerPlaceholder}}"/>\
                <span ng-if="showCloseButton" class="input-group-addon addon-right" ng-disabled="datepickerDisabled"\
                    ng-click="datePicker.clearInput()">\
                    <i class="ion-close-round"></i>\
                </span>\
            </div>\
        </div>';

    angular.module('tiggerrose.theme')
        .controller('datepickerFormGroupCtrl', ['$scope', '$filter', '$parse', datepickerFormGroupCtrl])
        .directive('datepickerFormGroup', datepickerFormGroup);

    function datepickerFormGroupCtrl($scope, $filter, $parse) {
        var beginElem, endElem, beginElemId, endElemId, isLoaded = false;
        $scope.datepickerOption = $scope.datepickerOption || {
            // minView: 'hour',
            // format: 'yyyy-mm-dd hh:ii'
        };

        // $scope.datepickerOption.minView = $scope.datepickerMinView || 'month';
        // $scope.datepickerOption.format = $scope.datepickerFormat || 'yyyy-mm-dd hh:ii';
        // if (!$scope.datepickerFormat) {
        //     $scope.datepickerOption.format =
        //         $scope.datepickerFormat = $scope.datepickerOption.minView == 'month' ? 'yyyy-mm-dd' : 'yyyy-mm-dd hh:ii';
        // }

        if ($scope.datepickerBegin || $scope.datepickerEnd || $scope.datepickerChange) {
            $scope.datepickerOption.onShow = onShow;
            $scope.datepickerOption.onDateChange = onchange;
        }

        // 清空时间
        $scope.datePicker = {
            clearInput: function () {
                $scope.datepickerModel = '';
            }
        }

        function onchange(e) {
            if ($scope.datepickerForm && !$scope.datepickerForm[beginElemId].$validators.compare) {
                $scope.datepickerForm[beginElemId].$validators.compare = function (val) {
                    return timeCompare(val, $scope.datepickerForm[endElemId].$modelValue, endElemId);
                };
            }

            if ($scope.datepickerForm && !$scope.datepickerForm[endElemId].$validators.compare) {
                $scope.datepickerForm[endElemId].$validators.compare = function (val) {
                    return timeCompare($scope.datepickerForm[beginElemId].$modelValue, val, beginElemId);
                };
            }

            if ($scope.datepickerChange) {
                $scope.datepickerChange(e);
            }
        }

        function onShow() {
            if (!isLoaded) {
                if ($scope.datepickerBegin) {
                    beginElemId = $scope.datepickerBegin.replace(/\./ig, '_');
                    endElemId = $scope.id;
                } else if ($scope.datepickerEnd) {
                    beginElemId = $scope.id;
                    endElemId = $scope.datepickerEnd.replace(/\./ig, '_');
                }
                beginElem = $('#' + beginElemId);
                endElem = $('#' + endElemId);
                isLoaded = true;
            }

            if ($scope.datepickerBegin) {
                var starDate = !!$scope.datepickerForm[beginElemId].$modelValue ?
                    $scope.datepickerForm[beginElemId].$modelValue :
                    new Date(-8640000000000000);
                endElem.datetimepicker('setStartDate', starDate);
            }

            if ($scope.datepickerEnd) {
                var endDate = !!$scope.datepickerForm[endElemId].$modelValue ?
                    $scope.datepickerForm[endElemId].$modelValue :
                    new Date(8640000000000000);
                beginElem.datetimepicker('setEndDate', endDate);
            }
        }

        function timeCompare(beginTime, endTime, id) {
            var isValid = !(beginTime && endTime && beginTime > endTime);
            $scope.datepickerForm[id].$setValidity('compare', isValid);
            return isValid;
        }
    }

    /** @ngInject */
    function datepickerFormGroup() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                showCloseButton: '=',
                datepickerModel: '=',
                datepickerLabel: '@',
                datepickerPlaceholder: '@',
                datepickerForm: '=?',
                datepickerDisabled: '=?',
                datepickerRequired: '=?',
                datepickerOption: '=?',
                datepickerMinView: '@?',
                datepickerFormat: '@?',
                datepickerBegin: '@?',
                datepickerEnd: '@?',
                datepickerChange: '=?'
            },
            template: template,
            controller: 'datepickerFormGroupCtrl',
            compile: function (tElem, tAttrs) {
                return {
                    pre: function (scope, iElem, iAttrs) {
                        angular.forEach(iAttrs.$attr, function (v, i) {
                            if (!i.startsWith('datepicker') && i != 'class') {
                                scope.datepickerOption[i] = iAttrs[i];
                            }
                        });
                    },
                    post: function (scope, iElem, iAttrs) {
                        scope.id = iAttrs.datepickerModel.replace(/\./ig, '_');
                        scope.datepickerOption.locale = scope.datepickerOption.local || scope.$root.$currentLanguage;
                    }
                }
            }
        };
    }
})();