(function() {
    'use strict';
    angular.module('tiggerrose.theme')
        .directive('comBox', comBox);

    comBox.$injector = ['$parse'];

    /** @ngInject */
    function comBox($parse) {
        return {
            restrict: 'E',
            replace: true,
            template: function(elem, attrs) {
                var arr = [],
                    i,
                    labelElem = '',
                    comBoxLabel = attrs.comBoxLabel || '',
                    inputName = attrs.inputName,
                    comBoxForm = attrs.comBoxForm || '',
                    ngClassStr = '',
                    className = '';

                if (!inputName) {
                    inputName = 'comBox' + Number(new Date());
                    attrs.inputName = inputName;
                    attrs.$attr.inputName = "input-name";
                }
                if (comBoxForm) {
                    comBoxForm = comBoxForm + '[\'' + inputName + '\']';
                    ngClassStr = 'ng-class="{\'has-error\':' + comBoxForm + '.$invalid && (' + comBoxForm + '.$dirty || ' + attrs.comBoxForm + '.$submitted)}"';
                }
                if (comBoxLabel) {
                    labelElem = '<label for="{{id}}">' + comBoxLabel + '</label>';
                }
                for (i in attrs.$attr) {
                    if (i.indexOf('comBox', 0) == 0) continue;
                    if (i == 'class') {
                        className = attrs[i];
                        continue;
                    }
                    arr.push(attrs.$attr[i] + '="' + attrs[i] + '"');
                }
                return '<div class="form-group ' + className + '" ' + ngClassStr + '>\
                            ' + labelElem + '\
                            <angucomplete-alt ' + arr.join(' ') + '/>\
                        </div>';
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                if (attrs.comBoxRequiredNoMatch === 'true') {
                    var _form = $parse(attrs.comBoxForm)(scope),
                        _ngModelCtrl;
                    Object.defineProperty(_form, attrs.inputName, {
                        get: function() {
                            return _ngModelCtrl;
                        },
                        set: function(val) {
                            _ngModelCtrl = val;
                            _ngModelCtrl.$parsers.push(function(viewValue) {
                                setTimeout(function() {
                                    _ngModelCtrl.$setValidity('autocomplete-required', !!viewValue);
                                }, 200);
                                return viewValue;
                            });
                        },
                        configurable: true
                    });
                }
            }
        };
    }
})();