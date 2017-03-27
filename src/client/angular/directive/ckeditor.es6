/*
angular
    .module('ckeditor', [])
    .directive('ckeditor', ['$parse', ckeditorDirective]);

// Polyfill setImmediate function.
var setImmediate = window && window.setImmediate ? window.setImmediate : function (fn) {
        setTimeout(fn, 0);
    };

/!**
 * CKEditor directive.
 *
 * @example
 * <div ckeditor="options" ng-model="content" ready="onReady()"></div>
 *!/

function ckeditorDirective($parse) {
    return {
        restrict: 'A',
        require: ['ckeditor', 'ngModel'],
        controller: [
            '$scope',
            '$element',
            '$attrs',
            '$parse',
            '$q',
            ckeditorController
        ],
        link: function (scope, element, attrs, ctrls) {
            // get needed controllers
            var controller = ctrls[0]; // our own, see below
            var ngModelController = ctrls[1];

            // Initialize the editor content when it is ready.
            controller.ready().then(function initialize() {
                // Sync view on specific events.
                ['dataReady', 'change', 'blur', 'saveSnapshot'].forEach(function (event) {
                    controller.onCKEvent(event, function syncView() {
                        ngModelController.$setViewValue(controller.instance.getData() || '');
                    });
                });

                controller.instance.setReadOnly(!! attrs.readonly);
                attrs.$observe('readonly', function (readonly) {
                    controller.instance.setReadOnly(!! readonly);
                });

                // Defer the ready handler calling to ensure that the editor is
                // completely ready and populated with data.
                setImmediate(function () {
                    $parse(attrs.ready)(scope);
                });
            });

            // Set editor data when view data change.
            ngModelController.$render = function syncEditor() {
                controller.ready().then(function () {
                    // "noSnapshot" prevent recording an undo snapshot
                    controller.instance.setData(ngModelController.$viewValue || '', {
                        noSnapshot: true,
                        callback: function () {
                            // Amends the top of the undo stack with the current DOM changes
                            // ie: merge snapshot with the first empty one
                            // http://docs.ckeditor.com/#!/api/CKEDITOR.editor-event-updateSnapshot
                            controller.instance.fire('updateSnapshot');
                        }
                    });
                });
            };
        }
    };
}

/!**
 * CKEditor controller.
 *!/

function ckeditorController($scope, $element, $attrs, $parse, $q) {
    var config = $parse($attrs.ckeditor)($scope) || {};
    var editorElement = $element[0];
    var instance;
    var readyDeferred = $q.defer(); // a deferred to be resolved when the editor is ready

    // Create editor instance.
    if (editorElement.hasAttribute('contenteditable') &&
        editorElement.getAttribute('contenteditable').toLowerCase() == 'true') {
        instance = this.instance = CKEDITOR.inline(editorElement, config);
    }
    else {
        instance = this.instance = CKEDITOR.replace(editorElement, config);
    }

    /!**
     * Listen on events of a given type.
     * This make all event asynchronous and wrapped in $scope.$apply.
     *
     * @param {String} event
     * @param {Function} listener
     * @returns {Function} Deregistration function for this listener.
     *!/

    this.onCKEvent = function (event, listener) {
        instance.on(event, asyncListener);

        function asyncListener() {
            var args = arguments;
            setImmediate(function () {
                applyListener.apply(null, args);
            });
        }

        function applyListener() {
            var args = arguments;
            $scope.$apply(function () {
                listener.apply(null, args);
            });
        }

        // Return the deregistration function
        return function $off() {
            instance.removeListener(event, applyListener);
        };
    };

    this.onCKEvent('instanceReady', function() {
        readyDeferred.resolve(true);
    });

    /!**
     * Check if the editor if ready.
     *
     * @returns {Promise}
     *!/
    this.ready = function ready() {
        return readyDeferred.promise;
    };

    // Destroy editor when the scope is destroyed.
    $scope.$on('$destroy', function onDestroy() {
        // do not delete too fast or pending events will throw errors
        readyDeferred.promise.then(function() {
            instance.destroy(false);
        });
*/
(function (angular) {
    'use strict';
    let model = angular.module('rop.module.WYSIWYGEditor', []);

    model.directive('ropWYSIWYGEditor', editorDirective);

    // 如果是rangeCalendar的话，"0"表示是开始日期，"1"表示是结束日期
    function editorDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                dateFilter: '=',
                rangeCalendar:'@'
            },
            require: ['ngModel', 'ropWYSIWYGEditor'],
            controller: EditorCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <textarea >
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var editorCtrl = controllers[1];
                editorCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    function EditorCtrl($element, $attrs, $scope, $animate, $q, $mdConstant, $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil) {
        $mdTheming($element);
        this.$animate = $animate;
        this.$q = $q;
        this.$mdInkRipple = $mdInkRipple;
        this.$mdUtil = $mdUtil;
        this.keyCode = $mdConstant.KEY_CODE;
        this.dateUtil = $$mdDateUtil;
        this.dateLocale = $mdDateLocale;
        this.$element = $element;
        this.$scope = $scope;
        this.calendarElement = $element[0].querySelector('.rop-calendar');
        this.$calendarBody = angular.element($element[0].querySelector('.rop-calendar-month'));
        this.today = this.dateUtil.createDateAtMidnight();
        this.ngModelCtrl = null;
        this.selectedDate = null;
        this.displayDate = null;
        this.focusDate = null;
        this.isInitialized = false;

        this.focusAfterAppend = null;
        this.id = nextUniqueId++;

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        var self = this;

        this.cellClickHandler = function () {
            var cellElement = this;
            if (this.hasAttribute('data-timestamp')) {
                $scope.$apply(function () {
                    var timestamp = Number(cellElement.getAttribute('data-timestamp'));
                    self.setNgModelValue(self.dateUtil.createDateAtMidnight(timestamp));
                });
            }
        };

        this.attachCalendarEventListeners();
    }
    CalendarCtrl.$inject = ["$element", "$attrs", "$scope", "$animate", "$q", "$mdConstant", "$mdTheming", "$$mdDateUtil", "$mdDateLocale", "$mdInkRipple", "$mdUtil"];
    CalendarCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            self.changeSelectedDate(self.ngModelCtrl.$viewValue);
        };
    };
    CalendarCtrl.prototype.changeSelectedDate = function(date) {
        var self = this;
        var previousSelectedDate = this.selectedDate;
        this.selectedDate = date;
        //this.setRangeCalendarDate();
        // 取消了md的滚动效果，省略了$q和动画操作
        this.changeDisplayDate(date).then(function() {
            if (previousSelectedDate) {
                var prevDateCell = document.getElementById(self.getDateId(previousSelectedDate));
                if (prevDateCell) {prevDateCell.classList.remove(SELECTED_DATE_CLASS);}
            }
            if (date) {
                var dateCell = document.getElementById(self.getDateId(date));
                if (dateCell) {dateCell.classList.add(SELECTED_DATE_CLASS);}
            }
        });
    };
    CalendarCtrl.prototype.changeDisplayDate = function(date) {
        if (!this.isInitialized) {
            this.buildInitialCalendarDisplay();
            return this.$q.when();
        }

        if (!this.dateUtil.isValidDate(date) || this.isMonthTransitionInProgress) {
            return this.$q.when();
        }

        // 假如是范围选择的化，每次选择都需要刷新table
        if(!this.rangeCalendar && this.displayDate && (this.displayDate instanceof Date) && (this.displayDate.getMonth() == date.getMonth())){
            return this.$q.when();
        }
        this.isMonthTransitionInProgress = true;
        this.displayDate = date;
        var animationPromise = this.animateDateChange(date);

        var self = this;
        animationPromise.then(function() {
            self.isMonthTransitionInProgress = false;
        });

        return animationPromise;
    };
    CalendarCtrl.prototype.animateDateChange = function(date) {
        this.scrollToMonth(date);
        return this.$q.when();
    };
    CalendarCtrl.prototype.scrollToMonth = function(date) {
        if (!this.dateUtil.isValidDate(date)) {
            return;
        }

        /*var monthDistance = this.dateUtil.getMonthDistance(this.firstRenderableDate, date);
         this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;*/
        this.generateContent();
    };
    CalendarCtrl.prototype.attachCalendarEventListeners = function () {
        this.$element.on('keydown', angular.bind(this, this.handleKeyEvent));
        var self = this;
        if(this.rangeCalendar == "0"){
            this.$scope.$watch(function() { return self.maxDate; }, function(e,date) {
                self.ngModelCtrl.$render();
            });
            this.$scope.$on('range-change', function(e,obj) {
                self.ngModelCtrl.$setViewValue(obj.minDate);
                self.ngModelCtrl.$render();
            });
        } else if(this.rangeCalendar == "1"){
            /*this.$scope.$watch(function() { return self.maxDate; }, function(date) {
             //self.setRangeCalendarDate(date)
             self.ngModelCtrl.$setViewValue(date);
             self.ngModelCtrl.$render();
             });*/
            this.$scope.$on('range-change', function(e,obj) {
                self.ngModelCtrl.$setViewValue(obj.maxDate);
                self.ngModelCtrl.$render();
            });
            this.$scope.$watch(function() { return self.minDate; }, function(date) {
                self.ngModelCtrl.$render();
            });
        }
    };
    CalendarCtrl.prototype.handleKeyEvent = function(event) {
        var self = this;
        this.$scope.$apply(function() {
            if (event.which == self.keyCode.ESCAPE || event.which == self.keyCode.TAB) {
                self.$scope.$emit('rop-calendar-close');
                if (event.which == self.keyCode.TAB) {
                    event.preventDefault();
                }
                return;
            }
            if (event.which === self.keyCode.ENTER) {
                /*self.selectedDate = this.focusDate;
                 self.displayDate = this.focusDate;*/
                self.setNgModelValue(self.focusDate);
                event.preventDefault();
                return;
            }
            var date = self.getFocusDateFromKeyEvent(event);
            if (date) {
                date = self.boundDateByMinAndMax(date);
                event.preventDefault();
                event.stopPropagation();
                self.changeDisplayDate(date).then(function () {
                    self.focus(date);
                });
            }
        });
    };
    CalendarCtrl.prototype.setNgModelValue = function (date) {
        this.$scope.$emit('rop-calendar-change', date);
        this.setRangeCalendarDate(date)
        this.ngModelCtrl.$setViewValue(date);
        this.ngModelCtrl.$render();
    };
    CalendarCtrl.prototype.boundDateByMinAndMax = function(date) {
        var boundDate = date;
        if ((this.rangeCalendar != "0") && this.minDate && date < this.minDate) {
            boundDate = new Date(this.minDate.getTime());
        }

        if ((this.rangeCalendar != "1") && this.maxDate && date > this.maxDate) {
            boundDate = new Date(this.maxDate.getTime());
        }
        return boundDate;
    };

    // 以下是操作
    CalendarCtrl.prototype.buildInitialCalendarDisplay = function() {
        this.buildWeekHeader();
        //this.hideVerticalScrollbar();

        this.displayDate = this.selectedDate || this.today;
        this.isInitialized = true;
        this.generateContent();
        this.focus(this.displayDate);
    };
    CalendarCtrl.prototype.buildWeekHeader = function() {
        var firstDayOfWeek = this.dateLocale.firstDayOfWeek;
        var shortDays = this.dateLocale.shortDays;

        var row = document.createElement('tr');
        for (var i = 0; i < 7; i++) {
            var th = document.createElement('th');
            th.textContent = shortDays[(i + firstDayOfWeek) % 7];
            row.appendChild(th);
        }

        this.$element.find('thead').append(row);
    };
    CalendarCtrl.prototype.getFocusDateFromKeyEvent = function(event) {
        var dateUtil = this.dateUtil;
        var keyCode = this.keyCode;

        /*var previousFocus = this.calendarElement.querySelector('.rop-focus'), focusDate = this.displayDate;
         if (previousFocus.hasAttribute('data-timestamp')) {
         focusDate = new Date(new Number(previousFocus.getAttribute('data-timestamp')));
         }*/
        switch (event.which) {
            case keyCode.RIGHT_ARROW: return dateUtil.incrementDays(this.focusDate, 1);
            case keyCode.LEFT_ARROW: return dateUtil.incrementDays(this.focusDate, -1);
            case keyCode.DOWN_ARROW:
                return event.metaKey ?
                    dateUtil.incrementMonths(this.focusDate, 1) :
                    dateUtil.incrementDays(this.focusDate, 7);
            case keyCode.UP_ARROW:
                return event.metaKey ?
                    dateUtil.incrementMonths(this.focusDate, -1) :
                    dateUtil.incrementDays(this.focusDate, -7);
            case keyCode.PAGE_DOWN: return dateUtil.incrementMonths(this.focusDate, 1);
            case keyCode.PAGE_UP: return dateUtil.incrementMonths(this.focusDate, -1);
            case keyCode.HOME: return dateUtil.getFirstDateOfMonth(this.focusDate);
            case keyCode.END: return dateUtil.getLastDateOfMonth(this.focusDate);
            default: return null;
        }
    };

    CalendarCtrl.prototype.focus = function(opt_date) {
        var date = opt_date || this.selectedDate || this.today;
        var previousFocus = this.calendarElement.querySelector('.rop-focus');
        if (previousFocus) {
            previousFocus.classList.remove(FOCUSED_DATE_CLASS);
        }

        var cellId = this.getDateId(date);
        var cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add(FOCUSED_DATE_CLASS);
            cell.focus();
        }/* else {
         this.focusDate = date;
         }*/
        this.focusDate = date;
    };
    CalendarCtrl.prototype.incrementMonth = function(numberOfMonths) {
        this.displayDate = this.dateUtil.incrementMonths(this.displayDate, numberOfMonths)
        this.generateContent();
    };
    CalendarCtrl.prototype.getDateId = function(date) {
        return [
            'rop',
            this.id,
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ].join('-');
    };
    CalendarCtrl.prototype.getMonthHeader = function() {
        return this.dateLocale.monthHeaderFormatter(this.displayDate);
    };


    // 跟内容相关
    CalendarCtrl.prototype.generateContent = function() {
        //var calendarCtrl = this.calendarCtrl;
        //var date = this.dateUtil.incrementMonths(calendarCtrl.firstRenderableDate, this.offset);
        //var myDate = date && (date instanceof Date)?date: new Date();

        if(this.displayDate){
            // 如果有范围的设置，则需要进行范围的调整
            this.$calendarBody.empty();
            this.$calendarBody.append(this.buildCalendarForMonth(this.displayDate));

            if (this.focusAfterAppend) {
                this.focusAfterAppend.classList.add(FOCUSED_DATE_CLASS);
                this.focusAfterAppend.focus();
                this.focusAfterAppend = null;
            }
        }
    };
    CalendarCtrl.prototype.buildCalendarForMonth = function(opt_dateInMonth) {
        var date = this.dateUtil.isValidDate(opt_dateInMonth) ? opt_dateInMonth : new Date();

        var firstDayOfMonth = this.dateUtil.getFirstDateOfMonth(date);
        var firstDayOfTheWeek = this.getLocaleDay_(firstDayOfMonth);
        //var numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(date);

        // Store rows for the month in a document fragment so that we can append them all at once.
        var monthBody = document.createDocumentFragment();

        var row = document.createElement('tr')
        //var row = this.buildDateRow(rowNumber);
        monthBody.appendChild(row);


        for(var rowIndex = 0; rowIndex < 6; rowIndex++){
            row = document.createElement('tr')
            monthBody.appendChild(row);
            for(var dayIndex = 0; dayIndex < 7; dayIndex++){
                var dateOfMonth = this.dateUtil.incrementDays(firstDayOfMonth, (rowIndex*7+dayIndex - firstDayOfTheWeek)),
                    cellOfDate = this.buildDateCell(dateOfMonth);
                row.appendChild(cellOfDate);
            }
        }
        /*var blankCellOffset = 0;
         for (var i = blankCellOffset; i < firstDayOfTheWeek; i++) {
         var lastMonthDate = this.dateUtil.incrementDays(firstDayOfMonth, (i - firstDayOfTheWeek)),
         lastMonthCell = this.buildDateCell();
         row.appendChild(this.buildDateCell());
         }*/
        /*
         // Add a cell for each day of the month, keeping track of the day of the week so that
         // we know when to start a new row.
         var dayOfWeek = firstDayOfTheWeek;
         var iterationDate = firstDayOfMonth;
         for (var d = 1; d <= numberOfDaysInMonth; d++) {
         // If we've reached the end of the week, start a new row.
         if (dayOfWeek === 7) {
         // We've finished the first row, so we're done if this is the final month.
         if (isFinalMonth) {
         return monthBody;
         }
         dayOfWeek = 0;
         rowNumber++;
         row = this.buildDateRow(rowNumber);
         monthBody.appendChild(row);
         }

         iterationDate.setDate(d);
         var cell = this.buildDateCell(iterationDate);
         row.appendChild(cell);

         dayOfWeek++;
         }

         // Ensure that the last row of the month has 7 cells.
         while (row.childNodes.length < 7) {
         row.appendChild(this.buildDateCell());
         }

         // Ensure that all months have 6 rows. This is necessary for now because the virtual-repeat
         // requires that all items have exactly the same height.
         while (monthBody.childNodes.length < 6) {
         var whitespaceRow = this.buildDateRow();
         for (var i = 0; i < 7; i++) {
         whitespaceRow.appendChild(this.buildDateCell());
         }
         monthBody.appendChild(whitespaceRow);
         }*/

        return monthBody;
    };
    CalendarCtrl.prototype.buildDateCell = function(opt_date) {
        var calendarCtrl = this;

        // TODO(jelbourn): cloneNode is likely a faster way of doing this.
        var cell = document.createElement('td');
        cell.tabIndex = -1;
        cell.classList.add('rop-calendar-date');

        if (opt_date) {
            cell.setAttribute('tabindex', '-1');
            cell.id = calendarCtrl.getDateId(opt_date);
            cell.setAttribute('data-timestamp', opt_date.getTime());

            // TODO(jelourn): Doing these comparisons for class addition during generation might be slow.
            // It may be better to finish the construction and then query the node and add the class.
            if (this.dateUtil.isSameDay(opt_date, calendarCtrl.today)) {
                cell.classList.add(TODAY_CLASS);
            }
            if (!this.dateUtil.isSameMonthAndYear(opt_date, calendarCtrl.displayDate)){
                cell.classList.add('rop-calendar-date-overflow');
            }

            if (this.dateUtil.isValidDate(calendarCtrl.selectedDate) &&
                this.dateUtil.isSameDay(opt_date, calendarCtrl.selectedDate)) {
                cell.classList.add(SELECTED_DATE_CLASS);
            }

            var cellText = this.dateLocale.dates[opt_date.getDate()];

            if(this.rangeCalendar){
                var selectionIndicator = document.createElement('span');
                cell.appendChild(selectionIndicator);
                selectionIndicator.classList.add('rop-calendar-date-selection-indicator');
                selectionIndicator.textContent = cellText;

                if (calendarCtrl.focusDate && this.dateUtil.isSameDay(opt_date, calendarCtrl.focusDate)) {
                    this.focusAfterAppend = cell;
                }
                if (angular.isFunction(this.dateFilter) && !this.dateFilter(opt_date) || ((this.rangeCalendar == "0") && (opt_date > this.maxDate) || (this.rangeCalendar == "1") && (opt_date < this.minDate))){
                    cell.classList.add('rop-calendar-date-disabled');
                } else {
                    cell.addEventListener('click', calendarCtrl.cellClickHandler);
                    if (this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate)) {
                        // Add a indicator for select, hover, and focus states.
                        cell.classList.add(IN_RANGE_CLASS);
                        if(this.dateUtil.isSameDay(opt_date, this.minDate)){
                            if(this.rangeCalendar == "0"){
                                cell.classList.add(RANGE_START_CLASS);
                            } else if(this.rangeCalendar == "1"){
                                cell.classList.add(MILESTONE_START_CLASS);
                            }
                        }  else if(this.dateUtil.isSameDay(opt_date, this.maxDate)){
                            if(this.rangeCalendar == "0"){
                                cell.classList.add(MILESTONE_END_CLASS);
                            } else if(this.rangeCalendar == "1"){
                                cell.classList.add(RANGE_END_CLASS);
                            }
                        }
                    }
                }
            } else {
                if (this.isDateEnabled(opt_date)) {
                    // Add a indicator for select, hover, and focus states.
                    var selectionIndicator = document.createElement('span');
                    cell.appendChild(selectionIndicator);
                    selectionIndicator.classList.add('rop-calendar-date-selection-indicator');
                    selectionIndicator.textContent = cellText;

                    cell.addEventListener('click', calendarCtrl.cellClickHandler);

                    if (calendarCtrl.focusDate && this.dateUtil.isSameDay(opt_date, calendarCtrl.focusDate)) {
                        this.focusAfterAppend = cell;
                    }
                } else {
                    cell.classList.add('rop-calendar-date-disabled');
                    cell.textContent = cellText;
                }
            }
        }

        return cell;
    };
    CalendarCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) && (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    }
    CalendarCtrl.prototype.getLocaleDay_ = function(date) {
        return (date.getDay() + (7 - this.dateLocale.firstDayOfWeek)) % 7
    };
    CalendarCtrl.prototype.setRangeCalendarDate = function(date) {
        if(this.rangeCalendar == "0"){
            this.minDate = this.dateUtil.createDateAtMidnight(date);
        } else if (this.rangeCalendar == "1"){
            this.maxDate = this.dateUtil.createDateAtMidnight(date);
        }
    };
})(window.angular);