(function() {
    'use strict';
    var template =
        '<div class="form-group text-left">\
            <label ng-if="regionLabel !== undefined" for="{{id}}">{{regionLabel}}&nbsp;</label>\
            <region-picker \
                id="{{id}}" name="{{id}}" ng-model="regionModel" \
                placeholder="{{regionPlaceholder}}" ng-required="regionRequired" \
                ng-disabled="regionDisabled" setting="regionSeting" \
                ng-class="{\'has-error\': regionForm[id].$invalid && (regionForm[id].$dirty || regionForm.$submitted)}">\
            </region-picker>\
        </div>';
    angular.module('tiggerrose.theme')
        .controller('regionFormGroupCtrl', ['$scope', '$timeout', regionFormGroupCtrl])
        .directive('regionFormGroup', regionFormGroup);

    function regionFormGroupCtrl($scope, $timeout) {
        if (!$scope.regionSeting) {
            $scope.regionSeting = {};
        }
        $scope.regionSeting.readonly = $scope.regionDisabled;
        $scope.regionSeting.onSelectChange = function(instance, result) {
            $scope.regionProvince = result.provinceCode;
            $scope.regionCity = result.cityCode;
            $scope.regiondistrict = result.districtCode;
            if ($scope.regionSeting.onChange) {
                $timeout(function() {
                    // region 插件不是 Angular 插件，因此需要用 $timeout
                    $scope.regionSeting.onChange()(instance, result);
                });
            }
        };
    }

    /** @ngInject */
    function regionFormGroup() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                regionModel: '=',
                // 绑定当前选择的【省】
                regionProvince: '=?',
                // 绑定当前选择的【市】
                regionCity: '=?',
                // 绑定当前选择的【区】
                regiondistrict: '=?',
                regionLabel: '@',
                regionPlaceholder: '@',
                regionForm: '=?',
                regionDisabled: '=?',
                regionRequired: '=?',
                regionSeting: '=?',
                regionOnChange: '&?'
            },
            // templateUrl: 'app/theme/components/regionFormGroup/regionFormGroup.html',
            template: template,
            controller: 'regionFormGroupCtrl',
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.id = attrs.regionModel.replace(/\./ig, '_');
                if (scope.regionOnChange) {
                    scope.regionSeting.onChange = scope.regionOnChange;
                }
            }
        };
    }
})();