(function() {
    'use strict';

    var template =
        '<div class="form-group" ng-class="{\'has-error\': (telForm[telAreacodeId].$invalid && (telForm[telAreacodeId].$dirty || telForm.$submitted)) || (telForm[telId].$invalid && (telForm[telId].$dirty || telForm.$submitted)) || (telForm[telExtensionId].$invalid && (telForm[telExtensionId].$dirty || telForm.$submitted))}">' +
        '<label ng-bind="telLabel"></label>' +
        '<div class="row">' +
        '<div class="col-sm-3 col-xs-3">' +
        '<input type="text" maxlength="4" class="form-control tel-areacode"' +
        'id="{{telAreacodeId\}}"' +
        'name="{{telAreacodeId}}"' +
        'ng-model="telAreacode"' +
        'placeholder="{{telAreacodePlaceholder}}"' +
        'ng-disabled="telDisabled"' +
        'ng-required="telAreacodeRequired"' +
        'ng-class="{\'has-error\': (telForm[telAreacodeId].$invalid && (telForm[telAreacodeId].$dirty || telForm.$submitted))}"/>' +
        '</div>' +
        '<div class="col-sm-6 col-xs-6">' +
        '<input type="text" maxlength="9" class="form-control tel-main"' +
        'id="{{telId}}"' +
        'name="{{telId}}"' +
        'ng-model="tel"' +
        'placeholder="{{telPlaceholder}}"' +
        'ng-disabled="telDisabled"' +
        'ng-required="telRequired"' +
        'ng-class="{\'has-error\': (telForm[telId].$invalid && (telForm[telId].$dirty || telForm.$submitted))}"/>' +
        '</div>' +
        '<div class="col-sm-3 col-xs-3">' +
        '<input type="text" maxlength="4" class="form-control tel-extension"' +
        'id="{{telExtensionId}}"' +
        'name="{{telExtensionId}}"' +
        'ng-model="telExtension"' +
        'placeholder="{{telExtensionPlaceholder}}"' +
        'ng-disabled="telDisabled"' +
        'ng-required="telExtensionRequired"' +
        'ng-class="{\'has-error\': (telForm[telExtensionId].$invalid && (telForm[telExtensionId].$dirty || telForm.$submitted))}"/>' +
        '</div>' +
        '</div>' +
        '</div>';

    angular.module('tiggerrose.theme')
        .directive('textphoneFormGroup', textphoneFormGroup);

    /** @ngInject */
    function textphoneFormGroup() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                // 区号
                telAreacode: '=',
                // 座机
                tel: '=',
                // 分机
                telExtension: '=',

                telLabel: '@',
                telForm: '=?',
                telDisabled: '=?',

                telAreacodeRequired: '=?',
                telRequired: '=?',
                telExtensionRequired: '=?',

                telAreacodePlaceholder: '@',
                telPlaceholder: '@',
                telExtensionPlaceholder: '@',
            },
            // templateUrl: 'app/theme/components/textPhone/textPhone.html',
            template: template,
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.telAreacodeId = attrs.telAreacode.replace(/\./ig, '_');
                scope.telId = attrs.tel.replace(/\./ig, '_');
                scope.telExtensionId = attrs.telExtension.replace(/\./ig, '_');

                scope.telAreacodePlaceholder = scope.telAreacodePlaceholder || '区号';
                scope.telPlaceholder = scope.telPlaceholder || '座机';
                scope.telExtensionPlaceholder = scope.telExtensionPlaceholder || '分机';

                var _telAreaCode = element.find('input.tel-areacode'),
                    _telMain = element.find('input.tel-main'),
                    _telExtension = element.find('input.tel-extension');

                _telAreaCode.on('keypress', numberKeypress)
                    .on('beforepaste', numberBeforepaste);
                _telMain.on('keypress', numberKeypress)
                    .on('beforepaste', numberBeforepaste);
                _telExtension.on('keypress', numberKeypress)
                    .on('beforepaste', numberBeforepaste);

                function numberBeforepaste() {
                    // 复制粘贴时的处理
                    clipboardData.setData('text', clipboardData.getData('text').replace(/[^0-9]/ig, ''))
                }

                function numberKeypress(e) {
                    e = e || event;
                    return (e.keyCode >= 48 && e.keyCode <= 57);
                }
            }
        };
    }
})();