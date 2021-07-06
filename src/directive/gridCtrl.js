/**
 * Animated load block
 */
(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .controller('trGridCtrl', ['$scope', trGridCtrl]);

    /** @ngInject */
    function trGridCtrl($scope) {
        var vm = this;
        $scope.setting = $scope.setting || {};
        angular.extend($scope, $scope.setting);

        /**
         * column 默认设置
         */
        function getDefaultColSetting() {
            return {
                enableColumnMenu: false
            };
        }

        // 添加 column 默认设置
        var i = 0,
            len = $scope.option.columnDefs.length;
        for (i; i < len; i++) {
            $scope.option.columnDefs[i] = angular.extend(getDefaultColSetting(), $scope.option.columnDefs[i]);
        }

        vm.gridOptions = {
            // data: 'myData', // 加上该名字后无法绑定数据????gri
            enableSorting: true, //是否排序
            useExternalSorting: false, //是否使用自定义排序规则
            enableGridMenu: true, //是否显示grid 菜单
            enableColumnMenus: false, //是否显示 column 菜单
            showGridFooter: true, //是否显示grid footer
            enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
            enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

            //-------- 分页属性 ----------------
            enablePagination: true, //是否分页，默认为true
            enablePaginationControls: true, //使用默认的底部分页
            paginationPageSizes: [10, 15, 20, 50], //每页显示个数可选项
            paginationCurrentPage: 1, //当前页码
            paginationPageSize: 20, //每页显示个数
            //paginationTemplate:"<div></div>", //自定义底部分页代码
            // totalItems: 0, // 总数量
            useExternalPagination: true, //是否使用分页按钮

            //----------- 选中 ----------------------
            enableFooterTotalSelected: true, // 是否显示选中的总数，默认为true, 如果显示，showGridFooter 必须为true
            enableFullRowSelection: true, //是否点击行任意位置后选中,默认为false,当为true时，checkbox可以显示但是不可选中
            enableRowHeaderSelection: false, //是否显示选中checkbox框 ,默认为true
            enableRowSelection: true, // 行选择是否可用，默认为true;
            enableSelectAll: true, // 选择所有checkbox是否可用，默认为true; 
            enableSelectionBatchEvent: true, //默认true
            // isRowSelectable: function(row) { //GridRow
            //     if (row.entity.age > 45) {
            //         row.grid.api.selection.selectRow(row.entity); // 选中行
            //     }
            // },
            modifierKeysToMultiSelect: false, //默认false,为true时只能 按ctrl或shift键进行多选, multiSelect 必须为true;
            multiSelect: false, // 是否可以选择多个,默认为true;
            noUnselect: false, //默认false,选中后是否可以取消选中
            selectionRowHeaderWidth: 30, //默认30 ，设置选择列的宽度；

            // //--------------导出----------------------------------
            // exporterAllDataFn: function() {
            //     return getPage(1, vm.gridOptions.totalItems);
            // },
            // exporterCsvColumnSeparator: ',',
            // exporterCsvFilename: 'download.csv',
            // exporterFieldCallback: function(grid, row, col, value) {
            //     if (value == 50) {
            //         value = "可以退休";
            //     }
            //     return value;
            // },
            // exporterHeaderFilter: function(displayName) {
            //     return 'col: ' + name;
            // },
            // exporterHeaderFilterUseName: true,
            // exporterMenuCsv: true,
            // exporterMenuLabel: "Export",
            // exporterMenuPdf: true,
            // exporterOlderExcelCompatibility: false,
            // exporterPdfCustomFormatter: function(docDefinition) {
            //     docDefinition.styles.footerStyle = { bold: true, fontSize: 10 };
            //     return docDefinition;
            // },
            // exporterPdfFooter: {
            //     text: 'My footer',
            //     style: 'footerStyle'
            // },
            // exporterPdfDefaultStyle: {
            //     fontSize: 11,
            //     font: 'simblack' //font 设置自定义字体
            // },
            // exporterPdfFilename: 'download.pdf',
            // //   exporterPdfFooter : {
            // //  columns: [
            // //    'Left part',
            // //    { text: 'Right part', alignment: 'right' }
            // //  ]
            // // },  
            // exporterPdfFooter: function(currentPage, pageCount) {
            //     return currentPage.toString() + ' of ' + pageCount;
            // },
            // exporterPdfHeader: function(currentPage, pageCount) {
            //     return currentPage.toString() + ' of ' + pageCount;
            // },
            // exporterPdfMaxGridWidth: 720,
            // exporterPdfOrientation: 'landscape', //  'landscape' 或 'portrait' pdf横向或纵向
            // exporterPdfPageSize: 'A4', // 'A4' or 'LETTER' 
            // exporterPdfTableHeaderStyle: {
            //     bold: true,
            //     fontSize: 12,
            //     color: 'black'
            // },
            // exporterPdfTableLayout: null,
            // exporterPdfTableStyle: {
            //     margin: [0, 5, 0, 15]
            // },
            // exporterSuppressColumns: ['buttons'],
            // exporterSuppressMenu: false,

            //---------------api---------------------
            onRegisterApi: function(gridApi) {
                $scope.setting.gridApi = vm.gridApi = gridApi;

                if ($scope.setting.onRegisterApi) {
                    $scope.setting.onRegisterApi(gridApi);
                }

                if ($scope.setting.cellTemplateFn) {
                    angular.extend(gridApi.grid.appScope, $scope.setting.cellTemplateFn);
                }

                // //分页按钮事件
                // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                //     if ($scope.setting.getPage) {
                //         $scope.setting.getPage(newPage, pageSize);
                //     }
                // });
                // //行选中事件
                // gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
                //     if (row) {
                //         vm.testRow = row.entity;
                //     }
                // });
            }
        };

        angular.extend(vm.gridOptions, $scope.option);

        ($scope.setting.getPage = function(curPage, pageSize) {
            if ($scope.api) {
                if (!!vm.gridApi && vm.gridApi.grid.options.paginationCurrentPage != curPage) {
                    vm.gridApi.grid.options.paginationCurrentPage = curPage;
                }
                a56.setParams($scope.setting.setParams, getData);

                function getData(params) {
                    params = params || {};
                    pageSize = pageSize || vm.gridOptions.paginationPageSize;
                    $scope.params = $scope.params || {};
                    angular.extend(params, $scope.params, $scope.setting.params || {});
                    angular.extend(params, {
                        maxResultCount: pageSize,
                        skipCount: (curPage - 1) * pageSize,
                        // sorting: "creationTime DESC",
                    });
                    $scope.api(params).then(function(result) {
                        if (!!$scope.apiCallback && angular.isFunction($scope.apiCallback)) {
                            vm.gridOptions.data = $scope.apiCallback(result);
                        } else {
                            vm.gridOptions.data = result.data.items;
                        }
                        vm.gridOptions.totalItems = result.data.totalCount;
                    });
                    // vm.gridOptions.data = mydefalutData.slice(firstRow, firstRow + pageSize);
                    //或者像下面这种写法
                    //$scope.myData = mydefalutData.slice(firstRow, firstRow + pageSize);
                }
            }
        })(1);
    }
})();