/**
 * @author a.demeshko
 * created on 3/1/16
 */
(function () {
    'use strict';

    angular.module('tiggerrose.theme')
        .value('alterModalType', {
            info: 0,
            warning: 1,
            success: 2,
            danger: 3
        })
        .service('alterModal', ['alterModalType', '$uibModal', alterModal])
        .controller('alterModalCtrl', [
            '$scope',
            '$uibModalInstance',
            'alterModalType',
            'content',
            'localizationService',
            alterModalCtrl
        ]);

    /** @ngInject */
    function alterModal(alterModalType, $uibModal) {
        function openModal(isConfirm, modalSetting) {
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                backdropClass: 'modal-backdrop',
                controller: 'alterModalCtrl',
                controllerAs: 'ctrl',
                keyboard: false, //按ESC按钮时，是否关闭模态框,默认值为 true
                template: function () {
                    return '<div class="modal-content">\
                                <div class="modal-header" ng-class="ctrl.modalType">\
                                    <i class="modal-icon" ng-class="ctrl.icon"></i>\
                                    <span ng-bind="ctrl.title"></span>\
                                </div>\
                                <div class="modal-body text-center">\
                                    <div ng-bind-html="ctrl.message"></div>\
                                </div>\
                                <div class="modal-footer">\
                                    <button ng-if="ctrl.isConfirm" type="button" class="btn" ng-class="{\'btn-danger\':ctrl.isConfirm,\'btn-success\':!ctrl.isConfirm}" ng-click="$dismiss()" ng-bind="ctrl.btnName"></button>\
                                    <button type="button" class="btn btn-success" ng-click="$close(\'ok\')">\
                                    <span localization="Btn_Ok"></span>\
                                    </button>\
                                </div>\
                            </div>';
                },
                resolve: {
                    content: function () {
                        var setting = {
                            message: '',
                            modalType: alterModalType.success,
                            isConfirm: isConfirm,
                            title: '提示'
                        };
                        angular.extend(setting, modalSetting);
                        return setting;
                    }
                }
            });
            return modalInstance.result;
        }
        return {
            alter: function (modalSetting) {
                var setting = {};
                if (angular.isString(modalSetting)) {
                    setting.message = modalSetting;
                } else {
                    setting = modalSetting;
                }
                setting.modalType = setting.modalType || alterModalType.success;
                return openModal(false, setting);
            },
            confirm: function (modalSetting, modalType) {
                var setting = {};
                if (angular.isString(modalSetting)) {
                    setting.message = modalSetting;
                } else {
                    setting = modalSetting;
                }
                setting.modalType = modalType || alterModalType.danger;
                return openModal(true, setting);
            }
        }
    }

    function alterModalCtrl($scope, $uibModalInstance, alterModalType, content, $L) {
        var vm = this;
        angular.extend(vm, content);
        vm.btnName = vm.isConfirm ? $L.AbpWebLang.Btn_Cancel : $L.AbpWebLang.Btn_Ok;
        switch (content.modalType) {
            case alterModalType.info:
                vm.modalType = 'bg-info';
                vm.icon = 'ion-information-circled';
                break;
            case alterModalType.warning:
                vm.modalType = 'bg-warning';
                vm.icon = 'ion-android-warning';
                break;
            case alterModalType.success:
                vm.modalType = 'bg-success';
                vm.icon = 'ion-checkmark';
                break;
            case alterModalType.danger:
                vm.modalType = 'bg-danger';
                vm.icon = 'ion-android-warning';
                break;
        }
    }
})();