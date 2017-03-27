// 单个日历表
(function (angular) {
    'use strict';
    let model = angular.module('rop.module.calendar', ['material.core','material.components.icon']);

    model.config(($mdIconProvider, $mdDateLocaleProvider) => {
        $mdIconProvider
            /*.iconSet('action', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24)
            .iconSet('alert', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg', 24)
            .iconSet('av', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-av.svg', 24)
            .iconSet('communication', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg', 24)
            .iconSet('content', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg', 24)
            .iconSet('device', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-device.svg', 24)
            .iconSet('editor', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg', 24)
            .iconSet('file', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-file.svg', 24)
            .iconSet('hardware', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-hardware.svg', 24)
            .iconSet('image', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg', 24)
            .iconSet('maps', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg', 24)*/
            .iconSet('navigation', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg', 24)
            /*.iconSet('notification', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-notification.svg', 24)
            .iconSet('social', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg', 24)
            .iconSet('toggle', '/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg', 24)*/
            .defaultIconSet('/vendor/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24);
    });

    model.directive('ropCalendar', calendarDirective);

    // 如果是rangeCalendar的话，"0"表示是开始日期，"1"表示是结束日期
    function calendarDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                dateFilter: '=',
                rangeCalendar:'@'
            },
            require: ['ngModel', 'ropCalendar'],
            controller: CalendarCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <md-toolbar class="md-primary" ng-class="{'range-calendar':ctrl.rangeCalendar}">
                    <div class="md-toolbar-tools">
                        <md-button class="md-icon-button" ng-click="ctrl.incrementMonth(-1)" aria-label="Previous Month">
                            <md-icon md-svg-icon="navigation:ic_chevron_left_24px"></md-icon>
                        </md-button>
                        <h2 class="flex"><span ng-bind="ctrl.getMonthHeader()"></span></h2>
                        <md-button class="md-icon-button" ng-click="ctrl.incrementMonth(1)" aria-label="Next Month">
                            <md-icon md-svg-icon="navigation:ic_chevron_right_24px"></md-icon>
                        </md-button>
                    </div>
                </md-toolbar>
                <md-content>
                    <table role="grid" tabindex="0" class="rop-calendar" aria-readonly="true">
                        <thead class="rop-calendar-day-header"></thead>
                        <tbody class="rop-calendar-month"></tbody>
                    </table>
                </md-content>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdCalendarCtrl = controllers[1];
                mdCalendarCtrl.configureNgModel(ngModelCtrl);

                mdCalendarCtrl.generateContent();
            }
        };
    }

    var SELECTED_DATE_CLASS = 'rop-calendar-selected-date';
    var FOCUSED_DATE_CLASS = 'rop-focus';
    var TODAY_CLASS = 'rop-calendar-date-today';
    var IN_RANGE_CLASS = 'rop-calendar-in-range';
    var RANGE_START_CLASS = 'rop-calendar-range-start';
    var RANGE_END_CLASS = 'rop-calendar-range-end';
    var MILESTONE_START_CLASS = 'rop-calendar-milestone-start';
    var MILESTONE_END_CLASS = 'rop-calendar-milestone-end';
    var nextUniqueId = 0;

    function CalendarCtrl($element, $attrs, $scope, $animate, $q, $mdConstant, $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil) {
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
// 单个日历表对应的输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropDatePicker', datePickerDirective);

    function datePickerDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                placeholder: '@',
                dateFilter: '='
            },
            require: ['ngModel', 'ropDatePicker'],
            controller: DatePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="rop-datepicker">
                    <md-icon class="rop-datepicker-calendar-icon" md-svg-icon="md-calendar" ng-click="!ctrl.isDisabled && ctrl.openCalendarPane($event)"></md-icon>
                    <input class="rop-datepicker-input" ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)" ng-disabled="ctrl.isDisabled">
                </div>

                <div class="rop-datepicker-calendar-pane md-whiteframe-z1">
                    <div class="rop-datepicker-input-mask">
                        <div class="rop-datepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-datepicker-calendar">
                        <rop-calendar role="dialog" min-date="ctrl.minDate" max-date="ctrl.maxDate" date-filter="ctrl.dateFilter" ng-model="ctrl.date" ng-if="ctrl.isCalendarOpen">
                        </rop-calendar>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdDatePickerCtrl = controllers[1];
                mdDatePickerCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var INVALID_CLASS = 'rop-datepicker-invalid';
    var CALENDAR_PANE_HEIGHT = 301;
    var CALENDAR_PANE_WIDTH = 260;

    function DatePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);
        this.ngModelCtrl = null;
        this.inputElement = $element[0].querySelector('input');
        this.ngInputElement = angular.element(this.inputElement);
        this.inputContainer = $element[0].querySelector('.rop-datepicker');
        this.calendarPane = $element[0].querySelector('.rop-datepicker-calendar-pane');
        this.calendarButton = $element[0].querySelector('.rop-datepicker-calendar-icon');
        this.inputMask = $element[0].querySelector('.rop-datepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;
        this.date = null;
        this.isFocused = false;
        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isCalendarOpen = false;
        this.openOnFocus = $attrs.hasOwnProperty('ropOpenOnFocus');

        this.calendarPaneOpenedFrom = null;
        this.calendarPane.id = 'rop-date-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeCalendarPane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachCalendarPane();
        });
    }
    DatePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    DatePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(value instanceof Date)) { throw Error('The ng-model for rop-datepicker must be a Date instance. ' + 'Currently the model is a: ' + (typeof value));}

            self.date = value;
            self.inputElement.value = self.dateLocale.formatDate(value);
            //self.resizeInputElement();
            self.updateErrorState();
        };
    };
    DatePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
        this.inputElement.disabled = isDisabled;
        this.calendarButton.disabled = isDisabled;
    };
    DatePickerCtrl.prototype.updateErrorState = function(opt_date) {
        var date = opt_date || this.date;
        this.clearErrorState();

        if (this.dateUtil.isValidDate(date)) {
            date = this.dateUtil.createDateAtMidnight(date);
            if (this.dateUtil.isValidDate(this.minDate)) {
                var minDate = this.dateUtil.createDateAtMidnight(this.minDate);
                this.ngModelCtrl.$setValidity('mindate', date >= minDate);
            }
            if (this.dateUtil.isValidDate(this.maxDate)) {
                var maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
                this.ngModelCtrl.$setValidity('maxdate', date <= maxDate);
            }

            if (angular.isFunction(this.dateFilter)) {
                this.ngModelCtrl.$setValidity('filtered', this.dateFilter(date));
            }
        } else {
            // The date is seen as "not a valid date" if there is *something* set
            // (i.e.., not null or undefined), but that something isn't a valid date.
            this.ngModelCtrl.$setValidity('valid', date == null);
        }

        // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
        // because it doesn't conform to the DOMTokenList spec.
        // See https://github.com/ariya/phantomjs/issues/12782.
        if (!this.ngModelCtrl.$valid) {
            this.inputContainer.classList.add(INVALID_CLASS);
        }
    };
    DatePickerCtrl.prototype.clearErrorState = function() {
        this.inputContainer.classList.remove(INVALID_CLASS);
        ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function(field) {
            this.ngModelCtrl.$setValidity(field, true);
        }, this);
    };
    DatePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isCalendarOpen) {
            // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-calendar');
            if (!isInCalendar) {
                this.closeCalendarPane();
            }
            this.$scope.$digest();
        }
    };
    DatePickerCtrl.prototype.closeCalendarPane = function() {
        if (this.isCalendarOpen) {
            this.detachCalendarPane();
            this.isCalendarOpen = false;
            this.calendarPaneOpenedFrom.focus();
            this.calendarPaneOpenedFrom = null;

            this.ngModelCtrl.$setTouched();

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);
        }
    };
    DatePickerCtrl.prototype.detachCalendarPane = function() {
        this.$element.removeClass('rop-pane-open');
        this.calendarPane.classList.remove('rop-pane-open');
        if (this.isCalendarOpen) {this.$mdUtil.enableScrolling();}
        if (this.calendarPane.parentNode) {this.calendarPane.parentNode.removeChild(this.calendarPane);}
    };

    DatePickerCtrl.prototype.installPropertyInterceptors = function() {
        var self = this;
        if (this.$attrs['ngDisabled']) {
            var scope = this.$scope.$parent;

            if (scope) {
                scope.$watch(this.$attrs['ngDisabled'], function(isDisabled) {
                    self.setDisabled(isDisabled);
                });
            }
        }

        Object.defineProperty(this, 'placeholder', {
            get: function() { return self.inputElement.placeholder; },
            set: function(value) { self.inputElement.placeholder = value || ''; }
        });
    };
    DatePickerCtrl.prototype.attachChangeListeners = function() {
        var self = this;

        self.$scope.$on('rop-calendar-change', function(event, date) {
            self.ngModelCtrl.$setViewValue(date);
            self.date = date;
            self.inputElement.value = self.dateLocale.formatDate(date);
            self.closeCalendarPane();
            //self.resizeInputElement();
            self.updateErrorState();
        });

        //self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
        // TODO(chenmike): Add ability for users to specify this interval.
        self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
            DEFAULT_DEBOUNCE_INTERVAL, self));
    };
    DatePickerCtrl.prototype.handleInputEvent = function() {
        var inputString = this.inputElement.value;
        var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
        this.dateUtil.setDateTimeToMidnight(parsedDate);
        var isValidInput = inputString == '' || (
            this.dateUtil.isValidDate(parsedDate) &&
            this.dateLocale.isDateComplete(inputString) &&
            this.isDateEnabled(parsedDate)
            );
        if (isValidInput) {
            this.ngModelCtrl.$setViewValue(parsedDate);
            this.date = parsedDate;
        }

        this.updateErrorState(parsedDate);
    };
    DatePickerCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
            (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    };
    DatePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        var keyCodes = this.$mdConstant.KEY_CODE;

        self.ngInputElement.on('keydown', function(event) {
            if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                self.openCalendarPane(event);
                $scope.$digest();
            }
        });
        if (self.openOnFocus) {
            self.ngInputElement.on('focus', angular.bind(self, self.openCalendarPane));
            angular.element(self.$window).on('blur', self.windowBlurHandler);

            $scope.$on('$destroy', function() {
                angular.element(self.$window).off('blur', self.windowBlurHandler);
            });
        }
        $scope.$on('rop-calendar-close', function() {
            self.closeCalendarPane();
        });
    };
    DatePickerCtrl.prototype.handleWindowBlur = function() {
        this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
    };

    // 以下是用于组件关联和操作所用
    DatePickerCtrl.prototype.getCalendarCtrl = function() {
        return angular.element(this.calendarPane.querySelector('rop-calendar')).controller('ropCalendar');
    };
    DatePickerCtrl.prototype.setFocused = function(isFocused) {
        if (!isFocused) {this.ngModelCtrl.$setTouched();}
        this.isFocused = isFocused;
    };
    DatePickerCtrl.prototype.focusCalendar = function() {
        var self = this;
        this.$mdUtil.nextTick(function() {self.getCalendarCtrl().focus();
        }, false);
    };
    DatePickerCtrl.prototype.openCalendarPane = function(event) {
        if (!this.isCalendarOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isCalendarOpen = true;

            if (!this.ngModelCtrl.$valid) {
                var date = this.dateUtil.createDateAtMidnight();
                this.ngModelCtrl.$setViewValue(date);
                this.date = date;
                this.inputElement.value = this.dateLocale.formatDate(date);
            }

            this.calendarPaneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.calendarPane);

            this.attachCalendarPane();
            this.focusCalendar();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    DatePickerCtrl.prototype.attachCalendarPane = function() {
        var calendarPane = this.calendarPane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-pane-open');

        var elementRect = this.inputContainer.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        var paneTop = elementRect.top + elementRect.height + 16 - bodyRect.top;
        var paneLeft = elementRect.left - bodyRect.left;

        var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

        var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

        var viewportBottom = viewportTop + this.$window.innerHeight;
        var viewportRight = viewportLeft + this.$window.innerWidth;

        if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
            if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
            } else {
                paneLeft = viewportLeft;
                var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                calendarPane.style.transform = 'scale(' + scale + ')';
            }

            calendarPane.classList.add('rop-datepicker-pos-adjusted');
        }
        if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
            viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
            calendarPane.classList.add('rop-datepicker-pos-adjusted');
        }

        calendarPane.style.left = paneLeft + 'px';
        calendarPane.style.top = paneTop + 'px';
        document.body.appendChild(calendarPane);
        this.inputMask.style.left = elementRect.width + 'px';

        // Add CSS class after one frame to trigger open animation.
        this.$$rAF(function() {
            calendarPane.classList.add('rop-pane-open');
        });
    };
})(window.angular);




