// (function() {
//     'use strict';

//     angular.module('tiggerrose.theme')
//         .directive('uiGridRow', ['uiGridRowEditService', '$q', uiGridRow]);

//     /** @ngInject */
//     function uiGridRow(uiGridRowEditService, $q) {
//         return {
//             restrict: 'C',
//             link: function(scope, elem, attr, ngModel) {
//                 function inlineEdit(entity, index, grid) {
//                     this.grid = grid;
//                     this.index = index;
//                     this.entity = {};
//                     this.isEditModeOn = false;
//                     this.init(entity);
//                 }

//                 inlineEdit.prototype = {
//                     init: function(rawEntity) {
//                         var self = this;

//                         for (var prop in rawEntity) {
//                             self.entity[prop] = {
//                                 value: rawEntity[prop],
//                                 isValueChanged: false,
//                                 isSave: false,
//                                 isCancel: false,
//                                 isEdit: false
//                             }
//                         }
//                     },

//                     enterEditMode: function(event) {
//                         event && event.stopPropagation();
//                         var self = this;
//                         self.isEditModeOn = true;

//                         // cancel all rows which are in edit mode
//                         self.grid.rows.forEach(function(row) {
//                             if (row.inlineEdit && row.inlineEdit.isEditModeOn && row.uid !== self.grid.rows[self.index].uid) {
//                                 row.inlineEdit.cancelEdit();
//                             }
//                         });

//                         // Reset all the values
//                         for (var prop in self.entity) {
//                             self.entity[prop].isSave = false;
//                             self.entity[prop].isCancel = false;
//                             self.entity[prop].isEdit = true;
//                         }
//                     },

//                     saveEdit: function(event) {
//                         event && event.stopPropagation();
//                         var self = this;

//                         self.isEditModeOn = false;

//                         for (var prop in self.entity) {
//                             self.entity[prop].isSave = true;
//                             self.entity[prop].isEdit = false;
//                         }
//                         var gridRow = self.grid.rows[self.index];
//                         uiGridRowEditService.saveRow(self.grid, gridRow);
//                         var promise = $q.defer();
//                         self.grid.api.rowEdit.setSavePromise(gridRow.entity, promise.promise);
//                         promise.reject();
//                     },

//                     cancelEdit: function(event) {
//                         event && event.stopPropagation();
//                         var self = this;

//                         self.isEditModeOn = false;
//                         for (var prop in self.entity) {
//                             self.entity[prop].isCancel = true;
//                             self.entity[prop].isEdit = false;
//                         }
//                     }
//                 }

//                 scope.row.inlineEdit = new inlineEdit(scope.row.entity, scope.rowRenderIndex, scope.row.grid);
//             }
//         };
//     }
// })();