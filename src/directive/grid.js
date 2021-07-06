/**
 * Animated load block
 */
(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .directive('trGrid', trGrid);

    /** @ngInject */
    function trGrid() {
        return {
            restrict: 'E',
            template: '<div ui-grid="ctrl.gridOptions" style="width: 100%; min-height: 410px;" ui-grid-edit ui-grid-pagination ui-grid-selection ui-grid-exporter ui-grid-resize-columns ui-grid-auto-resize></div>',
            scope: {
                setting: '=?trGridSetting',
                option: '=?trGridOption',
                getData: '&?trGridGetData',
                params: '=?trGridGetDataParams',
                getDataCallback: '=?trGridGetDataCallback'
            },
            controller: "trGridCtrl",
            controllerAs: "ctrl",
            link: function($scope, elem, attr, ctrl) {}
        };
    }
})();