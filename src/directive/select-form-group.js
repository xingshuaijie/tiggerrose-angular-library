(function() {
    'use strict';
    var templte =
        '<div class="form-group" style="border:0;" ng-class="{\'has-error\': selectForm[id].$invalid && (selectForm[id].partnerId.$dirty || selectForm.$submitted)}">\
                <label ng-if="selectLabel !== undefined" for="{{id}}">{{selectLabel}}&nbsp;</label>\
                <ui-select id={{id}} name="{{id}}" ng-model="item.selected" class="btn-group bootstrap-select form-control {{selectClass}}" ng-disabled="selectDisabled" ng-required="selectRequired" append-to-body="true" search-enabled="selectSearchEnabled" on-select="onSelect($item,$model)"\
                    ng-class="{\'has-error\': selectForm[id].$invalid && (selectForm[id].partnerId.$dirty || selectForm.$submitted)}">\
                    <ui-select-match placeholder="{{selectPlaceholder}}">\
                        <span ng-bind="$select.selected[selectText]"></span>\
                    </ui-select-match>\
                    <ui-select-choices repeat="item in selectDataItems | groupSelectpickerOptions: uiSelectChoices: $select.search " group-by="groupByFn">\
                        <span ng-bind-html="item[selectText] | highlight: $select.search""></span>\
                    </ui-select-choices>\
                </ui-select>\
            </div>';
    //{code: $select.search}
    angular.module('tiggerrose.theme')
        .directive('selectFormGroup', ['$timeout', selectFormGroup])
        .filter('groupSelectpickerOptions', ['$timeout', GroupSelectpickerOptions]);

    /** @ngInject */
    function GroupSelectpickerOptions() {
        return function(items, filterFn, searchVal) {
            var out = [];
            var props = filterFn(searchVal);
            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        item[prop] = item[prop] || '';
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }
            return out;
        };
    };

    /** @ngInject */
    function selectFormGroup($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                selectModel: '=',
                selectLabel: '@',
                selectPlaceholder: '@',
                selectSearchEnabled: '=?',
                selectDisabled: '=?',
                selectForm: '=?',
                selectDataItems: '=',
                selectKey: '@',
                selectText: '@',
                selectRequired: '=?',
                onSelected: '&?',
                onDatasouceChanged: '&?',
                selectGroupFiledName: '@?',
                selectClear: '=?',
                selectSvc: '=?',
                selectSvcParams: '=?',
                selectSvcCallback: '=?',
                selectClass: '@?',
                selectOpt: '=?'
                    // txtType: '@',
                    // txtMaxLength: '@'
            },
            // templateUrl: 'app/theme/components/selectFormGropu/selectFormGroup.html',
            template: templte,
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.id = attrs.selectModel.replace(/\./ig, '_');

                scope.selectOpt = scope.selectOpt || {};

                scope.selectOpt.setVal = function(val) {
                    scope.selectModel = val;
                    if (scope.selectDataItems && scope.selectDataItems.length) {
                        scope.item.selected = scope.selectDataItems.filter(function(item) {
                            return item[scope.selectKey] == val;
                        })[0];
                    } else {
                        doPost();
                    }
                };

                scope.item = {};
                scope.selectKey = scope.selectKey || 'value';
                scope.selectText = scope.selectText || 'label';
                scope.selectPlaceholder = scope.selectPlaceholder || '请选择';
                scope.uiSelectChoices = function(search) {
                    var t = {};
                    t[scope.selectGroupFiledName] = search;
                    return t;
                };

                if (scope.selectGroupFiledName) {
                    scope.groupByFn = function(item) {
                        return item[scope.selectGroupFiledName];
                    }
                } else {
                    scope.selectGroupFiledName = scope.selectText;
                }

                scope.onSelect = function(item, model) {
                    scope.selectModel = item[scope.selectKey];
                    if (scope.onSelected) {
                        $timeout(function() {
                            scope.onSelected()(scope.selectModel, model);
                        });
                    }
                };

                if (scope.selectClear) {
                    scope.selectClear.clear = function() {
                        scope.item.selected = undefined;
                    };
                }

                if (scope.selectOpt.isInit) {
                    doPost();
                }

                function doPost() {
                    var postData;
                    if (angular.isFunction(scope.selectSvcParams)) {
                        postData = scope.selectSvcParams();
                    } else {
                        postData = scope.selectSvcParams || {};
                    }

                    if (!!scope.selectSvc) {
                        scope.selectSvc(postData).then(function(result) {
                            if (scope.selectSvcCallback) {
                                scope.selectDataItems = scope.selectSvcCallback(result);
                            } else {
                                scope.selectDataItems = result.data;
                            }
                            scope.item.selected = scope.selectDataItems.filter(function(item) {
                                return item[scope.selectKey] == scope.selectModel;
                            })[0];
                        });
                    } else if (!!scope.selectDataItems && scope.selectDataItems.length) {
                        scope.item.selected = scope.selectDataItems.filter(function(item) {
                            return item[scope.selectKey] == scope.selectModel;
                        })[0];
                    }
                }
            }
        };
    }
})();