// 时间滚轮
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropTimeSpinner', timeSpinnerDirective);

    function timeSpinnerDirective() {
        return {
            scope: {
                minTime: '=',
                maxTime: '=',
                interval: '@',
                timeFilter: '='
            },
            require: ['ngModel', 'ropTimeSpinner'],
            controller: TimeSpinnerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <md-toolbar class="md-primary">
                    <div class="md-toolbar-tools">
                        <h2 class="flex"><span ng-bind="ctrl.time"></span></h2>
                    </div>
                </md-toolbar>
                <md-content>
                    <table role="grid" tabindex="0" class="rop-time-spinner" aria-readonly="true">
                        <thead class="rop-time-spinner-header">
                            <th ng-bind="ctrl.dateLocale.hourLabel"></th>
                            <th></th>
                            <th ng-bind="ctrl.dateLocale.minuteLabel"></th>
                            <th></th>
                            <th ng-bind="ctrl.dateLocale.secondLabel"></th>
                        </thead>
                        <tbody class="rop-time-spinner-body">
                            <tr>
                                <td>
                                    <md-button class="md-icon-button rop-spinner hour increaser" ng-click="ctrl.incrementHour(1)" aria-label="Hour Increaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_less_24px"></md-icon>
                                    </md-button>
                                </td>
                                <td></td>
                                <td>
                                    <md-button class="md-icon-button rop-spinner minute increaser" ng-click="ctrl.incrementMinute(1)" aria-label="Minute Increaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_less_24px"></md-icon>
                                    </md-button>
                                </td>
                                <td></td>
                                <td>
                                    <md-button class="md-icon-button rop-spinner second increaser" ng-click="ctrl.incrementSecond(1)" aria-label="Second Increaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_less_24px"></md-icon>
                                    </md-button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="rop-time-spinner-input hour" ng-model="ctrl.hour" ng-focus="ctrl.focus(0)" ng-blur="ctrl.blur()" maxlength="2">
                                </td>
                                <td>
                                    <span class="rop-time-spinner-token" ng-bind="ctrl.dateLocale.timeToken"></span>
                                </td>
                                <td>
                                    <input class="rop-time-spinner-input minute" ng-model="ctrl.minute" ng-focus="ctrl.focus(1)" ng-blur="ctrl.blur()" maxlength="2">
                                </td>
                                <td>
                                    <span class="rop-time-spinner-token" ng-bind="ctrl.dateLocale.timeToken"></span>
                                </td>
                                <td>
                                    <input class="rop-time-spinner-input second" ng-model="ctrl.second" ng-focus="ctrl.focus(2)" ng-blur="ctrl.blur()" maxlength="2">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <md-button class="md-icon-button rop-spinner hour decreaser" ng-click="ctrl.incrementHour(-1)" aria-label="Hour Decreaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_more_24px"></md-icon>
                                    </md-button>
                                </td>
                                <td></td>
                                <td>
                                    <md-button class="md-icon-button rop-spinner minute decreaser" ng-click="ctrl.incrementMinute(-1)" aria-label="Minute Decreaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_more_24px"></md-icon>
                                    </md-button>
                                </td>
                                <td></td>
                                <td>
                                    <md-button class="md-icon-button rop-spinner second decreaser" ng-click="ctrl.incrementSecond(-1)" aria-label="Second Decreaser">
                                        <md-icon md-svg-icon="navigation:ic_expand_more_24px"></md-icon>
                                    </md-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </md-content>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdCalendarCtrl = controllers[1];
                mdCalendarCtrl.configureNgModel(ngModelCtrl);

                // 和calendar不同，时间选择无需动态生成月份内容
                //mdCalendarCtrl.generateContent();
            }
        };
    }

    //var SELECTED_DATE_CLASS = 'rop-time-spinner-selected-date';
    //var FOCUSED_DATE_CLASS = 'rop-focus';
    //var TODAY_CLASS = 'rop-calendar-date-today';
    var FOCUSED_TIME_CLASS = 'rop-focus';
    var nextUniqueId = 0;

    function TimeSpinnerCtrl($element, $attrs, $scope, $animate, $q, $mdConstant, $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil, $interval) {
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
        this.$interval = $interval;
        this.timeSpinnerElement = $element[0].querySelector('.rop-time-spinner');
        this.$timeSpinnerBody = angular.element($element[0].querySelector('.rop-time-spinner-body'));
        this.$hourElement = angular.element($element[0].querySelector('.rop-time-spinner-input.hour'));
        this.$minuteElement = angular.element($element[0].querySelector('.rop-time-spinner-input.minute'));
        this.$secondElement = angular.element($element[0].querySelector('.rop-time-spinner-input.second'));
        this.inputArray = [this.$hourElement,this.$minuteElement,this.$secondElement ]

        this.$hourIncreaserElement = angular.element($element[0].querySelector('.rop-spinner.hour.increaser'));
        this.$minuteIncreaserElement = angular.element($element[0].querySelector('.rop-spinner.minute.increaser'));
        this.$secondIncreaserElement = angular.element($element[0].querySelector('.rop-spinner.second.increaser'));
        this.$hourDecreaserElement = angular.element($element[0].querySelector('.rop-spinner.hour.decreaser'));
        this.$minuteDecreaserElement = angular.element($element[0].querySelector('.rop-spinner.minute.decreaser'));
        this.$secondDecreaserElement = angular.element($element[0].querySelector('.rop-spinner.second.decreaser'));

        this.documentElement = angular.element(document.documentElement);

        //this.today = this.dateUtil.createDateAtMidnight();
        this.ngModelCtrl = null;
        this.hour = null;
        this.minute = null;
        this.second = null;
        this.isInitialized = false;

        this.id = nextUniqueId++;
        this.holdingSpinner = false;
        this.repeater = null;

        this.bodyMouseupHandler = angular.bind(this, this.handleBodyMouseUp);
        this.bodyMouseOutHandler = angular.bind(this, this.handleBodyMouseOut);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        var self = this;

        this.attachTimeSpinnerEventListeners();

        $scope.$on('$destroy', function() {
            self.clearMouseListener();
        });
    }
    TimeSpinnerCtrl.$inject = ["$element", "$attrs", "$scope", "$animate", "$q", "$mdConstant", "$mdTheming", "$$mdDateUtil", "$mdDateLocale", "$mdInkRipple", "$mdUtil", "$interval"];
    TimeSpinnerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(typeof value == "string")) {
                throw Error('The ng-model for rop-time-spinner must be a String instance. ' + 'Currently the model is a: ' + (typeof value));
            }
            self.changeTime(self.ngModelCtrl.$viewValue);
        };
    };
    TimeSpinnerCtrl.prototype.changeTime = function(time) {
        var self = this;
        this.time = time;
        if(!this.isInitialized){
            if(time && (typeof time == "string") &&this.dateUtil.isValidTime(time,this.dateLocale.timeToken)){
                var parsedTime = this.parseTime(time);
                this.hour = parsedTime.hour;
                this.minute = parsedTime.minute;
                this.second = parsedTime.second;
            } else {
                this.hour = "00";
                this.minute = "00";
                this.second = "00";
            }
            this.isInitialized = true;
        }
    };
    TimeSpinnerCtrl.prototype.attachTimeSpinnerEventListeners = function () {
        this.$element.on('keydown', angular.bind(this, this.handleKeyEvent));
        var self = this;
        this.$hourIncreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementHour(1)}, 200);
        });
        this.$minuteIncreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementMinute(1)}, 200);
        });
        this.$secondIncreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementSecond(1)}, 200);
        });
        this.$hourDecreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementHour(-1)}, 200);
        });
        this.$minuteDecreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementMinute(-1)}, 200);
        });
        this.$secondDecreaserElement.mousedown(function(event) {
            self.holdingSpinner = true;
            self.repeater && self.$interval.cancel(self.repeater);
            self.repeater  = self.$interval(function(){self.incrementSecond(-1)}, 200);
        });
        this.documentElement.on('mouseup', this.bodyMouseupHandler);
        this.documentElement.on('mouseout', this.bodyMouseOutHandler);

    };
    TimeSpinnerCtrl.prototype.handleBodyMouseUp = function(){
        var self = this;
        self.holdingSpinner = false;
        self.repeater && self.$interval.cancel(self.repeater);
    }
    TimeSpinnerCtrl.prototype.handleBodyMouseOut = function(event){
        var self = this;
        event = event ? event : window.event;
        var fromTarget = event.relatedTarget || event.toElement;
        if (!fromTarget || fromTarget.nodeName == "HTML") {
            self.holdingSpinner = false;
            self.repeater && self.$interval.cancel(self.repeater);
        }
    }
    TimeSpinnerCtrl.prototype.handleKeyEvent = function(event) {
        var self = this;
        if(event.metaKey || event.ctrlKey|| event.altKey|| event.shiftKey || (event.which === this.keyCode.LEFT_ARROW || (event.which === this.keyCode.RIGHT_ARROW))){
            return true;
        }
        this.$scope.$apply(function() {
            if (event.which == self.keyCode.ESCAPE || event.which == self.keyCode.TAB) {
                self.$scope.$emit('rop-spinner-close');
                if (event.which == self.keyCode.TAB) {
                    event.preventDefault();
                }
                return;
            }
            if (event.which === self.keyCode.ENTER) {
                self.holdingSpinner = false;
                self.repeater && self.$interval.cancel(self.repeater);
                self.setNgModelValue();
                self.$scope.$emit('rop-spinner-close');
                event.preventDefault();
                return;
            }
            if((event.which >=48) && (event.which <= 57)) {
                self.holdingSpinner = false;
                self.repeater && self.$interval.cancel(self.repeater);
                self.$mdUtil.nextTick(function(){
                    if(Number.parseInt(self.hour) >= 24){
                        self.hour = "23";
                    } else if(Number.parseInt(self.minute) >= 60){
                        self.minute = "59";
                    } else if(Number.parseInt(self.second) >= 60){
                        self.second = "59";
                    }
                    self.$mdUtil.nextTick(function(){
                        self.setNgModelValue();
                    },true);
                },true);
                return;
            }

            self.incrementValueFromKeyEvent(event);
            event.preventDefault();
            event.stopPropagation();
            self.setNgModelValue();
        });
    };
    TimeSpinnerCtrl.prototype.setNgModelValue = function () {
        // 本地model变化不要向上抛出
        //this.$scope.$emit('rop-calendar-change', date);
        var time = this.buildTime();
        if(this.dateUtil.isValidTime(time,this.dateLocale.timeToken)){
            this.ngModelCtrl.$setViewValue(time);
            this.ngModelCtrl.$render();
        }
    };
    TimeSpinnerCtrl.prototype.incrementValueFromKeyEvent = function(event) {
        var keyCode = this.keyCode;
        /*if (event.which === this.keyCode.LEFT_ARROW) {
            this.holdingSpinner = false;
            this.repeater && this.$interval.cancel(this.repeater);
            this.focus((this.focusTarget + 1)%3);
            return;
        }
        if (event.which === this.keyCode.RIGHT_ARROW) {
            this.holdingSpinner = false;
            this.repeater && this.$interval.cancel(this.repeater);
            this.focus((this.focusTarget + 1)%3);
            return;
        }*/

        if(this.focusTarget == 0){
            if(event.which == keyCode.DOWN_ARROW){
                this.incrementHour(-1);
            } else if(event.which == keyCode.UP_ARROW){
                this.incrementHour(1);
            }
        } else if(this.focusTarget == 1){
            if(event.which == keyCode.DOWN_ARROW){
                this.incrementMinute(-1);
            } else if(event.which == keyCode.UP_ARROW){
                this.incrementMinute(1);
            }
        } else if(this.focusTarget == 2){
            if(event.which == keyCode.DOWN_ARROW){
                this.incrementSecond(-1);
            } else if(event.which == keyCode.UP_ARROW){
                this.incrementSecond(1);
            }
        }
    };

    TimeSpinnerCtrl.prototype.focus = function(target) {
        target = (typeof target == "number") ?target: 0;
        var previousFocus = this.$element[0].querySelector('.'+FOCUSED_TIME_CLASS),
            $target = this.inputArray[target];
        if (previousFocus) {
            previousFocus.classList.remove(FOCUSED_TIME_CLASS);
        }

        $target && $target.length && $target.addClass(FOCUSED_TIME_CLASS);
        this.focusTarget = target;
    };
    TimeSpinnerCtrl.prototype.blur = function() {
        var previousFocus = this.$element[0].querySelector('.'+FOCUSED_TIME_CLASS);
        if (previousFocus) {
            previousFocus.classList.remove(FOCUSED_TIME_CLASS);
        }
        this.focusTarget = -1;
    };

    TimeSpinnerCtrl.prototype.isTimeEnabled = function(time){
        if(angular.isFunction(this.timeFilter) && !this.timeFilter(time)){
            return false;
        }
        if(this.minTime && this.maxTime){
            return this.dateUtil.isTimeWithinRange(time,this.minTime,this.maxTime,this.dateLocale.timeToken)
        } else if (this.minTime){
            return this.dateUtil.isMinTimeBeforeMaxTime(this.minTime,time,this.dateLocale.timeToken)
        } else if(this.maxTime){
            return this.dateUtil.isMinTimeBeforeMaxTime(time,this.maxTime,this.dateLocale.timeToken)
        }
        return true;
    };

    TimeSpinnerCtrl.prototype.incrementHour = function(value){
        var myValue = value && (typeof value == "string")? Number.parseInt(value):((typeof value == "number")?value:0),
            localHour =  Number.parseInt(this.hour);
        localHour += myValue;
        if(localHour<0){
            localHour = "23";
        } else if ((localHour>=0)&&(localHour<10)){
            localHour = "0"+localHour;
        } else if (localHour>=24){
            localHour = "00"
        } else {
            localHour = "" + localHour;
        }
        /*localHour = (localHour >= 24)?"00":((localHour<10)?('0'+localHour):(localHour+''));*/
        var myTime = this.buildTime(localHour,this.minute,this.second);
        if(this.isTimeEnabled(myTime)){
            this.hour = localHour;
            var self = this;
            this.$mdUtil.nextTick(function() {self.setNgModelValue();}, true);
        }
    };
    TimeSpinnerCtrl.prototype.incrementMinute = function(value){
        var myValue = value && (typeof value == "string")? Number.parseInt(value):((typeof value == "number")?value:0),
            localMinute =  Number.parseInt(this.minute);
        localMinute += myValue;
        //localMinute = (localMinute>=60)?"00":((localMinute<10)?('0'+localMinute):(localMinute+''));
        if(localMinute<0){
            localMinute = "59";
        } else if ((localMinute>=0)&&(localMinute<10)){
            localMinute = "0"+localMinute;
        } else if (localMinute>=60){
            localMinute = "00"
        } else {
            localMinute = "" + localMinute;
        }
        //if(!this.minTime || !this.maxTime || this.dateUtil.isTimeWithinRange(this.buildTime(this.hour,localMinute,this.second),this.minTime,this.maxTime,this.dateLocale.timeToken)){
        var myTime = this.buildTime(this.hour,localMinute,this.second);
        if(this.isTimeEnabled(myTime)){
            this.minute = localMinute;
            var self = this;
            this.$mdUtil.nextTick(function() {self.setNgModelValue();}, true);
        }
    };
    TimeSpinnerCtrl.prototype.incrementSecond = function(value){
        var myValue = value && (typeof value == "string")? Number.parseInt(value):((typeof value == "number")?value:0),
            localSecond =  Number.parseInt(this.second);
        localSecond += myValue;
        //localSecond = (localSecond>=60)?"00":((localSecond<10)?('0'+localSecond):(localSecond+''));
        if(localSecond<0){
            localSecond = "59";
        } else if ((localSecond>=0)&&(localSecond<10)){
            localSecond = "0"+localSecond;
        } else if (localSecond>=60){
            localSecond = "00"
        } else {
            localSecond = "" + localSecond;
        }
        //if(!this.minTime || !this.maxTime || this.dateUtil.isTimeWithinRange(this.buildTime(this.hour,this.minute,localSecond),this.minTime,this.maxTime,this.dateLocale.timeToken)){
        var myTime = this.buildTime(this.hour,this.minute,localSecond);
        if(this.isTimeEnabled(myTime)){
            this.second = localSecond;
            var self = this;
            this.$mdUtil.nextTick(function() {self.setNgModelValue();}, true);
        }
    };
    TimeSpinnerCtrl.prototype.parseTime = function(value){
        var timeArray = value.split(this.dateLocale.timeToken),
            hour = Number.parseInt(timeArray[0]),
            minute = Number.parseInt(timeArray[1]),
            second = Number.parseInt(timeArray[2]);
        hour = (hour<10)?("0"+hour):(""+hour);
        minute = (minute<10)?("0"+minute):(""+minute);
        second = (second<10)?("0"+second):(""+second);
        return {hour: hour,minute: minute,second: second}
    };
    TimeSpinnerCtrl.prototype.buildTime = function(hour,minute,second){
        var myHour = Number.parseInt(hour?hour:this.hour),
            myMinute = Number.parseInt(minute?minute:this.minute),
            mySecond = Number.parseInt(second?second:this.second);
        myHour = (myHour<10)?("0"+myHour):(""+myHour);
        myMinute = (myMinute<10)?("0"+myMinute):(""+myMinute);
        mySecond = (mySecond<10)?("0"+mySecond):(""+mySecond);
        myHour = myHour+"";
        myMinute = myMinute+"";
        mySecond = mySecond+"";
        return myHour+this.dateLocale.timeToken + myMinute + this.dateLocale.timeToken + mySecond;
    };
    TimeSpinnerCtrl.prototype.clearMouseListener = function(){
        this.documentElement.off('mouseup', this.bodyMouseupHandler);
        this.documentElement.off('mouseout', this.bodyMouseOutHandler);
    }
})(window.angular);
// 时间滚轮对应的输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropTimePicker', timePickerDirective);

    function timePickerDirective() {
        return {
            scope: {
                minTime: '=',
                maxTime: '=',
                placeholder: '@',
                timeFilter: '='
            },
            require: ['ngModel', 'ropTimePicker'],
            controller: TimePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="rop-timepicker">
                    <md-icon class="rop-timepicker-icon" md-svg-icon="device:ic_access_time_24px" ng-click="!ctrl.isDisabled && ctrl.openSpinnerPane($event)"></md-icon>
                    <input class="rop-timepicker-input" ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)" ng-disabled="ctrl.isDisabled">
                </div>

                <div class="rop-timepicker-spinner-pane md-whiteframe-z1">
                    <div class="rop-timepicker-input-mask">
                        <div class="rop-timepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-timepicker-spinner">
                        <rop-time-spinner role="dialog" min-date="ctrl.minTime" max-date="ctrl.maxTime" date-filter="ctrl.timeFilter" ng-model="ctrl.time" ng-if="ctrl.isSpinnerOpen">
                        </rop-calendar>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdDatePickerCtrl = controllers[1];
                mdDatePickerCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var INVALID_CLASS = 'rop-timepicker-invalid';
    var SPINNER_PANE_HEIGHT = 301;
    var SPINNER_PANE_WIDTH = 260;

    function TimePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);
        this.ngModelCtrl = null;
        this.inputElement = $element[0].querySelector('input');
        this.ngInputElement = angular.element(this.inputElement);
        this.inputContainer = $element[0].querySelector('.rop-timepicker');
        this.spinnerPane = $element[0].querySelector('.rop-timepicker-spinner-pane');
        this.spinnerButton = $element[0].querySelector('.rop-timepicker-icon');
        this.inputMask = $element[0].querySelector('.rop-timepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;
        this.time = null;
        this.isFocused = false;
        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isSpinnerOpen = false;
        this.openOnFocus = $attrs.hasOwnProperty('ropOpenOnFocus');

        this.spinnerPaneOpenedFrom = null;
        this.spinnerPane.id = 'rop-time-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeSpinnerPane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachSpinnerPane();
        });
    }
    TimePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    TimePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(typeof value == "string")) { throw Error('The ng-model for rop-timepicker must be a String instance. ' + 'Currently the model is a: ' + (typeof value));}

            self.time = value;
            //self.inputElement.value = self.dateLocale.formatDate(value);
            self.inputElement.value = value;
            //self.resizeInputElement();
            self.updateErrorState();
        };
    };
    TimePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
        this.inputElement.disabled = isDisabled;
        this.spinnerButton.disabled = isDisabled;
    };
    TimePickerCtrl.prototype.updateErrorState = function(opt_time) {
        var time = opt_time || this.time;
        this.clearErrorState();

        if (this.dateUtil.isValidTime(time,this.dateLocale.timeToken)) {
            if (this.dateUtil.isValidTime(this.minDate,this.dateLocale.timeToken)) {
                this.ngModelCtrl.$setValidity('mindate', this.dateUtil.isMinTimeBeforeMaxTime(this.minDate, time, this.dateLocale.timeToken));
            }
            if (this.dateUtil.isValidDate(this.maxDate)) {
                this.ngModelCtrl.$setValidity('maxdate', this.dateUtil.isMinTimeBeforeMaxTime(time, this.minDate, this.dateLocale.timeToken));
            }

            if (angular.isFunction(this.timeFilter)) {
                this.ngModelCtrl.$setValidity('filtered', this.timeFilter(time));
            }
        } else {
            // The date is seen as "not a valid date" if there is *something* set
            // (i.e.., not null or undefined), but that something isn't a valid date.
            this.ngModelCtrl.$setValidity('valid', time == null);
        }

        // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
        // because it doesn't conform to the DOMTokenList spec.
        // See https://github.com/ariya/phantomjs/issues/12782.
        if (!this.ngModelCtrl.$valid) {
            this.inputContainer.classList.add(INVALID_CLASS);
        }
    };
    TimePickerCtrl.prototype.clearErrorState = function() {
        this.inputContainer.classList.remove(INVALID_CLASS);
        ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function(field) {
            this.ngModelCtrl.$setValidity(field, true);
        }, this);
    };
    TimePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isSpinnerOpen) {
            // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-time-spinner');
            if (!isInCalendar) {
                this.closeSpinnerPane();
            }
            this.$scope.$digest();
        }
    };
    TimePickerCtrl.prototype.closeSpinnerPane = function() {
        if (this.isSpinnerOpen) {
            /*self.$scope.$on('md-calendar-change', function(event, date) {
                self.ngModelCtrl.$setViewValue(date);
                self.date = date;
                self.inputElement.value = self.dateLocale.formatDate(date);
                self.closeCalendarPane();
                self.resizeInputElement();
                self.updateErrorState();
            });
            self.ngModelCtrl.$setViewValue(date);*/
            this.ngModelCtrl.$setViewValue(this.time);
            this.inputElement.value = this.time;

            this.updateErrorState();
            //console.log(this.getSpinnerCtrl());
            this.detachSpinnerPane();
            this.isSpinnerOpen = false;
            this.spinnerPaneOpenedFrom.focus();
            this.spinnerPaneOpenedFrom = null;

            this.ngModelCtrl.$setTouched();

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);
        }
    };
    TimePickerCtrl.prototype.detachSpinnerPane = function() {
        this.$element.removeClass('rop-timepicker-open');
        this.spinnerPane.classList.remove('rop-pane-open');
        if (this.isSpinnerOpen) {this.$mdUtil.enableScrolling();}
        if (this.spinnerPane.parentNode) {this.spinnerPane.parentNode.removeChild(this.spinnerPane);}
    };

    TimePickerCtrl.prototype.installPropertyInterceptors = function() {
        var self = this;
        if (this.$attrs['ngDisabled']) {
            var scope = this.$scope.$parent;

            if (scope) {
                scope.$watch(this.$attrs['ngDisabled'], function(isDisabled) {
                    self.setDisabled(isDisabled);
                });
            }
        }

        Object.defineProperty(this, 'placeholder', {
            get: function() { return self.inputElement.placeholder; },
            set: function(value) { self.inputElement.placeholder = value || ''; }
        });
    };
    TimePickerCtrl.prototype.attachChangeListeners = function() {
        var self = this;

        self.$scope.$on('rop-spinner-change', function(event, time) {
            self.ngModelCtrl.$setViewValue(time);
            self.time = time;
            self.inputElement.value = time;
            self.closeSpinnerPane();
            //self.resizeInputElement();
            self.updateErrorState();
        });

        //self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
        // TODO(chenmike): Add ability for users to specify this interval.
        self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
            DEFAULT_DEBOUNCE_INTERVAL, self));
    };
    TimePickerCtrl.prototype.handleInputEvent = function() {
        var inputString = this.inputElement.value;
        /*var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
        this.dateUtil.setDateTimeToMidnight(parsedDate);*/
        var isValidInput = inputString == '' || (this.dateUtil.isValidTime(inputString, this.dateLocale.timeToken) && this.isTimeEnabled(inputString));
        if (isValidInput) {
            this.ngModelCtrl.$setViewValue(inputString);
            this.time = inputString;
        }

        this.updateErrorState(inputString);
    };
    /*TimePickerCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
            (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    };*/
    TimePickerCtrl.prototype.isTimeEnabled = function(time){
        if(angular.isFunction(this.timeFilter) && !this.timeFilter(time)){
            return false;
        }
        if(this.minTime && this.maxTime){
            return this.dateUtil.isTimeWithinRange(time,this.minTime,this.maxTime,this.dateLocale.timeToken)
        } else if (this.minTime){
            return this.dateUtil.isMinTimeBeforeMaxTime(this.minTime,time,this.dateLocale.timeToken)
        } else if(this.maxTime){
            return this.dateUtil.isMinTimeBeforeMaxTime(time,this.maxTime,this.dateLocale.timeToken)
        }
        return true;
    };
    TimePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        var keyCodes = this.$mdConstant.KEY_CODE;

        self.ngInputElement.on('keydown', function(event) {
            if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                self.openSpinnerPane(event);
                $scope.$digest();
            }
        });
        if (self.openOnFocus) {
            self.ngInputElement.on('focus', angular.bind(self, self.openSpinnerPane));
            angular.element(self.$window).on('blur', self.windowBlurHandler);

            $scope.$on('$destroy', function() {
                angular.element(self.$window).off('blur', self.windowBlurHandler);
            });
        }
        $scope.$on('rop-spinner-close', function() {
            self.closeSpinnerPane();
        });
    };
    TimePickerCtrl.prototype.handleWindowBlur = function() {
        this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
    };

    // 以下是用于组件关联和操作所用
    TimePickerCtrl.prototype.getSpinnerCtrl = function() {
        return angular.element(this.spinnerPane.querySelector('rop-time-spinner')).controller('ropTimeSpinner');
    };
    TimePickerCtrl.prototype.setFocused = function(isFocused) {
        if (!isFocused) {this.ngModelCtrl.$setTouched();}
        this.isFocused = isFocused;
    };
    TimePickerCtrl.prototype.focusSpinner = function() {
        var self = this;
        this.$mdUtil.nextTick(function() {self.getSpinnerCtrl().focus(0);
        }, false);
    };
    TimePickerCtrl.prototype.openSpinnerPane = function(event) {
        if (!this.isSpinnerOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isSpinnerOpen = true;

            if (!this.ngModelCtrl.$valid) {
                var time = this.buildTime();
                this.ngModelCtrl.$setViewValue(time);
                this.time = time;
                this.inputElement.value = time;
                this.updateErrorState(time);
            }

            this.spinnerPaneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.spinnerPane);

            this.attachSpinnerPane();
            this.focusSpinner();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    TimePickerCtrl.prototype.attachSpinnerPane = function() {
        var calendarPane = this.spinnerPane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-timepicker-open');

        var elementRect = this.inputContainer.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        var paneTop = elementRect.top + elementRect.height + 16 - bodyRect.top;
        var paneLeft = elementRect.left - bodyRect.left;

        var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

        var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

        var viewportBottom = viewportTop + this.$window.innerHeight;
        var viewportRight = viewportLeft + this.$window.innerWidth;

        if (paneLeft + SPINNER_PANE_WIDTH > viewportRight) {
            if (viewportRight - SPINNER_PANE_WIDTH > 0) {
                paneLeft = viewportRight - SPINNER_PANE_WIDTH;
            } else {
                paneLeft = viewportLeft;
                var scale = this.$window.innerWidth / SPINNER_PANE_WIDTH;
                calendarPane.style.transform = 'scale(' + scale + ')';
            }

            calendarPane.classList.add('rop-timepicker-pos-adjusted');
        }
        if (paneTop + SPINNER_PANE_HEIGHT > viewportBottom &&
            viewportBottom - SPINNER_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - SPINNER_PANE_HEIGHT;
            calendarPane.classList.add('rop-timepicker-pos-adjusted');
        }

        calendarPane.style.left = paneLeft + 'px';
        calendarPane.style.top = paneTop + 'px';
        document.body.appendChild(calendarPane);
        this.inputMask.style.left = elementRect.width + 'px';

        // Add CSS class after one frame to trigger open animation.
        this.$$rAF(function() {
            calendarPane.classList.add('rop-pane-open');
        });
    };
    TimePickerCtrl.prototype.buildTime = function(){
        return "00"+this.dateLocale.timeToken + "00" + this.dateLocale.timeToken + "00";
    };
})(window.angular);
// 两个时间滚轮对应的时间范围输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropTimeRangePicker', timeRangePickerDirective);

    function timeRangePickerDirective() {
        return {
            scope: {
                minTime: '=',
                maxTime: '=',
                placeholder: '@',
                timeFilter: '='
            },
            require: ['ropTimeRangePicker'],
            controller: TimeRangePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="rop-timerangepicker" ng-click="!ctrl.isDisabled && ctrl.openTimeRangePane($event)">
                    <md-icon class="rop-timerangepicker-icon" md-svg-icon="device:ic_access_time_24px"></md-icon>
                    <input class="rop-timepicker-input" disabled value="{{ctrl.buildTime()}}">
                </div>
                <div class="rop-timerangepicker-pane md-whiteframe-z1">
                    <div class="rop-timerangepicker-input-mask">
                        <div class="rop-timerangepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-timerangepicker-container">
                        <rop-time-spinner role="dialog" max-time="ctrl.maxTime" time-filter="ctrl.timeFilter" ng-model="ctrl.minTime" ng-if="ctrl.isTimeRangePaneOpen"></rop-time-spinner>
                        <rop-time-spinner role="dialog" min-time="ctrl.minTime" time-filter="ctrl.timeFilter" ng-model="ctrl.maxTime" ng-if="ctrl.isTimeRangePaneOpen"></rop-time-spinner>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                // 由于时间范围是一个范围，需要开始和结束两个点，所以一个输入框显然不能满足需求，把开始和结束一起输入到里面也不合适，所以取消了model的概念，只通过minTime和maxTime进行控制
                /*var ngModelCtrl = controllers[0];
                var mdDatePickerCtrl = controllers[1];
                mdDatePickerCtrl.configureNgModel(ngModelCtrl)*/;
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var SPINNER_PANE_HEIGHT = 301;
    var SPINNER_PANE_WIDTH = 504;

    function TimeRangePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);

        this.trigger = $element[0].querySelector('.rop-timerangepicker');
        this.$trigger = angular.element(this.trigger);
        this.timeRangePane = $element[0].querySelector('.rop-timerangepicker-pane');
        this.inputMask = $element[0].querySelector('.rop-timerangepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;

        this.now = this.dateLocale.freeFormatDate(new Date(), "HH"+this.dateLocale.timeToken+"mm"+this.dateLocale.timeToken+"ss");

        this.maxTime = this.dateUtil.isValidTime(this.maxTime,this.dateLocale.timeToken)?this.maxTime:this.now;
        this.minTime = this.dateUtil.isValidTime(this.maxTime,this.dateLocale.timeToken)?this.minTime:this.maxTime;

        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isTimeRangePaneOpen = false;

        this.timeRangePaneOpenedFrom = null;
        this.timeRangePane.id = 'rop-timerange-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeTimeRangePane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        //this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachTimeRangePane();
        });
    }
    TimeRangePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    TimeRangePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
    };
    TimeRangePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isTimeRangePaneOpen) {
            // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-time-spinner');
            if (!isInCalendar) {
                this.closeTimeRangePane();
            }
            this.$scope.$digest();
        }
    };
    TimeRangePickerCtrl.prototype.closeTimeRangePane = function() {
        if (this.isTimeRangePaneOpen) {
            this.detachTimeRangePane();
            this.isTimeRangePaneOpen = false;
            this.timeRangePaneOpenedFrom.focus();
            this.timeRangePaneOpenedFrom = null;

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);
        }
    };
    TimeRangePickerCtrl.prototype.detachTimeRangePane = function() {
        this.$element.removeClass('rop-timerangepicker-open');
        this.timeRangePane.classList.remove('rop-pane-open');
        if (this.isTimeRangePaneOpen) {this.$mdUtil.enableScrolling();}
        if (this.timeRangePane.parentNode) {this.timeRangePane.parentNode.removeChild(this.timeRangePane);}
    };

    TimeRangePickerCtrl.prototype.installPropertyInterceptors = function() {
        var self = this;
        if (this.$attrs['ngDisabled']) {
            var scope = this.$scope.$parent;

            if (scope) {
                scope.$watch(this.$attrs['ngDisabled'], function(isDisabled) {
                    self.setDisabled(isDisabled);
                });
            }
        }
    };
    TimeRangePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        $scope.$on('rop-spinner-close', function() {
            self.closeTimeRangePane();
        });
    };

    TimeRangePickerCtrl.prototype.openTimeRangePane = function(event) {
        if (!this.isTimeRangePaneOpen && !this.isDisabled) {
            this.isTimeRangePaneOpen = true;
            this.timeRangePaneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.timeRangePane);

            this.attachTimeRangePane();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    TimeRangePickerCtrl.prototype.attachTimeRangePane = function() {
        var calendarPane = this.timeRangePane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-timerangepicker-open');

        var elementRect = this.trigger.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        var paneTop = elementRect.top + elementRect.height + 16 - bodyRect.top;
        var paneLeft = elementRect.left - bodyRect.left;

        var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

        var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

        var viewportBottom = viewportTop + this.$window.innerHeight;
        var viewportRight = viewportLeft + this.$window.innerWidth;

        if (paneLeft + SPINNER_PANE_WIDTH > viewportRight) {
            if (viewportRight - SPINNER_PANE_WIDTH > 0) {
                paneLeft = viewportRight - SPINNER_PANE_WIDTH;
            } else {
                paneLeft = viewportLeft;
                var scale = this.$window.innerWidth / SPINNER_PANE_WIDTH;
                calendarPane.style.transform = 'scale(' + scale + ')';
            }

            calendarPane.classList.add('rop-timerangepicker-pos-adjusted');
        }
        if (paneTop + SPINNER_PANE_HEIGHT > viewportBottom &&
            viewportBottom - SPINNER_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - SPINNER_PANE_HEIGHT;
            calendarPane.classList.add('rop-timerangepicker-pos-adjusted');
        }

        calendarPane.style.left = paneLeft + 'px';
        calendarPane.style.top = paneTop + 'px';
        document.body.appendChild(calendarPane);
        this.inputMask.style.left = elementRect.width + 'px';

        // Add CSS class after one frame to trigger open animation.
        this.$$rAF(function() {
            calendarPane.classList.add('rop-pane-open');
        });
    };
    TimeRangePickerCtrl.prototype.buildTime = function(){
        return this.minTime + " - " + this.maxTime;
    };
})(window.angular);
// 单个日历表 + 时间范围对应的输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropDateTimeRangePicker', dateTimeRanggePickerDirective);

    function dateTimeRanggePickerDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                minTime: '=',
                maxTime: '=',
                placeholder: '@',
                dateFilter: '=',
                timeFilter: '=',
                callback: '='
            },
            require: ['ngModel', 'ropDateTimeRangePicker'],
            controller: DateTimeRangePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="rop-datetimerangepicker" ng-click="!ctrl.isDisabled && ctrl.openPane($event)">
                    <md-icon class="rop-datetimerangepicker-icon"  md-svg-icon="md-calendar"></md-icon>
                    <input class="rop-datetimerangepicker-input" disabled value="{{ctrl.buildDateTime()}}">
                </div>
                <div class="rop-datetimerangepicker-pane md-whiteframe-z1">
                    <div class="rop-datetimerangepicker-input-mask">
                        <div class="rop-datetimerangepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-datetimerangepicker-container">
                        <rop-calendar role="dialog" min-date="ctrl.minDate" max-date="ctrl.maxDate" date-filter="ctrl.dateFilter" ng-model="ctrl.date" ng-if="ctrl.isPaneOpen"></rop-calendar>
                        <rop-time-spinner role="dialog" max-time="ctrl.maxTime" time-filter="ctrl.timeFilter" ng-model="ctrl.minTime" ng-if="ctrl.isPaneOpen"></rop-time-spinner>
                        <rop-time-spinner role="dialog" min-time="ctrl.minTime" time-filter="ctrl.timeFilter" ng-model="ctrl.maxTime" ng-if="ctrl.isPaneOpen"></rop-time-spinner>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdDatePickerCtrl = controllers[1];
                mdDatePickerCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var INVALID_CLASS = 'rop-datetimerangepicker-invalid';
    var CALENDAR_PANE_HEIGHT = 301;
    var CALENDAR_PANE_WIDTH = 702;

    function DateTimeRangePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);
        this.ngModelCtrl = null;

        //this.inputElement = $element[0].querySelector('input');
        //this.ngInputElement = angular.element(this.inputElement);
        //this.inputContainer = $element[0].querySelector('.rop-datepicker');
        this.trigger = $element[0].querySelector('.rop-datetimerangepicker');
        this.$trigger = angular.element(this.trigger);

        this.pane = $element[0].querySelector('.rop-datetimerangepicker-pane');
        //this.calendarButton = $element[0].querySelector('.rop-datepicker-calendar-icon');
        this.inputMask = $element[0].querySelector('.rop-datetimerangepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;

        this.date = null;
        this.now = this.dateLocale.freeFormatDate(new Date(), "HH"+this.dateLocale.timeToken+"mm"+this.dateLocale.timeToken+"ss");
        this.maxTime = this.dateUtil.isValidTime(this.maxTime,this.dateLocale.timeToken)?this.maxTime:this.now;
        this.minTime = this.dateUtil.isValidTime(this.maxTime,this.dateLocale.timeToken)?this.minTime:this.maxTime;

        this.isFocused = false;
        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isPaneOpen = false;
        //this.openOnFocus = $attrs.hasOwnProperty('ropOpenOnFocus');

        this.paneOpenedFrom = null;
        this.pane.id = 'rop-datetimerange-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closePane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachPane();
        });
    }
    DateTimeRangePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    DateTimeRangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(value instanceof Date)) { throw Error('The ng-model for rop-datepicker must be a Date instance. ' + 'Currently the model is a: ' + (typeof value));}

            self.date = value;
            //self.inputElement.value = self.dateLocale.formatDate(value);
            //self.resizeInputElement();
            self.updateErrorState();
        };
    };
    DateTimeRangePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
        //this.inputElement.disabled = isDisabled;
        //this.calendarButton.disabled = isDisabled;
    };
    DateTimeRangePickerCtrl.prototype.updateErrorState = function(opt_date) {
        var date = opt_date || this.date;
        this.clearErrorState();

        if (this.dateUtil.isValidDate(date)) {
            date = this.dateUtil.createDateAtMidnight(date);
            if (this.dateUtil.isValidDate(this.minDate)) {
                var minDate = this.dateUtil.createDateAtMidnight(this.minDate);
                this.ngModelCtrl.$setValidity('mindate', date >= minDate);
            }
            if (this.dateUtil.isValidDate(this.maxDate)) {
                var maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
                this.ngModelCtrl.$setValidity('maxdate', date <= maxDate);
            }

            if (angular.isFunction(this.dateFilter)) {
                this.ngModelCtrl.$setValidity('filtered', this.dateFilter(date));
            }
        } else {
            // The date is seen as "not a valid date" if there is *something* set
            // (i.e.., not null or undefined), but that something isn't a valid date.
            this.ngModelCtrl.$setValidity('valid', date == null);
        }

        // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
        // because it doesn't conform to the DOMTokenList spec.
        // See https://github.com/ariya/phantomjs/issues/12782.
        if (!this.ngModelCtrl.$valid) {
            this.trigger.classList.add(INVALID_CLASS);
        }
    };
    DateTimeRangePickerCtrl.prototype.clearErrorState = function() {
        this.trigger.classList.remove(INVALID_CLASS);
        ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function(field) {
            this.ngModelCtrl.$setValidity(field, true);
        }, this);
    };
    DateTimeRangePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isPaneOpen) {
            // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-calendar'),
                isInSpinner = this.$mdUtil.getClosest(event.target, 'rop-time-spinner');
            if (!isInCalendar && !isInSpinner && document.contains(event.target)) {
                this.closePane();
            }
            this.$scope.$digest();
        }
    };
    DateTimeRangePickerCtrl.prototype.closePane = function() {
        if (this.isPaneOpen) {
            this.detachPane();
            this.isPaneOpen = false;
            this.paneOpenedFrom.focus();
            this.paneOpenedFrom = null;

            this.ngModelCtrl.$setTouched();

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);

            this.callback && this.callback.call();
        }
    };
    DateTimeRangePickerCtrl.prototype.detachPane = function() {
        this.$element.removeClass('rop-datetimepicker-open');
        this.pane.classList.remove('rop-pane-open');
        if (this.isPaneOpen) {this.$mdUtil.enableScrolling();}
        if (this.pane.parentNode) {this.pane.parentNode.removeChild(this.pane);}
    };

    DateTimeRangePickerCtrl.prototype.installPropertyInterceptors = function() {
        var self = this;
        if (this.$attrs['ngDisabled']) {
            var scope = this.$scope.$parent;

            if (scope) {
                scope.$watch(this.$attrs['ngDisabled'], function(isDisabled) {
                    self.setDisabled(isDisabled);
                });
            }
        }

        /*Object.defineProperty(this, 'placeholder', {
            get: function() { return self.inputElement.placeholder; },
            set: function(value) { self.inputElement.placeholder = value || ''; }
        });*/
    };
    DateTimeRangePickerCtrl.prototype.attachChangeListeners = function() {
        var self = this;

        self.$scope.$on('rop-calendar-change', function(event, date) {
            self.ngModelCtrl.$setViewValue(date);
            self.date = date;
            //self.inputElement.value = self.dateLocale.formatDate(date);
            //self.closeCalendarPane();
            //self.resizeInputElement();
            self.updateErrorState();
        });

        //self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
        // TODO(chenmike): Add ability for users to specify this interval.
        //self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent, DEFAULT_DEBOUNCE_INTERVAL, self));
    };
    /*DateTimeRangePickerCtrl.prototype.handleInputEvent = function() {
        var inputString = this.inputElement.value;
        var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
        this.dateUtil.setDateTimeToMidnight(parsedDate);
        var isValidInput = inputString == '' || (
            this.dateUtil.isValidDate(parsedDate) &&
            this.dateLocale.isDateComplete(inputString) &&
            this.isDateEnabled(parsedDate)
            );
        if (isValidInput) {
            this.ngModelCtrl.$setViewValue(parsedDate);
            this.date = parsedDate;
        }

        this.updateErrorState(parsedDate);
    };*/
    DateTimeRangePickerCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
            (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    };
    DateTimeRangePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        var keyCodes = this.$mdConstant.KEY_CODE;

        /*self.ngInputElement.on('keydown', function(event) {
            if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                self.openCalendarPane(event);
                $scope.$digest();
            }
        });*/
        /*if (self.openOnFocus) {
            self.ngInputElement.on('focus', angular.bind(self, self.openCalendarPane));
            angular.element(self.$window).on('blur', self.windowBlurHandler);

            $scope.$on('$destroy', function() {
                angular.element(self.$window).off('blur', self.windowBlurHandler);
            });
        }*/
        /*$scope.$on('rop-datetimerange-close', function() {
            self.closePane();
        });*/
        $scope.$on('rop-calendar-close', function() {
            self.closePane();
        });
        $scope.$on('rop-spinner-close', function() {
            self.closePane();
        })
    };
    DateTimeRangePickerCtrl.prototype.handleWindowBlur = function() {
        this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
    };

    // 以下是用于组件关联和操作所用
    DateTimeRangePickerCtrl.prototype.getCalendarCtrl = function() {
        return angular.element(this.pane.querySelector('rop-calendar')).controller('ropCalendar');
    };
    DateTimeRangePickerCtrl.prototype.setFocused = function(isFocused) {
        if (!isFocused) {this.ngModelCtrl.$setTouched();}
        this.isFocused = isFocused;
    };
    DateTimeRangePickerCtrl.prototype.focusCalendar = function() {
        var self = this;
        this.$mdUtil.nextTick(function() {self.getCalendarCtrl().focus();
        }, false);
    };
    DateTimeRangePickerCtrl.prototype.openPane = function(event) {
        if (!this.isPaneOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isPaneOpen = true;

            if (!this.ngModelCtrl.$valid) {
                var date = this.dateUtil.createDateAtMidnight();
                this.ngModelCtrl.$setViewValue(date);
                this.date = date;
                //this.inputElement.value = this.dateLocale.formatDate(date);
            }

            this.paneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.pane);

            this.attachPane();
            this.focusCalendar();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    DateTimeRangePickerCtrl.prototype.attachPane = function() {
        var calendarPane = this.pane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-datetimepicker-open');

        var elementRect = this.trigger.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        var paneTop = elementRect.top + elementRect.height + 16 - bodyRect.top;
        var paneLeft = elementRect.left - bodyRect.left;

        var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

        var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

        var viewportBottom = viewportTop + this.$window.innerHeight;
        var viewportRight = viewportLeft + this.$window.innerWidth;

        if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
            if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
            } else {
                paneLeft = viewportLeft;
                var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                calendarPane.style.transform = 'scale(' + scale + ')';
            }

            calendarPane.classList.add('rop-datetimerangepicker-pos-adjusted');
        }
        if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
            viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
            calendarPane.classList.add('rop-datetimerangepicker-pos-adjusted');
        }

        calendarPane.style.left = paneLeft + 'px';
        calendarPane.style.top = paneTop + 'px';
        document.body.appendChild(calendarPane);
        this.inputMask.style.left = elementRect.width + 'px';

        // Add CSS class after one frame to trigger open animation.
        this.$$rAF(function() {
            calendarPane.classList.add('rop-pane-open');
        });
    };
    DateTimeRangePickerCtrl.prototype.buildDateTime = function(){
        return this.dateLocale.formatDate(this.date) + "  "+ this.minTime + " - " + this.maxTime;
    };
})(window.angular);
// 日期范围，日期快捷键
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropShortcutCalendar', shortcutCalendarDirective);

    function shortcutCalendarDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                relativeIndexs:'=',
                shortcutTrigger:'='
            },
            require: ['ropShortcutCalendar'],
            controller: RopShortcutCalendarCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="shortcut-calendar-head">
                    <md-button class="md-raised" ng-class="{'active':ctrl.activeTab == 0}" aria-label="data control" ng-click="ctrl.activeTab = 0"><span>自然时间</span></md-button>
                    <md-button class="md-raised" ng-class="{'active':ctrl.activeTab == 1}" aria-label="data control" ng-click="ctrl.activeTab = 1"><span>相对时间</span></md-button>
                </div>
                <div class="shortcut-calendar-body">
                    <div ng-if="ctrl.activeTab == 0" class="wrapper">
                        <div class="grid"><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 0}" aria-label="data control" ng-click="ctrl.setRangeToToday()"><span>今天</span></md-button><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 1}" aria-label="data control" ng-click="ctrl.setRangeToYesterday()"><span>昨天</span></md-button></div>
                        <div class="grid"><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 2}" aria-label="data control" ng-click="ctrl.setRangeToThisWeek()"><span>本周</span></md-button><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 3}" aria-label="data control" ng-click="ctrl.setRangeToLastWeek()"><span>上周</span></md-button></div>
                        <div class="grid"><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 4}" aria-label="data control" ng-click="ctrl.setRangeToThisMonth()"><span>本月</span></md-button><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 5}" aria-label="data control" ng-click="ctrl.setRangeToLastMonth()"><span>上月</span></md-button></div>
                        <div class="grid"><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 6}" aria-label="data control" ng-click="ctrl.setRangeToThisSeason()"><span>本季度</span></md-button><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 7}" aria-label="data control" ng-click="ctrl.setRangeToLastSeason()"><span>上季度</span></md-button></div>
                        <div class="grid"><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 8}" aria-label="data control" ng-click="ctrl.setRangeToThisYear()"><span>本年度</span></md-button><md-button class="md-raised" ng-class="{'active':ctrl.activeItem == 9}" aria-label="data control" ng-click="ctrl.setRangeToLastYear()"><span>上年度</span></md-button></div>
                    </div>
                    <div ng-if="ctrl.activeTab == 1" class="wrapper">
                        <md-button class="md-raised" ng-class="{'active':ctrl.activeTab == relativeIndex}" aria-label="data control" ng-repeat="relativeIndex in ctrl.relativeIndexs" ng-click="ctrl.setRangeToRelative(relativeIndex)"><span ng-bind="'前' + (-relativeIndex) + '天'"></span></md-button>
                    </div>
                </div>
                <div class="shortcut-calendar-foot">
                    <md-button class="md-raised" aria-label="data control" ng-click="ctrl.shortcutTrigger()"><span>自定义</span></md-button>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                /*var ngModelCtrl = controllers[0];
                 var mdDatePickerCtrl = controllers[1];
                 mdDatePickerCtrl.configureNgModel(ngModelCtrl)*/;
            }
        };
    }
    function RopShortcutCalendarCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);

        this.trigger = $element[0].querySelector('.rop-timerangepicker');
        this.$trigger = angular.element(this.trigger);
        this.timeRangePane = $element[0].querySelector('.rop-timerangepicker-pane');
        this.inputMask = $element[0].querySelector('.rop-timerangepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;

        this.today = this.dateUtil.createDateAtMidnight(new Date());
        this.activeTab = 0;

        $mdTheming($element);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.relativeIndexs = this.relativeIndexs && (this.relativeIndexs instanceof Array) && this.relativeIndexs.length? this.relativeIndexs.slice(0,5):[-7,-30,-90,-180,-365];
    }
    RopShortcutCalendarCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    RopShortcutCalendarCtrl.prototype.setRangeToToday = function(){
        this.minDate = this.dateUtil.createDateAtMidnight(this.today);
        this.maxDate = this.dateUtil.createDateAtMidnight(this.today);
        this.activeItem = 0;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToYesterday = function(){
        var yesterday = this.dateUtil.incrementDays(this.today, -1);
        this.minDate = this.dateUtil.createDateAtMidnight(yesterday);
        this.maxDate = this.dateUtil.createDateAtMidnight(yesterday);
        this.activeItem = 1;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToThisWeek = function(){
        var dayIndex = this.today.getDay(),
            firstDayOfTheWeek = this.dateUtil.incrementDays(this.today, 1 - (dayIndex?dayIndex:7)),
            lastDayOfTheWeek = this.dateUtil.incrementDays(firstDayOfTheWeek, 6);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheWeek);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheWeek);
        this.activeItem = 2;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.today});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToLastWeek = function(){
        var dayIndex = this.today.getDay(),
            firstDayOfTheWeek = this.dateUtil.incrementDays(this.today, 1 - (dayIndex?dayIndex:7)),
            lastDayOfTheWeek = this.dateUtil.incrementDays(firstDayOfTheWeek, 6);
        this.minDate = this.dateUtil.createDateAtMidnight(this.dateUtil.incrementDays(firstDayOfTheWeek,-7));
        this.maxDate = this.dateUtil.createDateAtMidnight(this.dateUtil.incrementDays(lastDayOfTheWeek,-7));
        this.activeItem = 3;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToThisMonth = function(){
        var firstDayOfTheMonth = this.dateUtil.getFirstDateOfMonth(this.today),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(this.today),
            lastDayOfTheMonth = this.dateUtil.incrementDays(firstDayOfTheMonth, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheMonth);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheMonth);
        this.activeItem = 4;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.today});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToLastMonth = function(){
        var dateInLastMonth = this.dateUtil.incrementMonths(this.today, -1),
            firstDayOfTheMonth = this.dateUtil.getFirstDateOfMonth(dateInLastMonth),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(dateInLastMonth),
            lastDayOfTheMonth = this.dateUtil.incrementDays(firstDayOfTheMonth, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheMonth);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheMonth);
        this.activeItem = 5;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToThisSeason = function(){
        var months = this.dateUtil.getMonthsInSeason(this.today), monthIndex = this.today.getMonth(),
            firstDayOfTheSeason = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,months[0] - monthIndex)),
            firstDayOfLastMonthOfTheSeason = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,months[2] - monthIndex)),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(firstDayOfLastMonthOfTheSeason),
            lastDayOfTheSeason = this.dateUtil.incrementDays(firstDayOfLastMonthOfTheSeason, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheSeason);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheSeason);
        this.activeItem = 6;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.today});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToLastSeason = function(){
        var dateInLastSeason = this.dateUtil.incrementMonths(this.today, -3), months = this.dateUtil.getMonthsInSeason(dateInLastSeason), monthIndex = dateInLastSeason.getMonth(),
            firstDayOfTheSeason = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(dateInLastSeason, months[0] - monthIndex)),
            firstDayOfLastMonthOfTheSeason = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(dateInLastSeason, months[2] - monthIndex)),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(firstDayOfLastMonthOfTheSeason),
            lastDayOfTheSeason = this.dateUtil.incrementDays(firstDayOfLastMonthOfTheSeason, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheSeason);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheSeason);
        this.activeItem = 7;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToThisYear = function(){
        var monthIndex = this.today.getMonth(),
            firstDayOfTheYear = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,0 - monthIndex)),
            firstDayOfLastMonthOfTheYear = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,11 - monthIndex)),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(firstDayOfLastMonthOfTheYear),
            lastDayOfTheSeason = this.dateUtil.incrementDays(firstDayOfLastMonthOfTheYear, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheYear);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheSeason);
        this.activeItem = 8;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.today});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToLastYear = function(){
        var monthIndex = this.today.getMonth(),
            firstDayOfTheYear = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,0 - 12 - monthIndex)),
            firstDayOfLastMonthOfTheYear = this.dateUtil.getFirstDateOfMonth(this.dateUtil.incrementMonths(this.today,11 - 12 - monthIndex)),
            numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(firstDayOfLastMonthOfTheYear),
            lastDayOfTheSeason = this.dateUtil.incrementDays(firstDayOfLastMonthOfTheYear, numberOfDaysInMonth - 1);
        this.minDate = this.dateUtil.createDateAtMidnight(firstDayOfTheYear);
        this.maxDate = this.dateUtil.createDateAtMidnight(lastDayOfTheSeason);
        this.activeItem = 9;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
    RopShortcutCalendarCtrl.prototype.setRangeToRelative = function(days){
        var targetDay = this.dateUtil.incrementDays(this.today, days), yesterday = this.dateUtil.incrementDays(this.today, -1);
        this.targetDay = this.dateUtil.createDateAtMidnight(targetDay);
        this.yesterday = this.dateUtil.createDateAtMidnight(yesterday);
        this.maxDate = this.dateUtil.createDateAtMidnight(this.yesterday);
        this.minDate = (this.yesterday < this.targetDay)?this.maxDate : this.targetDay;
        // 由于业务需要，relativeIndexs必须是负数的数组，故用负数做标识不会和自然日标识重合
        this.activeItem = days;
        this.$scope.$parent.$parent.$broadcast('range-change',{minDate:this.minDate,maxDate:this.maxDate});
    };
})(window.angular);
// 日期范围 + 2个日历表对应的输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropDateRangePicker', dateRanggePickerDirective);

    function dateRanggePickerDirective() {
        return {
            scope: {
                minDate: '=',
                maxDate: '=',
                placeholder: '@',
                dateFilter: '=',
                callback: '='
            },
            require: ['ngModel', 'ropDateRangePicker'],
            controller: DateRangePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <div class="rop-daterangepicker" ng-click="!ctrl.isDisabled && ctrl.openPane($event)">
                    <md-icon class="rop-daterangepicker-icon"  md-svg-icon="md-calendar"></md-icon>
                    <input class="rop-daterangepicker-input" disabled value="{{ctrl.buildDate()}}">
                </div>
                <div class="rop-daterangepicker-pane md-whiteframe-z1">
                    <div class="rop-daterangepicker-input-mask">
                        <div class="rop-daterangepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-daterangepicker-container">
                        <rop-shortcut-calendar role="panel" min-date="ctrl.minDate" max-date="ctrl.maxDate" relative-indexs="relativeIndexs" shortcut-trigger="ctrl.toggleCustomize" ng-if="ctrl.isPaneOpen"></rop-shortcut-calendar>
                        <div class="calendar" ng-show="ctrl.customize">
                            <rop-calendar role="dialog" min-date="ctrl.minDate" max-date="ctrl.maxDate" date-filter="ctrl.dateFilter" ng-model="ctrl.minDate" range-calendar="{{'0'}}"></rop-calendar>
                            <rop-calendar role="dialog" min-date="ctrl.minDate" max-date="ctrl.maxDate" date-filter="ctrl.dateFilter" ng-model="ctrl.maxDate" range-calendar="{{'1'}}"></rop-calendar>
                        </div>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdDatePickerCtrl = controllers[1];
                mdDatePickerCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var INVALID_CLASS = 'rop-daterangepicker-invalid';
    var CALENDAR_PANE_HEIGHT = 301;
    var CALENDAR_PANE_WIDTH = 646;

    function DateRangePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;
        this.$$rAF = $$rAF;
        this.documentElement = angular.element(document.documentElement);
        this.ngModelCtrl = null;

        //this.inputElement = $element[0].querySelector('input');
        //this.ngInputElement = angular.element(this.inputElement);
        //this.inputContainer = $element[0].querySelector('.rop-datepicker');
        this.trigger = $element[0].querySelector('.rop-daterangepicker');
        this.$trigger = angular.element(this.trigger);

        this.pane = $element[0].querySelector('.rop-daterangepicker-pane');
        //this.calendarButton = $element[0].querySelector('.rop-datepicker-calendar-icon');
        this.inputMask = $element[0].querySelector('.rop-daterangepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;

        this.date = null;
        this.today = this.dateUtil.createDateAtMidnight(new Date());
        this.minDate = this.dateUtil.createDateAtMidnight(this.minDate);
        this.maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
        this.relativeIndexs = [];
        this.customize = false;
        this.isFocused = false;
        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isPaneOpen = false;
        //this.openOnFocus = $attrs.hasOwnProperty('ropOpenOnFocus');

        this.paneOpenedFrom = null;
        this.pane.id = 'rop-daterange-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closePane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);
        this.toggleCustomize = angular.bind(this, function(){this.customize = !this.customize;});

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachPane();
        });
    }
    DateRangePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    DateRangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(value instanceof Date)) { throw Error('The ng-model for rop-datepicker must be a Date instance. ' + 'Currently the model is a: ' + (typeof value));}

            self.date = value;
            //self.inputElement.value = self.dateLocale.formatDate(value);
            //self.resizeInputElement();
            self.updateErrorState();
        };
    };
    DateRangePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
        //this.inputElement.disabled = isDisabled;
        //this.calendarButton.disabled = isDisabled;
    };
    DateRangePickerCtrl.prototype.updateErrorState = function(opt_date) {
        var date = opt_date || this.date;
        this.clearErrorState();

        if (this.dateUtil.isValidDate(date)) {
            date = this.dateUtil.createDateAtMidnight(date);
            if (this.dateUtil.isValidDate(this.minDate)) {
                var minDate = this.dateUtil.createDateAtMidnight(this.minDate);
                this.ngModelCtrl.$setValidity('mindate', date >= minDate);
            }
            if (this.dateUtil.isValidDate(this.maxDate)) {
                var maxDate = this.dateUtil.createDateAtMidnight(this.maxDate);
                this.ngModelCtrl.$setValidity('maxdate', date <= maxDate);
            }

            if (angular.isFunction(this.dateFilter)) {
                this.ngModelCtrl.$setValidity('filtered', this.dateFilter(date));
            }
        } else {
            // The date is seen as "not a valid date" if there is *something* set
            // (i.e.., not null or undefined), but that something isn't a valid date.
            this.ngModelCtrl.$setValidity('valid', date == null);
        }

        // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
        // because it doesn't conform to the DOMTokenList spec.
        // See https://github.com/ariya/phantomjs/issues/12782.
        if (!this.ngModelCtrl.$valid) {
            this.trigger.classList.add(INVALID_CLASS);
        }
    };
    DateRangePickerCtrl.prototype.clearErrorState = function() {
        this.trigger.classList.remove(INVALID_CLASS);
        ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function(field) {
            this.ngModelCtrl.$setValidity(field, true);
        }, this);
    };
    DateRangePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isPaneOpen) {
            // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-calendar'),
                isInSpinner = this.$mdUtil.getClosest(event.target, 'rop-shortcut-calendar');
            if (!isInCalendar && !isInSpinner && document.contains(event.target)) {
                this.closePane();
            }
            this.$scope.$digest();
        }
    };
    DateRangePickerCtrl.prototype.closePane = function() {
        if (this.isPaneOpen) {
            this.detachPane();
            this.isPaneOpen = false;
            this.paneOpenedFrom.focus();
            this.paneOpenedFrom = null;

            this.ngModelCtrl.$setTouched();

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);

            this.callback && this.callback.call();
        }
    };
    DateRangePickerCtrl.prototype.detachPane = function() {
        this.$element.removeClass('rop-pane-open');
        this.pane.classList.remove('rop-pane-open');
        if (this.isPaneOpen) {this.$mdUtil.enableScrolling();}
        if (this.pane.parentNode) {this.pane.parentNode.removeChild(this.pane);}
    };

    DateRangePickerCtrl.prototype.installPropertyInterceptors = function() {
        var self = this;
        if (this.$attrs['ngDisabled']) {
            var scope = this.$scope.$parent;

            if (scope) {
                scope.$watch(this.$attrs['ngDisabled'], function(isDisabled) {
                    self.setDisabled(isDisabled);
                });
            }
        }

        /*Object.defineProperty(this, 'placeholder', {
         get: function() { return self.inputElement.placeholder; },
         set: function(value) { self.inputElement.placeholder = value || ''; }
         });*/
    };
    DateRangePickerCtrl.prototype.attachChangeListeners = function() {
        var self = this;

        self.$scope.$on('rop-calendar-change', function(event, date) {
            self.ngModelCtrl.$setViewValue(date);
            self.date = date;
            //self.inputElement.value = self.dateLocale.formatDate(date);
            //self.closeCalendarPane();
            //self.resizeInputElement();
            self.updateErrorState();
        });

        //self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
        // TODO(chenmike): Add ability for users to specify this interval.
        //self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent, DEFAULT_DEBOUNCE_INTERVAL, self));
    };
    DateRangePickerCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
            (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    };
    DateRangePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        var keyCodes = this.$mdConstant.KEY_CODE;

        $scope.$on('rop-calendar-close', function() {
            self.closePane();
        });
    };
    DateRangePickerCtrl.prototype.handleWindowBlur = function() {
        this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
    };

    // 以下是用于组件关联和操作所用
    DateRangePickerCtrl.prototype.getCalendarCtrl = function() {
        return angular.element(this.pane.querySelector('rop-calendar')).controller('ropCalendar');
    };
    DateRangePickerCtrl.prototype.setFocused = function(isFocused) {
        if (!isFocused) {this.ngModelCtrl.$setTouched();}
        this.isFocused = isFocused;
    };
    DateRangePickerCtrl.prototype.focusCalendar = function() {
        var self = this;
        this.$mdUtil.nextTick(function() {self.getCalendarCtrl().focus();
        }, false);
    };
    DateRangePickerCtrl.prototype.openPane = function(event) {
        if (!this.isPaneOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isPaneOpen = true;

            if (!this.ngModelCtrl.$valid) {
                var date = this.dateUtil.createDateAtMidnight();
                this.ngModelCtrl.$setViewValue(date);
                this.date = date;
                //this.inputElement.value = this.dateLocale.formatDate(date);
            }

            this.paneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.pane);

            this.attachPane();
            this.focusCalendar();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    DateRangePickerCtrl.prototype.attachPane = function() {
        var calendarPane = this.pane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-pane-open');

        var elementRect = this.trigger.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();

        var paneTop = elementRect.top + elementRect.height + 16 - bodyRect.top;
        var paneLeft = elementRect.left - bodyRect.left;

        var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

        var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

        var viewportBottom = viewportTop + this.$window.innerHeight;
        var viewportRight = viewportLeft + this.$window.innerWidth;

        if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
            if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
            } else {
                paneLeft = viewportLeft;
                var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                calendarPane.style.transform = 'scale(' + scale + ')';
            }

            calendarPane.classList.add('rop-daterangepicker-pos-adjusted');
        }
        if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
            viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
            calendarPane.classList.add('rop-daterangepicker-pos-adjusted');
        }

        calendarPane.style.left = paneLeft + 'px';
        calendarPane.style.top = paneTop + 'px';
        document.body.appendChild(calendarPane);
        this.inputMask.style.left = elementRect.width + 'px';

        // Add CSS class after one frame to trigger open animation.
        this.$$rAF(function() {
            calendarPane.classList.add('rop-pane-open');
        });
    };
    DateRangePickerCtrl.prototype.buildDate = function(){
        return this.dateLocale.formatDate(this.minDate) + "   -   " + this.dateLocale.formatDate(this.maxDate);
    };
})(window.angular);
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').config(["$provide",  ($provide)=> {
        // TODO(jelbourn): Assert provided values are correctly formatted. Need assertions.

        /** @constructor */
        function DateLocaleProvider() {
            /** Array of full month names. E.g., ['January', 'Febuary', ...] */
            this.months = null;

            /** Array of abbreviated month names. E.g., ['Jan', 'Feb', ...] */
            this.shortMonths = null;

            /** Array of full day of the week names. E.g., ['Monday', 'Tuesday', ...] */
            this.days = null;

            /** Array of abbreviated dat of the week names. E.g., ['M', 'T', ...] */
            this.shortDays = null;

            /** Array of dates of a month (1 - 31). Characters might be different in some locales. */
            this.dates = null;

            /** Index of the first day of the week. 0 = Sunday, 1 = Monday, etc. */
            this.firstDayOfWeek = 0;

            /**
             * Function that converts the date portion of a Date to a string.
             * @type {(function(Date): string)}
             */
            this.formatDate = null;

            /**
             * Function that converts a date string to a Date object (the date portion)
             * @type {function(string): Date}
             */
            this.parseDate = null;

            /**
             * Function that formats a Date into a month header string.
             * @type {function(Date): string}
             */
            this.monthHeaderFormatter = null;

            /**
             * Function that formats a week number into a label for the week.
             * @type {function(number): string}
             */
            this.weekNumberFormatter = null;

            /**
             * Function that formats a date into a long aria-label that is read
             * when the focused date changes.
             * @type {function(Date): string}
             */
            this.longDateFormatter = null;

            /**
             * ARIA label for the calendar "dialog" used in the datepicker.
             * @type {string}
             */
            this.msgCalendar = '';

            /**
             * ARIA label for the datepicker's "Open calendar" buttons.
             * @type {string}
             */
            this.msgOpenCalendar = '';

            this.hourLabel = "时";
            this.minuteLabel = "分";
            this.secondLabel = "秒";
            this.timeToken = ":";
        }

        /**
         * Factory function that returns an instance of the dateLocale service.
         * ngInject
         * @param $locale
         * @returns {DateLocale}
         */
        DateLocaleProvider.prototype.$get = function ($locale) {
            /**
             * Default date-to-string formatting function.
             * @param {!Date} date
             * @returns {string}
             */
            function defaultFormatDate(date) {
                if (!date) {
                    return '';
                }
                var localeTime = date.toLocaleTimeString();
                var formatDate = date;
                if (date.getHours() == 0 &&
                    (localeTime.indexOf('11:') !== -1 || localeTime.indexOf('23:') !== -1)) {
                    formatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0);
                }

                return formatDate.getFullYear() + "-" + (formatDate.getMonth() + 1) + "-" + (formatDate.getDate());
            }
            function defaultFormatTime(date) {
                if (!date) {
                    return '';
                }
                return date.toLocaleTimeString();
            }
            function freeFormatDate(date, fmt) { //author: meizz
                let o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "H+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
                for (let k in o)
                    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
                return fmt;
            }
            /**
             * Default string-to-date parsing function.
             * @param {string} dateString
             * @returns {!Date}
             */
            function defaultParseDate(dateString) {
                return new Date(dateString);
            }

            /**
             * Default function to determine whether a string makes sense to be
             * parsed to a Date object.
             *
             * This is very permissive and is just a basic sanity check to ensure that
             * things like single integers aren't able to be parsed into dates.
             * @param {string} dateString
             * @returns {boolean}
             */
            function defaultIsDateComplete(dateString) {
                dateString = dateString.trim();

                // Looks for three chunks of content (either numbers or text) separated
                // by delimiters.
                var re = /^(([a-zA-Z]{3,}|[0-9]{1,4})([ \.,]+|[\/\-])){2}([a-zA-Z]{3,}|[0-9]{1,4})$/;
                return re.test(dateString);
            }

            /**
             * Default date-to-string formatter to get a month header.
             * @param {!Date} date
             * @returns {string}
             */
            function defaultMonthHeaderFormatter(date) {
                return date.getFullYear() + ' ' + service.shortMonths[date.getMonth()];
            }

            /**
             * Default week number formatter.
             * @param number
             * @returns {string}
             */
            function defaultWeekNumberFormatter(number) {
                return 'Week ' + number;
            }

            /**
             * Default formatter for date cell aria-labels.
             * @param {!Date} date
             * @returns {string}
             */
            function defaultLongDateFormatter(date) {
                // Example: 'Thursday June 18 2015'
                return [
                    service.days[date.getDay()],
                    service.months[date.getMonth()],
                    service.dates[date.getDate()],
                    date.getFullYear()
                ].join(' ');
            }

            // The default "short" day strings are the first character of each day,
            // e.g., "Monday" => "M".
            var defaultShortDays = ['日', '一', '二', '三', '四', '五', '六'];
            /*$locale.DATETIME_FORMATS.DAY.map(function (day) {
             return day[0];
             });*/

            // The default dates are simply the numbers 1 through 31.
            var defaultDates = Array(32);
            for (var i = 1; i <= 31; i++) {
                defaultDates[i] = i;
            }

            // Default ARIA messages are in English (US).
            var defaultMsgCalendar = 'Calendar';
            var defaultMsgOpenCalendar = 'Open calendar';

            var service = {
                /*$mdDateLocaleProvider.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

                 $mdDateLocaleProvider.shortDays = $mdDateLocaleProvider.days = ['日', '一', '二', '三', '四', '五', '六'];*/
                months: this.months || $locale.DATETIME_FORMATS.MONTH,
                shortMonths: this.shortMonths || ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                days: this.days || $locale.DATETIME_FORMATS.DAY,
                shortDays: this.shortDays || defaultShortDays,
                dates: this.dates || defaultDates,
                firstDayOfWeek: this.firstDayOfWeek || 0,
                formatDate: this.formatDate || defaultFormatDate,
                formatTime: this.formatTime || defaultFormatTime,
                parseDate: this.parseDate || defaultParseDate,
                isDateComplete: this.isDateComplete || defaultIsDateComplete,
                monthHeaderFormatter: this.monthHeaderFormatter || defaultMonthHeaderFormatter,
                weekNumberFormatter: this.weekNumberFormatter || defaultWeekNumberFormatter,
                longDateFormatter: this.longDateFormatter || defaultLongDateFormatter,
                msgCalendar: this.msgCalendar || defaultMsgCalendar,
                msgOpenCalendar: this.msgOpenCalendar || defaultMsgOpenCalendar,
                hourLabel: this.hourLabel,
                minuteLabel: this.minuteLabel,
                secondLabel:this.secondLabel,
                timeToken:this.timeToken,
                freeFormatDate: this.freeFormatDate || freeFormatDate
            };

            return service;
        };
        DateLocaleProvider.prototype.$get.$inject = ["$locale"];

        $provide.provider('$mdDateLocale', new DateLocaleProvider());
    }]);
})(window.angular);
(function(angular) {
    'use strict';

    /**
     * Utility for performing date calculations to facilitate operation of the calendar and
     * datepicker.
     */
    angular.module('rop.module.calendar').factory('$$mdDateUtil', function() {
        return {
            getFirstDateOfMonth: getFirstDateOfMonth,
            getNumberOfDaysInMonth: getNumberOfDaysInMonth,
            getDateInNextMonth: getDateInNextMonth,
            getDateInPreviousMonth: getDateInPreviousMonth,
            isInNextMonth: isInNextMonth,
            isInPreviousMonth: isInPreviousMonth,
            getDateMidpoint: getDateMidpoint,
            isSameMonthAndYear: isSameMonthAndYear,
            getWeekOfMonth: getWeekOfMonth,
            incrementDays: incrementDays,
            incrementMonths: incrementMonths,
            getLastDateOfMonth: getLastDateOfMonth,
            isSameDay: isSameDay,
            getMonthDistance: getMonthDistance,
            isValidDate: isValidDate,
            setDateTimeToMidnight: setDateTimeToMidnight,
            createDateAtMidnight: createDateAtMidnight,
            isDateWithinRange: isDateWithinRange,
            isMinTimeBeforeMaxTime: isMinTimeBeforeMaxTime,
            isValidTime: isValidTime,
            isTimeWithinRange: isTimeWithinRange,
            getMonthsInSeason: getMonthsInSeason
        };

        /**
         * Gets the first day of the month for the given date's month.
         * @param {Date} date
         * @returns {Date}
         */
        function getFirstDateOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        /**
         * Gets the season month index for the give date.
         * @param {Date} date
         * @returns {Date}
         */
        function getMonthsInSeason(date) {
            var months = [], monthIndex = date.getMonth();
            if((monthIndex >=0 )&&(monthIndex <=2 )){
                months = [0,1,2];
            } else if((monthIndex >=3 )&&(monthIndex <=5 )){
                months = [3,4,5];
            } else if((monthIndex >=6 )&&(monthIndex <=8 )){
                months = [6,7,8];
            } else if((monthIndex >=9 )&&(monthIndex <=11 )){
                months = [9,10,11];
            }
            return months;
        }

        /**
         * Gets the number of days in the month for the given date's month.
         * @param date
         * @returns {number}
         */
        function getNumberOfDaysInMonth(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        }

        /**
         * Get an arbitrary date in the month after the given date's month.
         * @param date
         * @returns {Date}
         */
        function getDateInNextMonth(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        }

        /**
         * Get an arbitrary date in the month before the given date's month.
         * @param date
         * @returns {Date}
         */
        function getDateInPreviousMonth(date) {
            return new Date(date.getFullYear(), date.getMonth() - 1, 1);
        }

        /**
         * Gets whether two dates have the same month and year.
         * @param {Date} d1
         * @param {Date} d2
         * @returns {boolean}
         */
        function isSameMonthAndYear(d1, d2) {
            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
        }

        /**
         * Gets whether two dates are the same day (not not necesarily the same time).
         * @param {Date} d1
         * @param {Date} d2
         * @returns {boolean}
         */
        function isSameDay(d1, d2) {
            return d1.getDate() == d2.getDate() && isSameMonthAndYear(d1, d2);
        }

        /**
         * Gets whether a date is in the month immediately after some date.
         * @param {Date} startDate The date from which to compare.
         * @param {Date} endDate The date to check.
         * @returns {boolean}
         */
        function isInNextMonth(startDate, endDate) {
            var nextMonth = getDateInNextMonth(startDate);
            return isSameMonthAndYear(nextMonth, endDate);
        }

        /**
         * Gets whether a date is in the month immediately before some date.
         * @param {Date} startDate The date from which to compare.
         * @param {Date} endDate The date to check.
         * @returns {boolean}
         */
        function isInPreviousMonth(startDate, endDate) {
            var previousMonth = getDateInPreviousMonth(startDate);
            return isSameMonthAndYear(endDate, previousMonth);
        }

        /**
         * Gets the midpoint between two dates.
         * @param {Date} d1
         * @param {Date} d2
         * @returns {Date}
         */
        function getDateMidpoint(d1, d2) {
            return createDateAtMidnight((d1.getTime() + d2.getTime()) / 2);
        }

        /**
         * Gets the week of the month that a given date occurs in.
         * @param {Date} date
         * @returns {number} Index of the week of the month (zero-based).
         */
        function getWeekOfMonth(date) {
            var firstDayOfMonth = getFirstDateOfMonth(date);
            return Math.floor((firstDayOfMonth.getDay() + date.getDate() - 1) / 7);
        }

        /**
         * Gets a new date incremented by the given number of days. Number of days can be negative.
         * @param {Date} date
         * @param {number} numberOfDays
         * @returns {Date}
         */
        function incrementDays(date, numberOfDays) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate() + numberOfDays);
        }

        /**
         * Gets a new date incremented by the given number of months. Number of months can be negative.
         * If the date of the given month does not match the target month, the date will be set to the
         * last day of the month.
         * @param {Date} date
         * @param {number} numberOfMonths
         * @returns {Date}
         */
        function incrementMonths(date, numberOfMonths) {
            // If the same date in the target month does not actually exist, the Date object will
            // automatically advance *another* month by the number of missing days.
            // For example, if you try to go from Jan. 30 to Feb. 30, you'll end up on March 2.
            // So, we check if the month overflowed and go to the last day of the target month instead.
            var dateInTargetMonth = new Date(date.getFullYear(), date.getMonth() + numberOfMonths, 1);
            var numberOfDaysInMonth = getNumberOfDaysInMonth(dateInTargetMonth);
            if (numberOfDaysInMonth < date.getDate()) {
                dateInTargetMonth.setDate(numberOfDaysInMonth);
            } else {
                dateInTargetMonth.setDate(date.getDate());
            }

            return dateInTargetMonth;
        }

        /**
         * Get the integer distance between two months. This *only* considers the month and year
         * portion of the Date instances.
         *
         * @param {Date} start
         * @param {Date} end
         * @returns {number} Number of months between `start` and `end`. If `end` is before `start`
         *     chronologically, this number will be negative.
         */
        function getMonthDistance(start, end) {
            return (12 * (end.getFullYear() - start.getFullYear())) + (end.getMonth() - start.getMonth());
        }

        /**
         * Gets the last day of the month for the given date.
         * @param {Date} date
         * @returns {Date}
         */
        function getLastDateOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth(), getNumberOfDaysInMonth(date));
        }

        /**
         * Checks whether a date is valid.
         * @param {Date} date
         * @return {boolean} Whether the date is a valid Date.
         */
        function isValidDate(date) {
            return date != null && date.getTime && !isNaN(date.getTime());
        }

        /**
         * Sets a date's time to midnight.
         * @param {Date} date
         */
        function setDateTimeToMidnight(date) {
            if (isValidDate(date)) {
                date.setHours(0, 0, 0, 0);
            }
        }

        /**
         * Creates a date with the time set to midnight.
         * Drop-in replacement for two forms of the Date constructor:
         * 1. No argument for Date representing now.
         * 2. Single-argument value representing number of seconds since Unix Epoch
         * or a Date object.
         * @param {number|Date=} opt_value
         * @return {Date} New date with time set to midnight.
         */
        function createDateAtMidnight(opt_value) {
            var date;
            if (angular.isUndefined(opt_value)) {
                date = new Date();
            } else {
                date = new Date(opt_value);
            }
            setDateTimeToMidnight(date);
            return date;
        }

        /**
         * Checks if a date is within a min and max range, ignoring the time component.
         * If minDate or maxDate are not dates, they are ignored.
         * @param {Date} date
         * @param {Date} minDate
         * @param {Date} maxDate
         */
        function isDateWithinRange(date, minDate, maxDate) {
            var dateAtMidnight = createDateAtMidnight(date);
            var minDateAtMidnight = isValidDate(minDate) ? createDateAtMidnight(minDate) : null;
            var maxDateAtMidnight = isValidDate(maxDate) ? createDateAtMidnight(maxDate) : null;
            return (!minDateAtMidnight || minDateAtMidnight <= dateAtMidnight) &&
                (!maxDateAtMidnight || maxDateAtMidnight >= dateAtMidnight);
        }

        /**
         * Checks if the minTime is before maxTime, we prefer not to use Date instance for calculation
         * @param {String} minTime
         * @param {String} maxTime
         * @param {String} token
         */
        function isMinTimeBeforeMaxTime(minTime, maxTime, token) {
            if(!token || (typeof token !=  "string")) {return null};
            var minTimeArray = minTime.split(token).map(r=>{return Number.parseInt(r)}), maxTimeArray = maxTime.split(token).map(r=>{return Number.parseInt(r)});
            if((minTimeArray.length<3) || (maxTimeArray.length<3)){return null};
            var minTimestamp = minTimeArray[2]+minTimeArray[1]*60+minTimeArray[0]*60*60, maxTimestamp = maxTimeArray[2]+maxTimeArray[1]*60+maxTimeArray[0]*60*60;
            return (minTimestamp <= maxTimestamp);
        }
        /**
         * Checks if the minTime is before maxTime, we prefer not to use Date instance for calculation
         * @param {String} time
         * @param {String} minTime
         * @param {String} maxTime
         * @param {String} token
         */
        function isTimeWithinRange(time, minTime, maxTime, token) {
            if(!token || (typeof token !=  "string")) {return null};
            var timeArray = time.split(token).map(r=>{return Number.parseInt(r)}),minTimeArray = minTime.split(token).map(r=>{return Number.parseInt(r)}), maxTimeArray = maxTime.split(token).map(r=>{return Number.parseInt(r)});
            if((minTimeArray.length<3) || (maxTimeArray.length<3) || (timeArray.length<3)){return null};
            var timestamp = timeArray[2]+timeArray[1]*60+timeArray[0]*60*60,
                minTimestamp = minTimeArray[2]+minTimeArray[1]*60+minTimeArray[0]*60*60, maxTimestamp = maxTimeArray[2]+maxTimeArray[1]*60+maxTimeArray[0]*60*60;
            return (timestamp <= maxTimestamp) && (minTimestamp <= timestamp);
        }
        /**
         * @param {String} time
         * @param {String} token
         */
        function isValidTime(time, token) {
            return new RegExp("^([0-1]?[0-9]|2[0-3])"+token+"([0-5]?[0-9])"+token+"([0-5]?[0-9])$").test(time)
        }
    });
})(window.angular);
/**
 * Created by robin on 10/14/16.
 */
