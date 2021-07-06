/**
 * @author a.demeshko
 * created on 3/1/16
 */
(function () {
    'use strict';

    angular.module('tiggerrose.theme')
        .service('uiGridService', ['$q', 'searchLocalStorageService', uiGridService]);

    /** @ngInject */
    function uiGridService($q, searchLocalStorageService) {
        this.getDefaultOption = function ($scope, ctrl, paramsFn, api, gridAppScope) {
            _getDefaultOption.call(ctrl, $scope, paramsFn, api, gridAppScope);
        };

        function _getDefaultOption($scope, paramsFn, api, gridAppScope) {
            var ctrl = this;
            angular.extend(ctrl, {
                enableSorting: true, //是否排序
                useExternalSorting: false, //是否使用自定义排序规则
                enableGridMenu: true, //是否显示grid 菜单
                enableColumnMenus: false, //是否显示 column 菜单
                showGridFooter: false, //是否显示grid footer
                enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
                enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示
                enableFiltering: true,
                headerRowHeight: 80,
                enableColumnMoving: true, // 列可以拖动改变位置

                //-------- 分页属性 ----------------
                enablePagination: true, //是否分页，默认为true
                enablePaginationControls: true, //使用默认的底部分页
                paginationPageSizes: [10, 15, 20, 50], //每页显示个数可选项
                paginationCurrentPage: 1, //当前页码
                paginationPageSize: 20, //每页显示个数
                useExternalPagination: true, //是否使用分页按钮

                //----------- 选中 ----------------------
                enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
                enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
                enableRowHeaderSelection: false, //是否显示选中checkbox框 ,默认为true
                enableRowSelection: true, // 行选择是否可用，默认为true;
                enableSelectAll: true, // 选择所有checkbox是否可用，默认为true; 
                enableSelectionBatchEvent: true, //默认true
                modifierKeysToMultiSelect: false, //默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
                multiSelect: false, // 是否可以选择多个,默认为true;
                noUnselect: false, //默认false,选中后是否可以取消选中
                selectionRowHeaderWidth: 30, //默认30 ，设置选择列的宽度；

                onRegisterApi: function (gridApi) {
                    ctrl.gridApi = gridApi;
                    if (gridAppScope) {
                        angular.extend(gridApi.grid.appScope, gridAppScope);
                    }

                    if (gridApi.pagination) {
                        //分页按钮事件
                        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                            // if ($scope.setting.getPage) {
                            //     $scope.setting.getPage(newPage, pageSize);
                            // }
                            var params = {};
                            if (paramsFn && angular.isFunction(paramsFn)) {
                                params = paramsFn();
                            }
                            var pageOption = {
                                options: gridApi.grid.options,
                                pageIndex: newPage,
                                pageSize: pageSize,
                                params: params,
                                api: api
                            };
                            if (ctrl.getPageOpt) {
                                angular.extend(pageOption, ctrl.getPageOpt);
                            }
                            _getPage.call(pageOption);
                        });
                    }

                    if (gridApi.rowEdit && gridApi.rowEdit.on.saveRow && gridApi.rowEdit.setSavePromise) {
                        gridApi.rowEdit.on.saveRow($scope, function (rowEntity) {
                            var promise = $q.defer();
                            gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
                            promise.resolve();
                        });
                    }

                    if (ctrl.onGridRegisterApi) {
                        ctrl.onGridRegisterApi(gridApi);
                    }

                    // searchLocalStorageService.getStorage.call($scope);
                    // _getPage.call(angular.extend({ params: {} }, $scope.vm.gridOptions.getPageOpt));
                }
            });
        }

        this.getPage = function (opt, isFirstGetData) {
            var that = this;
            if (isFirstGetData) {
                var serCon = searchLocalStorageService.getStorage.call(that);
                if (serCon)
                    that.vm.search = JSON.parse(serCon);
                // 2020-04-16T05:33:53.955Z
                // 2020-04-15T16:00:00.000Z
                var reg = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/ig;
                for (var key in that.vm.search) {
                    if (angular.isString(that.vm.search[key]) && reg.test(that.vm.search[key])) {
                        that.vm.search[key] = new Date(that.vm.search[key]);
                        reg.lastIndex = -1;
                    }
                }
            }
            else {
                searchLocalStorageService.setStorage.call(that);
            }
            return _getPage.call(opt);
        };

        function _getPage() {
            var opt = this;
            var gridOptions = opt.options;
            var pageIndex = opt.pageIndex || gridOptions.paginationCurrentPage;
            var params = opt.params || {};
            var api = opt.api;
            var apiCallback = opt.apiCallback;
            var pageSize = opt.pageSize || gridOptions.paginationPageSize;

            if (angular.isFunction(opt.getParams)) {
                params = opt.getParams();
            }

            if (gridOptions.paginationCurrentPage != pageIndex) {
                gridOptions.paginationCurrentPage = pageIndex;
            }
            var skipCount = (pageIndex - 1) * pageSize;
            angular.extend(params, {
                maxResultCount: pageSize || undefined,
                skipCount: !isNaN(skipCount) ? skipCount : undefined,
                // sorting: "creationTime DESC",
            });
            return api(params).then(function (result) {
                if (apiCallback && angular.isFunction(apiCallback)) {
                    gridOptions.data = apiCallback(result);
                } else {
                    gridOptions.data = result.data.items;
                }
                gridOptions.totalItems = result.data.totalCount;
                return result;
            });
        };
    }
})();