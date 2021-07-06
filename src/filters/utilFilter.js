(function() {
    'use strict';

    angular.module('tiggerrose.theme')
        .filter('booleanText', booleanText)
        .filter('showText', showText)
        .filter('percentText',percentText)
        .filter('showNullOrZeroText',showNullOrZeroText);

    /** @ngInject */
    function booleanText() {
        return function(val, trueVal, falseVal) {
            if (val === null || val === undefined) return '';
            return val ? trueVal : falseVal
        };
    }

    function showText() {
        return function(val, dataScource, key, text) {
            if (!!!dataScource) return '';
            var i = dataScource.filter(function(item) {
                return item[key] === val;
            });
            if (i.length)
                return i[0][text];
            return '';
        }
    }
    function percentText(){
        return function(val)
        {
            if(val)
            {
                return val+'%'
            }
            return ''
        }
    }
    function showNullOrZeroText()
    {
        return function (val)
        {
            if(val&&val==0)
            {
                return '—'
            }
            else if(!val||val==null)
            {
                return '—'
            }
            else
            {
                return val;
            }
        }
    }
})();