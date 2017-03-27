
// TODO
(function (angular) {
    "use strict";
    let applicationApp = angular.module('rop.module.calender', []);
    // TODO calendar picker, customized
    (function (applicationApp) {
        'use strict';

        /**
         * @ngdoc module
         * @name material.components.datepicker
         * @description Datepicker
         */
        applicationApp.directive('mdCustomCalendar', calendarDirective);


        // POST RELEASE
        // TODO(jelbourn): Mac Cmd + left / right == Home / End
        // TODO(jelbourn): Clicking on the month label opens the month-picker.
        // TODO(jelbourn): Minimum and maximum date
        // TODO(jelbourn): Refactor month element creation to use cloneNode (performance).
        // TODO(jelbourn): Define virtual scrolling constants (compactness) users can override.
        // TODO(jelbourn): Animated month transition on ng-model change (virtual-repeat)
        // TODO(jelbourn): Scroll snapping (virtual repeat)
        // TODO(jelbourn): Remove superfluous row from short months (virtual-repeat)
        // TODO(jelbourn): Month headers stick to top when scrolling.
        // TODO(jelbourn): Previous month opacity is lowered when partially scrolled out of view.
        // TODO(jelbourn): Support md-calendar standalone on a page (as a tabstop w/ aria-live
        //     announcement and key handling).
        // Read-only calendar (not just date-picker).

        /**
         * Height of one calendar month tbody. This must be made known to the virtual-repeat and is
         * subsequently used for scrolling to specific months.
         */
        var TBODY_HEIGHT = 160;

        /**
         * Height of a calendar month with a single row. This is needed to calculate the offset for
         * rendering an extra month in virtual-repeat that only contains one row.
         */
        var TBODY_SINGLE_ROW_HEIGHT = 24;

        function calendarDirective() {
            return {
                template: '<div aria-hidden="true" class="md-calendar-year-header"><md-icon ng-click="ctrl.lastYear($event)" md-svg-icon="navigation:ic_chevron_left_24px"></md-icon><span class="flex" ng-bind="ctrl.getCustomYear()"></span><md-icon ng-click="ctrl.nextYear($event)" md-svg-icon="navigation:ic_chevron_right_24px"></md-icon></div>' +
                '<table aria-hidden="true" class="md-calendar-day-header"><thead></thead></table>' +
                '<div class="md-calendar-scroll-mask">' +
                '<md-virtual-repeat-container class="md-calendar-scroll-container" md-top-index="ctrl.customIndex"' +
                'md-offset-size="' + (TBODY_SINGLE_ROW_HEIGHT - TBODY_HEIGHT) + '">' +
                '<table role="grid" tabindex="0" class="md-calendar" aria-readonly="true">' +
                '<tbody role="rowgroup" md-virtual-repeat="i in ctrl.items" md-custom-calendar-month ' +
                'md-month-offset="$index" class="md-calendar-month" ' +
                'md-start-index="ctrl.getSelectedMonthIndex()" ' +
                'md-item-size="' + TBODY_HEIGHT + '"></tbody>' +
                '</table>' +
                '</md-virtual-repeat-container>' +
                '</div>',
                scope: {
                    minDate: '=mdMinDate',
                    maxDate: '=mdMaxDate',
                    dateFilter: '=mdDateFilter',
                },
                require: ['ngModel', 'mdCustomCalendar'],
                controller: CalendarCtrl,
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attrs, controllers) {
                    var ngModelCtrl = controllers[0];
                    var mdCalendarCtrl = controllers[1];
                    mdCalendarCtrl.configureNgModel(ngModelCtrl);
                }
            };
        }

        /** Class applied to the selected date cell/. */
        var SELECTED_DATE_CLASS = 'md-calendar-selected-date';

        /** Class applied to the focused date cell/. */
        var FOCUSED_DATE_CLASS = 'md-focus';

        /** Next identifier for calendar instance. */
        var nextUniqueId = 0;

        /** The first renderable date in the virtual-scrolling calendar (for all instances). */
        var firstRenderableDate = null;

        /**
         * Controller for the mdCalendar component.
         * ngInject @constructor
         */
        function CalendarCtrl($element, $attrs, $scope, $animate, $q, $mdConstant,
                              $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil) {
            $mdTheming($element);
            /**
             * Dummy array-like object for virtual-repeat to iterate over. The length is the total
             * number of months that can be viewed. This is shorter than ideal because of (potential)
             * Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1181658.
             */
            this.items = {length: 2000};
            this.customIndex = 0;
            if (this.maxDate && this.minDate) {
                // Limit the number of months if min and max dates are set.
                var numMonths = $$mdDateUtil.getMonthDistance(this.minDate, this.maxDate) + 1;
                numMonths = Math.max(numMonths, 1);
                // Add an additional month as the final dummy month for rendering purposes.
                numMonths += 1;
                this.items.length = numMonths;
            }

            /** @final {!angular.$animate} */
            this.$animate = $animate;

            /** @final {!angular.$q} */
            this.$q = $q;

            /** @final */
            this.$mdInkRipple = $mdInkRipple;

            /** @final */
            this.$mdUtil = $mdUtil;

            /** @final */
            this.keyCode = $mdConstant.KEY_CODE;

            /** @final */
            this.dateUtil = $$mdDateUtil;

            /** @final */
            this.dateLocale = $mdDateLocale;

            /** @final {!angular.JQLite} */
            this.$element = $element;

            /** @final {!angular.Scope} */
            this.$scope = $scope;

            /** @final {HTMLElement} */
            this.calendarElement = $element[0].querySelector('.md-calendar');

            /** @final {HTMLElement} */
            this.calendarScroller = $element[0].querySelector('.md-virtual-repeat-scroller');

            /** @final {Date} */
            this.today = this.dateUtil.createDateAtMidnight();

            /** @type {Date} */
            this.firstRenderableDate = this.dateUtil.incrementMonths(this.today, -this.items.length / 2);

            if (this.minDate && this.minDate > this.firstRenderableDate) {
                this.firstRenderableDate = this.minDate;
            } else if (this.maxDate) {
                // Calculate the difference between the start date and max date.
                // Subtract 1 because it's an inclusive difference and 1 for the final dummy month.
                //
                var monthDifference = this.items.length - 2;
                this.firstRenderableDate = this.dateUtil.incrementMonths(this.maxDate, -(this.items.length - 2));
            }


            /** @final {number} Unique ID for this calendar instance. */
            this.id = nextUniqueId++;

            /** @type {!angular.NgModelController} */
            this.ngModelCtrl = null;

            /**
             * The selected date. Keep track of this separately from the ng-model value so that we
             * can know, when the ng-model value changes, what the previous value was before it's updated
             * in the component's UI.
             *
             * @type {Date}
             */
            this.selectedDate = null;

            /**
             * The date that is currently focused or showing in the calendar. This will initially be set
             * to the ng-model value if set, otherwise to today. It will be updated as the user navigates
             * to other months. The cell corresponding to the displayDate does not necesarily always have
             * focus in the document (such as for cases when the user is scrolling the calendar).
             * @type {Date}
             */
            this.displayDate = null;

            /**
             * The date that has or should have focus.
             * @type {Date}
             */
            this.focusDate = null;

            /** @type {boolean} */
            this.isInitialized = false;

            /** @type {boolean} */
            this.isMonthTransitionInProgress = false;

            // Unless the user specifies so, the calendar should not be a tab stop.
            // This is necessary because ngAria might add a tabindex to anything with an ng-model
            // (based on whether or not the user has turned that particular feature on/off).
            if (!$attrs['tabindex']) {
                $element.attr('tabindex', '-1');
            }

            var self = this;

            /**
             * Handles a click event on a date cell.
             * Created here so that every cell can use the same function instance.
             * @this {HTMLTableCellElement} The cell that was clicked.
             */
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

        CalendarCtrl.prototype.getCustomYear = function () {
            return this.dateUtil.incrementMonths(this.firstRenderableDate, this.customIndex).getFullYear() + " 年";
        }
        CalendarCtrl.prototype.lastYear = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.customIndex -= 12;
        }
        CalendarCtrl.prototype.nextYear = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.customIndex += 12;
        }
        /*** Initialization ***/

        /**
         * Sets up the controller's reference to ngModelController.
         * @param {!angular.NgModelController} ngModelCtrl
         */
        CalendarCtrl.prototype.configureNgModel = function (ngModelCtrl) {
            this.ngModelCtrl = ngModelCtrl;

            var self = this;
            ngModelCtrl.$render = function () {
                self.changeSelectedDate(self.ngModelCtrl.$viewValue);
            };
        };

        /**
         * Initialize the calendar by building the months that are initially visible.
         * Initialization should occur after the ngModel value is known.
         */
        CalendarCtrl.prototype.buildInitialCalendarDisplay = function () {
            this.buildWeekHeader();
            this.hideVerticalScrollbar();

            this.displayDate = this.selectedDate || this.today;
            this.isInitialized = true;
        };

        /**
         * Hides the vertical scrollbar on the calendar scroller by setting the width on the
         * calendar scroller and the `overflow: hidden` wrapper around the scroller, and then setting
         * a padding-right on the scroller equal to the width of the browser's scrollbar.
         *
         * This will cause a reflow.
         */
        CalendarCtrl.prototype.hideVerticalScrollbar = function () {
            var element = this.$element[0];

            var scrollMask = element.querySelector('.md-calendar-scroll-mask');
            var scroller = this.calendarScroller;

            var headerWidth = element.querySelector('.md-calendar-day-header').clientWidth;
            var scrollbarWidth = scroller.offsetWidth - scroller.clientWidth;

            scrollMask.style.width = headerWidth + 'px';
            scroller.style.width = (headerWidth + scrollbarWidth) + 'px';
            scroller.style.paddingRight = scrollbarWidth + 'px';
        };


        /** Attach event listeners for the calendar. */
        CalendarCtrl.prototype.attachCalendarEventListeners = function () {
            // Keyboard interaction.
            this.$element.on('keydown', angular.bind(this, this.handleKeyEvent));
        };

        /*** User input handling ***/

        /**
         * Handles a key event in the calendar with the appropriate action. The action will either
         * be to select the focused date or to navigate to focus a new date.
         * @param {KeyboardEvent} event
         */
        CalendarCtrl.prototype.handleKeyEvent = function (event) {
            var self = this;
            this.$scope.$apply(function () {
                // Capture escape and emit back up so that a wrapping component
                // (such as a date-picker) can decide to close.
                if (event.which == self.keyCode.ESCAPE || event.which == self.keyCode.TAB) {
                    self.$scope.$emit('md-calendar-close');

                    if (event.which == self.keyCode.TAB) {
                        event.preventDefault();
                    }

                    return;
                }

                // Remaining key events fall into two categories: selection and navigation.
                // Start by checking if this is a selection event.
                if (event.which === self.keyCode.ENTER) {
                    self.setNgModelValue(self.displayDate);
                    event.preventDefault();
                    return;
                }

                // Selection isn't occuring, so the key event is either navigation or nothing.
                var date = self.getFocusDateFromKeyEvent(event);
                if (date) {
                    date = self.boundDateByMinAndMax(date);
                    event.preventDefault();
                    event.stopPropagation();

                    // Since this is a keyboard interaction, actually give the newly focused date keyboard
                    // focus after the been brought into view.
                    self.changeDisplayDate(date).then(function () {
                        self.focus(date);
                    });
                }
            });
        };

        /**
         * Gets the date to focus as the result of a key event.
         * @param {KeyboardEvent} event
         * @returns {Date} Date to navigate to, or null if the key does not match a calendar shortcut.
         */
        CalendarCtrl.prototype.getFocusDateFromKeyEvent = function (event) {
            var dateUtil = this.dateUtil;
            var keyCode = this.keyCode;

            switch (event.which) {
                case keyCode.RIGHT_ARROW:
                    return dateUtil.incrementDays(this.displayDate, 1);
                case keyCode.LEFT_ARROW:
                    return dateUtil.incrementDays(this.displayDate, -1);
                case keyCode.DOWN_ARROW:
                    return event.metaKey ?
                        dateUtil.incrementMonths(this.displayDate, 1) :
                        dateUtil.incrementDays(this.displayDate, 7);
                case keyCode.UP_ARROW:
                    return event.metaKey ?
                        dateUtil.incrementMonths(this.displayDate, -1) :
                        dateUtil.incrementDays(this.displayDate, -7);
                case keyCode.PAGE_DOWN:
                    return dateUtil.incrementMonths(this.displayDate, 1);
                case keyCode.PAGE_UP:
                    return dateUtil.incrementMonths(this.displayDate, -1);
                case keyCode.HOME:
                    return dateUtil.getFirstDateOfMonth(this.displayDate);
                case keyCode.END:
                    return dateUtil.getLastDateOfMonth(this.displayDate);
                default:
                    return null;
            }
        };

        /**
         * Gets the "index" of the currently selected date as it would be in the virtual-repeat.
         * @returns {number}
         */
        CalendarCtrl.prototype.getSelectedMonthIndex = function () {
            return this.dateUtil.getMonthDistance(this.firstRenderableDate,
                this.selectedDate || this.today);
        };

        /**
         * Scrolls to the month of the given date.
         * @param {Date} date
         */
        CalendarCtrl.prototype.scrollToMonth = function (date) {
            if (!this.dateUtil.isValidDate(date)) {
                return;
            }

            var monthDistance = this.dateUtil.getMonthDistance(this.firstRenderableDate, date);
            this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;
        };

        /**
         * Sets the ng-model value for the calendar and emits a change event.
         * @param {Date} date
         */
        CalendarCtrl.prototype.setNgModelValue = function (date) {
            this.$scope.$emit('md-calendar-change', date);
            this.ngModelCtrl.$setViewValue(date);
            this.ngModelCtrl.$render();
        };

        /**
         * Focus the cell corresponding to the given date.
         * @param {Date=} opt_date
         */
        CalendarCtrl.prototype.focus = function (opt_date) {
            var date = opt_date || this.selectedDate || this.today;

            var previousFocus = this.calendarElement.querySelector('.md-focus');
            if (previousFocus) {
                previousFocus.classList.remove(FOCUSED_DATE_CLASS);
            }

            var cellId = this.getDateId(date);
            var cell = document.getElementById(cellId);
            if (cell) {
                cell.classList.add(FOCUSED_DATE_CLASS);
                cell.focus();
            } else {
                this.focusDate = date;
            }
        };

        /**
         * If a date exceeds minDate or maxDate, returns date matching minDate or maxDate, respectively.
         * Otherwise, returns the date.
         * @param {Date} date
         * @return {Date}
         */
        CalendarCtrl.prototype.boundDateByMinAndMax = function (date) {
            var boundDate = date;
            if (this.minDate && date < this.minDate) {
                boundDate = new Date(this.minDate.getTime());
            }
            if (this.maxDate && date > this.maxDate) {
                boundDate = new Date(this.maxDate.getTime());
            }
            return boundDate;
        };

        /*** Updating the displayed / selected date ***/

        /**
         * Change the selected date in the calendar (ngModel value has already been changed).
         * @param {Date} date
         */
        CalendarCtrl.prototype.changeSelectedDate = function (date) {
            var self = this;
            var previousSelectedDate = this.selectedDate;
            this.selectedDate = date;
            this.changeDisplayDate(date).then(function () {

                // Remove the selected class from the previously selected date, if any.
                if (previousSelectedDate) {
                    var prevDateCell =
                        document.getElementById(self.getDateId(previousSelectedDate));
                    if (prevDateCell) {
                        prevDateCell.classList.remove(SELECTED_DATE_CLASS);
                        prevDateCell.setAttribute('aria-selected', 'false');
                    }
                }

                // Apply the select class to the new selected date if it is set.
                if (date) {
                    var dateCell = document.getElementById(self.getDateId(date));
                    if (dateCell) {
                        dateCell.classList.add(SELECTED_DATE_CLASS);
                        dateCell.setAttribute('aria-selected', 'true');
                    }
                }
            });
        };


        /**
         * Change the date that is being shown in the calendar. If the given date is in a different
         * month, the displayed month will be transitioned.
         * @param {Date} date
         */
        CalendarCtrl.prototype.changeDisplayDate = function (date) {
            // Initialization is deferred until this function is called because we want to reflect
            // the starting value of ngModel.
            if (!this.isInitialized) {
                this.buildInitialCalendarDisplay();
                return this.$q.when();
            }

            // If trying to show an invalid date or a transition is in progress, do nothing.
            if (!this.dateUtil.isValidDate(date) || this.isMonthTransitionInProgress) {
                return this.$q.when();
            }

            this.isMonthTransitionInProgress = true;
            var animationPromise = this.animateDateChange(date);

            this.displayDate = date;

            var self = this;
            animationPromise.then(function () {
                self.isMonthTransitionInProgress = false;
            });

            return animationPromise;
        };

        /**
         * Animates the transition from the calendar's current month to the given month.
         * @param {Date} date
         * @returns {angular.$q.Promise} The animation promise.
         */
        CalendarCtrl.prototype.animateDateChange = function (date) {
            this.scrollToMonth(date);
            return this.$q.when();
        };

        /*** Constructing the calendar table ***/

        /**
         * Builds and appends a day-of-the-week header to the calendar.
         * This should only need to be called once during initialization.
         */
        CalendarCtrl.prototype.buildWeekHeader = function () {
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

        /**
         * Gets an identifier for a date unique to the calendar instance for internal
         * purposes. Not to be displayed.
         * @param {Date} date
         * @returns {string}
         */
        CalendarCtrl.prototype.getDateId = function (date) {
            return [
                'md',
                this.id,
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ].join('-');
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';


        applicationApp.directive('mdCustomCalendarMonth', mdCalendarMonthDirective);


        /**
         * Private directive consumed by md-calendar. Having this directive lets the calender use
         * md-virtual-repeat and also cleanly separates the month DOM construction functions from
         * the rest of the calendar controller logic.
         */
        function mdCalendarMonthDirective() {
            return {
                require: ['^^mdCustomCalendar', 'mdCustomCalendarMonth'],
                scope: {offset: '=mdMonthOffset'},
                controller: CalendarMonthCtrl,
                controllerAs: 'mdMonthCtrl',
                bindToController: true,
                link: function (scope, element, attrs, controllers) {
                    var calendarCtrl = controllers[0];
                    var monthCtrl = controllers[1];

                    monthCtrl.calendarCtrl = calendarCtrl;
                    monthCtrl.generateContent();

                    // The virtual-repeat re-uses the same DOM elements, so there are only a limited number
                    // of repeated items that are linked, and then those elements have their bindings updataed.
                    // Since the months are not generated by bindings, we simply regenerate the entire thing
                    // when the binding (offset) changes.
                    scope.$watch(function () {
                        return monthCtrl.offset;
                    }, function (offset, oldOffset) {
                        if (offset != oldOffset) {
                            monthCtrl.generateContent();
                        }
                    });
                }
            };
        }

        /** Class applied to the cell for today. */
        var TODAY_CLASS = 'md-calendar-date-today';

        /** Class applied to the selected date cell/. */
        var SELECTED_DATE_CLASS = 'md-calendar-selected-date';

        /** Class applied to the focused date cell/. */
        var FOCUSED_DATE_CLASS = 'md-focus';

        /**
         * Controller for a single calendar month.
         * ngInject @constructor
         */
        function CalendarMonthCtrl($element, $$mdDateUtil, $mdDateLocale) {
            this.dateUtil = $$mdDateUtil;
            this.dateLocale = $mdDateLocale;
            this.$element = $element;
            this.calendarCtrl = null;

            /**
             * Number of months from the start of the month "items" that the currently rendered month
             * occurs. Set via angular data binding.
             * @type {number}
             */
            this.offset;

            /**
             * Date cell to focus after appending the month to the document.
             * @type {HTMLElement}
             */
            this.focusAfterAppend = null;
        }

        CalendarMonthCtrl.$inject = ["$element", "$$mdDateUtil", "$mdDateLocale"];

        /** Generate and append the content for this month to the directive element. */
        CalendarMonthCtrl.prototype.generateContent = function () {
            var calendarCtrl = this.calendarCtrl;
            var date = this.dateUtil.incrementMonths(calendarCtrl.firstRenderableDate, this.offset);

            this.$element.empty();
            this.$element.append(this.buildCalendarForMonth(date));

            if (this.focusAfterAppend) {
                this.focusAfterAppend.classList.add(FOCUSED_DATE_CLASS);
                this.focusAfterAppend.focus();
                this.focusAfterAppend = null;
            }
        };

        /**
         * Creates a single cell to contain a date in the calendar with all appropriate
         * attributes and classes added. If a date is given, the cell content will be set
         * based on the date.
         * @param {Date=} opt_date
         * @returns {HTMLElement}
         */
        CalendarMonthCtrl.prototype.buildDateCell = function (opt_date) {
            var calendarCtrl = this.calendarCtrl;

            // TODO(jelbourn): cloneNode is likely a faster way of doing this.
            var cell = document.createElement('td');
            cell.tabIndex = -1;
            cell.classList.add('md-calendar-date');
            cell.setAttribute('role', 'gridcell');

            if (opt_date) {
                cell.setAttribute('tabindex', '-1');
                cell.setAttribute('aria-label', this.dateLocale.longDateFormatter(opt_date));
                cell.id = calendarCtrl.getDateId(opt_date);

                // Use `data-timestamp` attribute because IE10 does not support the `dataset` property.
                cell.setAttribute('data-timestamp', opt_date.getTime());

                // TODO(jelourn): Doing these comparisons for class addition during generation might be slow.
                // It may be better to finish the construction and then query the node and add the class.
                if (this.dateUtil.isSameDay(opt_date, calendarCtrl.today)) {
                    cell.classList.add(TODAY_CLASS);
                }

                if (this.dateUtil.isValidDate(calendarCtrl.selectedDate) &&
                    this.dateUtil.isSameDay(opt_date, calendarCtrl.selectedDate)) {
                    cell.classList.add(SELECTED_DATE_CLASS);
                    cell.setAttribute('aria-selected', 'true');
                }

                var cellText = this.dateLocale.dates[opt_date.getDate()];

                if (this.isDateEnabled(opt_date)) {
                    // Add a indicator for select, hover, and focus states.
                    var selectionIndicator = document.createElement('span');
                    cell.appendChild(selectionIndicator);
                    selectionIndicator.classList.add('md-calendar-date-selection-indicator');
                    selectionIndicator.textContent = cellText;

                    cell.addEventListener('click', calendarCtrl.cellClickHandler);

                    if (calendarCtrl.focusDate && this.dateUtil.isSameDay(opt_date, calendarCtrl.focusDate)) {
                        this.focusAfterAppend = cell;
                    }
                } else {
                    cell.classList.add('md-calendar-date-disabled');
                    cell.textContent = cellText;
                }
            }

            return cell;
        };

        /**
         * Check whether date is in range and enabled
         * @param {Date=} opt_date
         * @return {boolean} Whether the date is enabled.
         */
        CalendarMonthCtrl.prototype.isDateEnabled = function (opt_date) {
            return this.dateUtil.isDateWithinRange(opt_date,
                    this.calendarCtrl.minDate, this.calendarCtrl.maxDate) &&
                (!angular.isFunction(this.calendarCtrl.dateFilter)
                || this.calendarCtrl.dateFilter(opt_date));
        }

        /**
         * Builds a `tr` element for the calendar grid.
         * @param rowNumber The week number within the month.
         * @returns {HTMLElement}
         */
        CalendarMonthCtrl.prototype.buildDateRow = function (rowNumber) {
            var row = document.createElement('tr');
            row.setAttribute('role', 'row');

            // Because of an NVDA bug (with Firefox), the row needs an aria-label in order
            // to prevent the entire row being read aloud when the user moves between rows.
            // See http://community.nvda-project.org/ticket/4643.
            row.setAttribute('aria-label', this.dateLocale.weekNumberFormatter(rowNumber));

            return row;
        };

        /**
         * Builds the <tbody> content for the given date's month.
         * @param {Date=} opt_dateInMonth
         * @returns {DocumentFragment} A document fragment containing the <tr> elements.
         */
        CalendarMonthCtrl.prototype.buildCalendarForMonth = function (opt_dateInMonth) {
            var date = this.dateUtil.isValidDate(opt_dateInMonth) ? opt_dateInMonth : new Date();

            var firstDayOfMonth = this.dateUtil.getFirstDateOfMonth(date);
            var firstDayOfTheWeek = this.getLocaleDay_(firstDayOfMonth);
            var numberOfDaysInMonth = this.dateUtil.getNumberOfDaysInMonth(date);

            // Store rows for the month in a document fragment so that we can append them all at once.
            var monthBody = document.createDocumentFragment();

            var rowNumber = 1;
            var row = this.buildDateRow(rowNumber);
            monthBody.appendChild(row);

            // If this is the final month in the list of items, only the first week should render,
            // so we should return immediately after the first row is complete and has been
            // attached to the body.
            var isFinalMonth = this.offset === this.calendarCtrl.items.length - 1;

            // Add a label for the month. If the month starts on a Sun/Mon/Tues, the month label
            // goes on a row above the first of the month. Otherwise, the month label takes up the first
            // two cells of the first row.
            var blankCellOffset = 0;
            var monthLabelCell = document.createElement('td');
            monthLabelCell.classList.add('md-calendar-month-label');
            // If the entire month is after the max date, render the label as a disabled state.
            if (this.calendarCtrl.maxDate && firstDayOfMonth > this.calendarCtrl.maxDate) {
                monthLabelCell.classList.add('md-calendar-month-label-disabled');
            }
            monthLabelCell.textContent = this.dateLocale.monthHeaderFormatter(date);
            if (firstDayOfTheWeek <= 2) {
                monthLabelCell.setAttribute('colspan', '7');

                var monthLabelRow = this.buildDateRow();
                monthLabelRow.appendChild(monthLabelCell);
                monthBody.insertBefore(monthLabelRow, row);

                if (isFinalMonth) {
                    return monthBody;
                }
            } else {
                blankCellOffset = 2;
                monthLabelCell.setAttribute('colspan', '2');
                row.appendChild(monthLabelCell);
            }

            // Add a blank cell for each day of the week that occurs before the first of the month.
            // For example, if the first day of the month is a Tuesday, add blank cells for Sun and Mon.
            // The blankCellOffset is needed in cases where the first N cells are used by the month label.
            for (var i = blankCellOffset; i < firstDayOfTheWeek; i++) {
                row.appendChild(this.buildDateCell());
            }

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
            }

            return monthBody;
        };

        /**
         * Gets the day-of-the-week index for a date for the current locale.
         * @private
         * @param {Date} date
         * @returns {number} The column index of the date in the calendar.
         */
        CalendarMonthCtrl.prototype.getLocaleDay_ = function (date) {
            return (date.getDay() + (7 - this.dateLocale.firstDayOfWeek)) % 7
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        /**
         * @ngdoc service
         * @name $mdDateLocaleProvider
         * @module material.components.datepicker
         *
         * @description
         * The `$mdDateLocaleProvider` is the provider that creates the `$mdDateLocale` service.
         * This provider that allows the user to specify messages, formatters, and parsers for date
         * internationalization. The `$mdDateLocale` service itself is consumed by Angular Material
         * components that deal with dates.
         *
         * @property {(Array<string>)=} months Array of month names (in order).
         * @property {(Array<string>)=} shortMonths Array of abbreviated month names.
         * @property {(Array<string>)=} days Array of the days of the week (in order).
         * @property {(Array<string>)=} shortDays Array of abbreviated dayes of the week.
         * @property {(Array<string>)=} dates Array of dates of the month. Only necessary for locales
         *     using a numeral system other than [1, 2, 3...].
         * @property {(Array<string>)=} firstDayOfWeek The first day of the week. Sunday = 0, Monday = 1,
         *    etc.
         * @property {(function(string): Date)=} parseDate Function to parse a date object from a string.
         * @property {(function(Date): string)=} formatDate Function to format a date object to a string.
         * @property {(function(Date): string)=} monthHeaderFormatter Function that returns the label for
         *     a month given a date.
         * @property {(function(number): string)=} weekNumberFormatter Function that returns a label for
         *     a week given the week number.
         * @property {(string)=} msgCalendar Translation of the label "Calendar" for the current locale.
         * @property {(string)=} msgOpenCalendar Translation of the button label "Open calendar" for the
         *     current locale.
         *
         * @usage
         * <hljs lang="js">
         *   myAppModule.config(function($mdDateLocaleProvider) {
   *
   *     // Example of a French localization.
   *     $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', ...];
   *     $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', ...];
   *     $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', ...];
   *     $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', ...];
   *
   *     // Can change week display to start on Monday.
   *     $mdDateLocaleProvider.firstDayOfWeek = 1;
   *
   *     // Optional.
   *     $mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];
   *
   *     // Example uses moment.js to parse and format dates.
   *     $mdDateLocaleProvider.parseDate = function(dateString) {
   *       var m = moment(dateString, 'L', true);
   *       return m.isValid() ? m.toDate() : new Date(NaN);
   *     };
   *
   *     $mdDateLocaleProvider.formatDate = function(date) {
   *       return moment(date).format('L');
   *     };
   *
   *     $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
   *       return myShortMonths[date.getMonth()] + ' ' + date.getFullYear();
   *     };
   *
   *     // In addition to date display, date components also need localized messages
   *     // for aria-labels for screen-reader users.
   *
   *     $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
   *       return 'Semaine ' + weekNumber;
   *     };
   *
   *     $mdDateLocaleProvider.msgCalendar = 'Calendrier';
   *     $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
   *
   * });
         * </hljs>
         *
         */

        applicationApp.config(["$provide", function ($provide) {
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

                    // All of the dates created through ng-material *should* be set to midnight.
                    // If we encounter a date where the localeTime shows at 11pm instead of midnight,
                    // we have run into an issue with DST where we need to increment the hour by one:
                    // var d = new Date(1992, 9, 8, 0, 0, 0);
                    // d.toLocaleString(); // == "10/7/1992, 11:00:00 PM"
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

                    // All of the dates created through ng-material *should* be set to midnight.
                    // If we encounter a date where the localeTime shows at 11pm instead of midnight,
                    // we have run into an issue with DST where we need to increment the hour by one:
                    // var d = new Date(1992, 9, 8, 0, 0, 0);
                    // d.toLocaleString(); // == "10/7/1992, 11:00:00 PM"
                    return date.toLocaleTimeString();
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
                    return service.shortMonths[date.getMonth()]/* + ' ' + date.getFullYear()*/;
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
                    msgOpenCalendar: this.msgOpenCalendar || defaultMsgOpenCalendar
                };

                return service;
            };
            DateLocaleProvider.prototype.$get.$inject = ["$locale"];

            $provide.provider('$mdDateLocale', new DateLocaleProvider());
        }]);
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        // POST RELEASE
        // TODO(jelbourn): Demo that uses moment.js
        // TODO(jelbourn): make sure this plays well with validation and ngMessages.
        // TODO(jelbourn): calendar pane doesn't open up outside of visible viewport.
        // TODO(jelbourn): forward more attributes to the internal input (required, autofocus, etc.)
        // TODO(jelbourn): something better for mobile (calendar panel takes up entire screen?)
        // TODO(jelbourn): input behavior (masking? auto-complete?)
        // TODO(jelbourn): UTC mode
        // TODO(jelbourn): RTL


        applicationApp.directive('mdCustomDatepicker', datePickerDirective);

        /**
         * @ngdoc directive
         * @name mdDatepicker
         * @module material.components.datepicker
         *
         * @param {Date} ng-model The component's model. Expects a JavaScript Date object.
         * @param {expression=} ng-change Expression evaluated when the model value changes.
         * @param {Date=} md-min-date Expression representing a min date (inclusive).
         * @param {Date=} md-max-date Expression representing a max date (inclusive).
         * @param {(function(Date): boolean)=} md-date-filter Function expecting a date and returning a boolean whether it can be selected or not.
         * @param {String=} md-placeholder The date input placeholder value.
         * @param {boolean=} ng-disabled Whether the datepicker is disabled.
         * @param {boolean=} ng-required Whether a value is required for the datepicker.
         *
         * @description
         * `<md-datepicker>` is a component used to select a single date.
         * For information on how to configure internationalization for the date picker,
         * see `$mdDateLocaleProvider`.
         *
         * This component supports [ngMessages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages).
         * Supported attributes are:
         * * `required`: whether a required date is not set.
         * * `mindate`: whether the selected date is before the minimum allowed date.
         * * `maxdate`: whether the selected date is after the maximum allowed date.
         *
         * @usage
         * <hljs lang="html">
         *   <md-datepicker ng-model="birthday"></md-datepicker>
         * </hljs>
         *
         */
        function datePickerDirective() {
            return {
                template: // Buttons are not in the tab order because users can open the calendar via keyboard
                // interaction on the text input, and multiple tab stops for one component (picker)
                // may be confusing.
                '<md-button class="md-datepicker-button md-icon-button" type="button" ' +
                'tabindex="-1" aria-hidden="true" ' +
                'ng-click="ctrl.openCalendarPane($event)">' +
                '<md-icon class="md-datepicker-calendar-icon md-primary" md-svg-icon="md-calendar"></md-icon>' +
                '</md-button>' +
                '<div class="md-datepicker-input-container" ' +
                'ng-class="{\'md-datepicker-focused\': ctrl.isFocused}">' +
                '<input class="md-datepicker-input" aria-haspopup="true" ' +
                'ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)">' +
                    /*'<md-button type="button" md-no-ink ' +
                     'class="md-datepicker-triangle-button md-icon-button" ' +
                     'ng-click="ctrl.openCalendarPane($event)" ' +
                     'aria-label="{{::ctrl.dateLocale.msgOpenCalendar}}">' +
                     '<div class="md-datepicker-expand-triangle"></div>' +
                     '</md-button>' +*/
                '</div>' +

                    // This pane will be detached from here and re-attached to the document body.
                '<div class="md-datepicker-calendar-pane md-whiteframe-z1">' +
                '<div class="md-datepicker-input-mask">' +
                '<div class="md-datepicker-input-mask-opaque"></div>' +
                '</div>' +
                '<div class="md-datepicker-calendar">' +
                '<md-custom-calendar role="dialog" aria-label="{{::ctrl.dateLocale.msgCalendar}}" ' +
                'md-min-date="ctrl.minDate" md-max-date="ctrl.maxDate"' +
                'md-date-filter="ctrl.dateFilter"' +
                'ng-model="ctrl.date" ng-if="ctrl.isCalendarOpen">' +
                '</md-custom-calendar>' +
                '</div>' +
                '</div>',
                require: ['ngModel', 'mdCustomDatepicker', '?^mdInputContainer'],
                scope: {
                    minDate: '=mdMinDate',
                    maxDate: '=mdMaxDate',
                    placeholder: '@mdPlaceholder',
                    dateFilter: '=mdDateFilter'
                },
                controller: DatePickerCtrl,
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attr, controllers) {
                    var ngModelCtrl = controllers[0];
                    var mdDatePickerCtrl = controllers[1];

                    var mdInputContainer = controllers[2];
                    if (mdInputContainer) {
                        throw Error('md-datepicker should not be placed inside md-input-container.');
                    }

                    mdDatePickerCtrl.configureNgModel(ngModelCtrl);
                }
            };
        }

        /** Additional offset for the input's `size` attribute, which is updated based on its content. */
        var EXTRA_INPUT_SIZE = 3;

        /** Class applied to the container if the date is invalid. */
        var INVALID_CLASS = 'md-datepicker-invalid';

        /** Default time in ms to debounce input event by. */
        var DEFAULT_DEBOUNCE_INTERVAL = 500;

        /**
         * Height of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-height is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_HEIGHT = 368;

        /**
         * Width of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-width is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_WIDTH = 360;

        /**
         * Controller for md-datepicker.
         *
         * ngInject @constructor
         */
        function DatePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window,
                                $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
            /** @final */
            this.$compile = $compile;

            /** @final */
            this.$timeout = $timeout;

            /** @final */
            this.$window = $window;

            /** @final */
            this.dateLocale = $mdDateLocale;

            /** @final */
            this.dateUtil = $$mdDateUtil;

            /** @final */
            this.$mdConstant = $mdConstant;

            /* @final */
            this.$mdUtil = $mdUtil;

            /** @final */
            this.$$rAF = $$rAF;

            /**
             * The root document element. This is used for attaching a top-level click handler to
             * close the calendar panel when a click outside said panel occurs. We use `documentElement`
             * instead of body because, when scrolling is disabled, some browsers consider the body element
             * to be completely off the screen and propagate events directly to the html element.
             * @type {!angular.JQLite}
             */
            this.documentElement = angular.element(document.documentElement);

            /** @type {!angular.NgModelController} */
            this.ngModelCtrl = null;

            /** @type {HTMLInputElement} */
            this.inputElement = $element[0].querySelector('input');

            /** @final {!angular.JQLite} */
            this.ngInputElement = angular.element(this.inputElement);

            /** @type {HTMLElement} */
            this.inputContainer = $element[0].querySelector('.md-datepicker-input-container');

            /** @type {HTMLElement} Floating calendar pane. */
            this.calendarPane = $element[0].querySelector('.md-datepicker-calendar-pane');

            /** @type {HTMLElement} Calendar icon button. */
            this.calendarButton = $element[0].querySelector('.md-datepicker-button');

            /**
             * Element covering everything but the input in the top of the floating calendar pane.
             * @type {HTMLElement}
             */
            this.inputMask = $element[0].querySelector('.md-datepicker-input-mask-opaque');

            /** @final {!angular.JQLite} */
            this.$element = $element;

            /** @final {!angular.Attributes} */
            this.$attrs = $attrs;

            /** @final {!angular.Scope} */
            this.$scope = $scope;

            /** @type {Date} */
            this.date = null;

            /** @type {boolean} */
            this.isFocused = false;

            /** @type {boolean} */
            this.isDisabled;
            this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));

            /** @type {boolean} Whether the date-picker's calendar pane is open. */
            this.isCalendarOpen = false;

            /**
             * Element from which the calendar pane was opened. Keep track of this so that we can return
             * focus to it when the pane is closed.
             * @type {HTMLElement}
             */
            this.calendarPaneOpenedFrom = null;

            this.calendarPane.id = 'md-date-pane' + $mdUtil.nextUid();

            $mdTheming($element);

            /** Pre-bound click handler is saved so that the event listener can be removed. */
            this.bodyClickHandler = angular.bind(this, this.handleBodyClick);

            /** Pre-bound resize handler so that the event listener can be removed. */
            this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeCalendarPane), 100);

            // Unless the user specifies so, the datepicker should not be a tab stop.
            // This is necessary because ngAria might add a tabindex to anything with an ng-model
            // (based on whether or not the user has turned that particular feature on/off).
            if (!$attrs['tabindex']) {
                $element.attr('tabindex', '-1');
            }

            this.installPropertyInterceptors();
            this.attachChangeListeners();
            this.attachInteractionListeners();

            var self = this;
            $scope.$on('$destroy', function () {
                self.detachCalendarPane();
            });
        }

        DatePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];

        /**
         * Sets up the controller's reference to ngModelController.
         * @param {!angular.NgModelController} ngModelCtrl
         */
        DatePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
            this.ngModelCtrl = ngModelCtrl;

            var self = this;
            ngModelCtrl.$render = function () {
                var value = self.ngModelCtrl.$viewValue;

                if (value && !(value instanceof Date)) {
                    throw Error('The ng-model for md-datepicker must be a Date instance. ' +
                    'Currently the model is a: ' + (typeof value));
                }

                self.date = value;
                self.inputElement.value = self.dateLocale.formatDate(value);
                self.resizeInputElement();
                self.updateErrorState();
            };
        };

        /**
         * Attach event listeners for both the text input and the md-calendar.
         * Events are used instead of ng-model so that updates don't infinitely update the other
         * on a change. This should also be more performant than using a $watch.
         */
        DatePickerCtrl.prototype.attachChangeListeners = function () {
            var self = this;

            self.$scope.$on('md-calendar-change', function (event, date) {
                self.ngModelCtrl.$setViewValue(date);
                self.date = date;
                self.inputElement.value = self.dateLocale.formatDate(date);
                self.closeCalendarPane();
                self.resizeInputElement();
                self.updateErrorState();
            });

            self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
            // TODO(chenmike): Add ability for users to specify this interval.
            self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
                DEFAULT_DEBOUNCE_INTERVAL, self));
        };

        /** Attach event listeners for user interaction. */
        DatePickerCtrl.prototype.attachInteractionListeners = function () {
            var self = this;
            var $scope = this.$scope;
            var keyCodes = this.$mdConstant.KEY_CODE;

            // Add event listener through angular so that we can triggerHandler in unit tests.
            self.ngInputElement.on('keydown', function (event) {
                if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                    self.openCalendarPane(event);
                    $scope.$digest();
                }
            });

            $scope.$on('md-calendar-close', function () {
                self.closeCalendarPane();
            });
        };

        /**
         * Capture properties set to the date-picker and imperitively handle internal changes.
         * This is done to avoid setting up additional $watches.
         */
        DatePickerCtrl.prototype.installPropertyInterceptors = function () {
            var self = this;

            if (this.$attrs['ngDisabled']) {
                // The expression is to be evaluated against the directive element's scope and not
                // the directive's isolate scope.
                var scope = this.$scope.$parent;

                if (scope) {
                    scope.$watch(this.$attrs['ngDisabled'], function (isDisabled) {
                        self.setDisabled(isDisabled);
                    });
                }
            }

            Object.defineProperty(this, 'placeholder', {
                get: function () {
                    return self.inputElement.placeholder;
                },
                set: function (value) {
                    self.inputElement.placeholder = value || '';
                }
            });
        };

        /**
         * Sets whether the date-picker is disabled.
         * @param {boolean} isDisabled
         */
        DatePickerCtrl.prototype.setDisabled = function (isDisabled) {
            this.isDisabled = isDisabled;
            this.inputElement.disabled = isDisabled;
            this.calendarButton.disabled = isDisabled;
        };

        /**
         * Sets the custom ngModel.$error flags to be consumed by ngMessages. Flags are:
         *   - mindate: whether the selected date is before the minimum date.
         *   - maxdate: whether the selected flag is after the maximum date.
         *   - filtered: whether the selected date is allowed by the custom filtering function.
         *   - valid: whether the entered text input is a valid date
         *
         * The 'required' flag is handled automatically by ngModel.
         *
         * @param {Date=} opt_date Date to check. If not given, defaults to the datepicker's model value.
         */
        DatePickerCtrl.prototype.updateErrorState = function (opt_date) {
            var date = opt_date || this.date;

            // Clear any existing errors to get rid of anything that's no longer relevant.
            this.clearErrorState();

            if (this.dateUtil.isValidDate(date)) {
                // Force all dates to midnight in order to ignore the time portion.
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

        /** Clears any error flags set by `updateErrorState`. */
        DatePickerCtrl.prototype.clearErrorState = function () {
            this.inputContainer.classList.remove(INVALID_CLASS);
            ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function (field) {
                this.ngModelCtrl.$setValidity(field, true);
            }, this);
        };

        /** Resizes the input element based on the size of its content. */
        DatePickerCtrl.prototype.resizeInputElement = function () {
            this.inputElement.size = this.inputElement.value.length + EXTRA_INPUT_SIZE;
        };

        /**
         * Sets the model value if the user input is a valid date.
         * Adds an invalid class to the input element if not.
         */
        DatePickerCtrl.prototype.handleInputEvent = function () {
            var inputString = this.inputElement.value;
            var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
            this.dateUtil.setDateTimeToMidnight(parsedDate);

            // An input string is valid if it is either empty (representing no date)
            // or if it parses to a valid date that the user is allowed to select.
            var isValidInput = inputString == '' || (
                this.dateUtil.isValidDate(parsedDate) &&
                this.dateLocale.isDateComplete(inputString) &&
                this.isDateEnabled(parsedDate)
                );

            // The datepicker's model is only updated when there is a valid input.
            if (isValidInput) {
                this.ngModelCtrl.$setViewValue(parsedDate);
                this.date = parsedDate;
            }

            this.updateErrorState(parsedDate);
        };

        /**
         * Check whether date is in range and enabled
         * @param {Date=} opt_date
         * @return {boolean} Whether the date is enabled.
         */
        DatePickerCtrl.prototype.isDateEnabled = function (opt_date) {
            return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
                (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
        };

        /** Position and attach the floating calendar to the document. */
        DatePickerCtrl.prototype.attachCalendarPane = function () {
            var calendarPane = this.calendarPane;
            calendarPane.style.transform = '';
            this.$element.addClass('md-datepicker-open');

            var elementRect = this.inputContainer.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();

            // Check to see if the calendar pane would go off the screen. If so, adjust position
            // accordingly to keep it within the viewport.
            var paneTop = elementRect.top - bodyRect.top + 40;
            var paneLeft = elementRect.left - bodyRect.left - 40;

            // If ng-material has disabled body scrolling (for example, if a dialog is open),
            // then it's possible that the already-scrolled body has a negative top/left. In this case,
            // we want to treat the "real" top as (0 - bodyRect.top). In a normal scrolling situation,
            // though, the top of the viewport should just be the body's scroll position.
            var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
                -bodyRect.top :
                document.body.scrollTop;

            var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
                -bodyRect.left :
                document.body.scrollLeft;

            var viewportBottom = viewportTop + this.$window.innerHeight;
            var viewportRight = viewportLeft + this.$window.innerWidth;

            // If the right edge of the pane would be off the screen and shifting it left by the
            // difference would not go past the left edge of the screen. If the calendar pane is too
            // big to fit on the screen at all, move it to the left of the screen and scale the entire
            // element down to fit.
            if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
                if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                    paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
                } else {
                    paneLeft = viewportLeft;
                    var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                    calendarPane.style.transform = 'scale(' + scale + ')';
                }

                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            // If the bottom edge of the pane would be off the screen and shifting it up by the
            // difference would not go past the top edge of the screen.
            if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
                viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
                paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            calendarPane.style.left = paneLeft + 'px';
            calendarPane.style.top = paneTop + 'px';
            document.body.appendChild(calendarPane);

            // The top of the calendar pane is a transparent box that shows the text input underneath.
            // Since the pane is floating, though, the page underneath the pane *adjacent* to the input is
            // also shown unless we cover it up. The inputMask does this by filling up the remaining space
            // based on the width of the input.
            this.inputMask.style.left = elementRect.width + 'px';

            // Add CSS class after one frame to trigger open animation.
            this.$$rAF(function () {
                calendarPane.classList.add('md-pane-open');
            });
        };

        /** Detach the floating calendar pane from the document. */
        DatePickerCtrl.prototype.detachCalendarPane = function () {
            this.$element.removeClass('md-datepicker-open');
            this.calendarPane.classList.remove('md-pane-open');
            this.calendarPane.classList.remove('md-datepicker-pos-adjusted');

            if (this.isCalendarOpen) {
                this.$mdUtil.enableScrolling();
            }

            if (this.calendarPane.parentNode) {
                // Use native DOM removal because we do not want any of the angular state of this element
                // to be disposed.
                this.calendarPane.parentNode.removeChild(this.calendarPane);
            }
        };

        /**
         * Open the floating calendar pane.
         * @param {Event} event
         */
        DatePickerCtrl.prototype.openCalendarPane = function (event) {
            if (!this.isCalendarOpen && !this.isDisabled) {
                this.isCalendarOpen = true;
                this.calendarPaneOpenedFrom = event.target;

                // Because the calendar pane is attached directly to the body, it is possible that the
                // rest of the component (input, etc) is in a different scrolling container, such as
                // an md-content. This means that, if the container is scrolled, the pane would remain
                // stationary. To remedy this, we disable scrolling while the calendar pane is open, which
                // also matches the native behavior for things like `<select>` on Mac and Windows.
                this.$mdUtil.disableScrollAround(this.calendarPane);

                this.attachCalendarPane();
                this.focusCalendar();

                // Attach click listener inside of a timeout because, if this open call was triggered by a
                // click, we don't want it to be immediately propogated up to the body and handled.
                var self = this;
                this.$mdUtil.nextTick(function () {
                    // Use 'touchstart` in addition to click in order to work on iOS Safari, where click
                    // events aren't propogated under most circumstances.
                    // See http://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
                    self.documentElement.on('click touchstart', self.bodyClickHandler);
                }, false);

                window.addEventListener('resize', this.windowResizeHandler);
            }
        };

        /** Close the floating calendar pane. */
        DatePickerCtrl.prototype.closeCalendarPane = function () {
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

        /** Gets the controller instance for the calendar in the floating pane. */
        DatePickerCtrl.prototype.getCalendarCtrl = function () {
            return angular.element(this.calendarPane.querySelector('md-custom-calendar')).controller('mdCustomCalendar');
        };

        /** Focus the calendar in the floating pane. */
        DatePickerCtrl.prototype.focusCalendar = function () {
            // Use a timeout in order to allow the calendar to be rendered, as it is gated behind an ng-if.
            var self = this;
            this.$mdUtil.nextTick(function () {
                self.getCalendarCtrl().focus();
            }, false);
        };

        /**
         * Sets whether the input is currently focused.
         * @param {boolean} isFocused
         */
        DatePickerCtrl.prototype.setFocused = function (isFocused) {
            if (!isFocused) {
                this.ngModelCtrl.$setTouched();
            }
            this.isFocused = isFocused;
        };

        /**
         * Handles a click on the document body when the floating calendar pane is open.
         * Closes the floating calendar pane if the click is not inside of it.
         * @param {MouseEvent} event
         */
        DatePickerCtrl.prototype.handleBodyClick = function (event) {
            if (this.isCalendarOpen) {
                // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
                var isInCalendar = this.$mdUtil.getClosest(event.target, 'md-custom-calendar');
                if (!isInCalendar) {
                    this.closeCalendarPane();
                }

                this.$scope.$digest();
            }
        };
    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        /**
         * Utility for performing date calculations to facilitate operation of the calendar and
         * datepicker.
         */
        applicationApp.factory('$$mdDateUtil', function () {
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
                isDateWithinRange: isDateWithinRange
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
        });
    })(applicationApp);

    // TODO timer picker, customized
    (function(applicationApp){
        "use strict";
// shim layer with setTimeout fallback
// credit Erik Möller and http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        (function() {
            var lastTime = 0;
            var vendors = ['webkit', 'moz'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame){
                window.requestAnimationFrame = function(callback) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                        timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame){
                window.cancelAnimationFrame = function(id) {
                    window.clearTimeout(id);
                };
            }
        }());

        applicationApp.constant('roundProgressConfig', {
            max:            50,
            semi:           false,
            rounded:        false,
            responsive:     false,
            clockwise:      true,
            radius:         50,
            color:          '#45ccce',
            bgcolor:        '#eaeaea',
            stroke:         15,
            duration:       800,
            animation:      'easeOutCubic',
            animationDelay: 0,
            offset:         0
        });

        applicationApp.service('roundProgressService', ['$window', function($window){
            var service = {};
            var isNumber = angular.isNumber;
            var base = document.head.querySelector('base');

            // credits to http://modernizr.com/ for the feature test
            service.isSupported = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect);

            // fixes issues if the document has a <base> element
            service.resolveColor = base && base.href ? function(value){
                var hashIndex = value.indexOf('#');

                if(hashIndex > -1 && value.indexOf('url') > -1){
                    return value.slice(0, hashIndex) + window.location.href + value.slice(hashIndex);
                }

                return value;
            } : function(value){
                return value;
            };

            // deals with floats passed as strings
            service.toNumber = function(value){
                return isNumber(value) ? value : parseFloat((value + '').replace(',', '.'));
            };

            service.getOffset = function(scope, options){
                var value = +options.offset || 0;

                if(options.offset === 'inherit'){
                    var parent = scope.$parent;

                    while(parent){
                        if(parent.hasOwnProperty('$$getRoundProgressOptions')){
                            var opts = parent.$$getRoundProgressOptions();
                            value += ((+opts.offset || 0) + (+opts.stroke || 0));
                        }

                        parent = parent.$parent;
                    }
                }

                return value;
            };

            service.getTimestamp = ($window.performance && $window.performance.now && angular.isNumber($window.performance.now())) ? function(){
                return $window.performance.now();
            } : function(){
                return new $window.Date().getTime();
            };

            // credit to http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
            service.updateState = function(current, total, pathRadius, element, elementRadius, isSemicircle, ear, inner) {
                if(!elementRadius) return element;

                var value       = current > 0 ? Math.min(current, total) : 0;
                var type        = isSemicircle ? 180 : 359.9999;
                var perc        = total === 0 ? 0 : (value / total) * type;
                var start       = polarToCartesian(elementRadius, elementRadius, pathRadius, perc);
                var end         = polarToCartesian(elementRadius, elementRadius, pathRadius, 0);
                var arcSweep    = (perc <= 180 ? 0 : 1);
                var d           = 'M ' + start + ' A ' + pathRadius + ' ' + pathRadius + ' 0 ' + arcSweep + ' 0 ' + end;

                ear.attr({
                    cx: start.split(" ")[0],
                    cy: start.split(" ")[1]
                });
                /*element.attr({
                 fill: "#CAECE6",
                 });*/
                return element.attr('d', d);
            };

            // Easing functions by Robert Penner
            // Source: http://www.robertpenner.com/easing/
            // License: http://www.robertpenner.com/easing_terms_of_use.html

            service.animations = {

                // t: is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time.
                // b: is the beginning value of the property.
                // c: is the change between the beginning and destination value of the property.
                // d: is the total time of the tween.
                // jshint eqeqeq: false, -W041: true

                linearEase: function(t, b, c, d) {
                    return c * t / d + b;
                },

                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },

                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },

                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },

                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },

                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },

                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },

                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },

                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },

                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },

                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },

                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },

                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },

                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },

                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },

                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },

                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },

                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },

                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },

                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },

                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },

                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },

                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
                    if (a < Math.abs(c)) { a=c; s=p/4; }
                    else s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },

                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
                    if (a < Math.abs(c)) { a=c; s=p/4; }
                    else s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },

                easeInOutElastic: function (t, b, c, d) {
                    // jshint eqeqeq: false, -W041: true
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
                    if (a < Math.abs(c)) { a=c; s=p/4; }
                    else s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
                },

                easeInBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },

                easeOutBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },

                easeInOutBack: function (t, b, c, d, s) {
                    // jshint eqeqeq: false, -W041: true
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },

                easeInBounce: function (t, b, c, d) {
                    return c - service.animations.easeOutBounce (d-t, 0, c, d) + b;
                },

                easeOutBounce: function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
                    }
                },

                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return service.animations.easeInBounce (t*2, 0, c, d) * 0.5 + b;
                    return service.animations.easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
                }
            };

            // utility function
            function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                var x = centerX + (radius * Math.cos(angleInRadians));
                var y = centerY + (radius * Math.sin(angleInRadians));

                return x + ' ' + y;
            }

            return service;
        }]);

        applicationApp.directive('roundProgress', ['$window', 'roundProgressService', 'roundProgressConfig', '$mdGesture','$timeout',function($window, service, roundProgressConfig,$mdGesture,$timeout){
            var base = {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    current:        '=',
                    max:            '=',
                    semi:           '=',
                    rounded:        '=',
                    clockwise:      '=',
                    responsive:     '=',
                    onRender:       '=',
                    radius:         '@',
                    color:          '@',
                    bgcolor:        '@',
                    stroke:         '@',
                    duration:       '@',
                    animation:      '@',
                    offset:         '@',
                    animationDelay: '@'
                }
            };

            if(!service.isSupported){
                return angular.extend(base, {
                    // placeholder element to keep the structure
                    template: '<div class="round-progress" ng-transclude></div>'
                });
            }

            return angular.extend(base, {
                link: function(scope, element, attrs){
                    var isNested    = !element.hasClass('round-progress-wrapper');
                    var svg         = isNested ? element : element.find('svg').eq(0);
                    var ring        = svg.find('path').eq(0);
                    var rEar         = svg.find('.right-ear').eq(0);
                    var lEar         = svg.find('.left-ear').eq(0);
                    var background  = svg.find('circle.bg').eq(0);
                    //var outerBackground  = svg.find('circle.outer-ring').eq(0);
                    var innerBackground  = svg.find('circle.inner-ring').eq(0);
                    var options     = angular.copy(roundProgressConfig);
                    var lastAnimationId = 0;
                    var lastTimeoutId;
                    var parentChangedListener;
                    scope.$$getRoundProgressOptions = function(){
                        return options;
                    };
                    $mdGesture.register(rEar, 'drag',{
                        minDistance: 1,
                        horizontal: true,
                        cancelMultiplier: 1.5
                    });
                    var renderCircle = function(){
                        var isSemicircle     = options.semi;
                        var responsive       = options.responsive;
                        var radius           = +options.radius || 0;
                        var stroke           = +options.stroke;
                        var diameter         = radius*2;
                        var backgroundSize   = radius - (stroke/2) - service.getOffset(scope, options);

                        svg.css({
                            top:          0,
                            left:         0,
                            position:     responsive ? 'absolute' : 'static',
                            width:        responsive ? '100%' : (diameter + 'px'),
                            height:       responsive ? '100%' : (isSemicircle ? radius : diameter) + 'px',
                            overflow:     isSemicircle?'hidden':'visible' // on some browsers the background overflows, if in semicircle mode
                        });

                        // when nested, the element shouldn't define its own viewBox
                        if(!isNested){
                            // note that we can't use .attr, because if jQuery is loaded,
                            // it lowercases all attributes and viewBox is case-sensitive
                            svg[0].setAttribute('viewBox', '0 0 ' + diameter + ' ' + (isSemicircle ? radius : diameter));
                        }

                        element.css({
                            width:           responsive ? '100%' : 'auto',
                            position:        'relative',
                            paddingBottom:   responsive ? (isSemicircle ? '50%' : '100%') : 0
                        });

                        ring.css({
                            stroke:          service.resolveColor(options.color),
                            strokeWidth:     stroke/2,
                            strokeLinecap:   options.rounded ? 'round': 'butt'
                        });

                        if(isSemicircle){
                            ring.attr('transform', options.clockwise ? 'translate(0, ' + diameter + ') rotate(-90)' : 'translate(' + diameter + ', '+ diameter +') rotate(90) scale(-1, 1)');
                        }else{
                            ring.attr('transform', options.clockwise ? '' : 'scale(-1, 1) translate(' + (-diameter) + ' 0)');
                        }

                        background.attr({
                            cx:           radius,
                            cy:           radius,
                            r:            radius- (stroke/6)
                        }).css({
                            //stroke:       service.resolveColor(options.bgcolor),
                            stroke:       service.resolveColor(options.bgcolor),
                            strokeWidth:  stroke/3
                        });
                        /* outerBackground.attr({
                         cx:           radius,
                         cy:           radius,
                         r:            backgroundSize >= 0 ? (backgroundSize+ stroke/2): stroke/2
                         }).css({
                         stroke:       service.resolveColor(options.bgcolor),
                         strokeWidth:  stroke/2
                         });*/
                        innerBackground.attr({
                            cx:           radius,
                            cy:           radius,
                            r:            radius- (stroke*5/6)
                        }).css({
                            /*fill:         "#fff",*/
                            stroke:       service.resolveColor(options.bgcolor),
                            strokeWidth:  stroke/3
                        });

                        rEar.attr({
                            cx:           radius,
                            cy:           stroke/2,
                            r:            stroke/3
                        }).css({
                            fill:       service.resolveColor(options.color),
                            stroke:     "#fff",
                            strokeWidth:  stroke/6
                        });
                        lEar.attr({
                            cx:           radius,
                            cy:           stroke/2,
                            r:            stroke/3
                        }).css({
                            fill:       service.resolveColor(options.color),
                            stroke:     "#fff",
                            strokeWidth:  stroke/6
                        });
                        /*var rect = rEar[0].getBoundingClientRect();
                         scope.centerX = rect.left + (rect.width/2);
                         scope.centerY = rect.top + radius;
                         console.log(rect);console.log(scope.centerX);console.log(scope.centerY);*/
                        var temp = function(e){
                            //console.log(e)
                            //rEar.focus();
                            //rEar.blur();
                        }
                        scope.dragging = false;

                        var toggleDragging = function(e){
                            scope.dragging = !scope.dragging;
                            rEar.focus();
                        }, processDragging = function(e){
                            var degree = 0;
                            if(e.clientX >= scope.centerX){
                                if(scope.centerY >= e.clientY){
                                    degree=180*Math.atan((e.clientX - scope.centerX)/(scope.centerY - e.clientY))/Math.PI;
                                } else {
                                    degree=180+180*Math.atan((e.clientX - scope.centerX)/(scope.centerY - e.clientY))/Math.PI;
                                }
                            } else {
                                if(scope.centerY >= e.clientY){
                                    degree=360 + 180*Math.atan((e.clientX - scope.centerX)/(scope.centerY - e.clientY))/Math.PI;
                                } else {
                                    degree=180 + 180*Math.atan((e.clientX - scope.centerX)/(scope.centerY - e.clientY))/Math.PI;
                                }
                            }
                            //console.log(e);
                            scope.current = degree;
                            scope.$apply();
                        }
                        function onPressDown(ev) {
                            rEar.addClass('_md-active');
                            rEar.focus();
                        }
                        function onDragStart(ev) {
                            scope.dragging = true;
                            ev.stopPropagation();
                            var rect = background[0].getBoundingClientRect();
                            /*scope.centerX = scope.centerX ? scope.centerX:(rect.left + (rect.width/2));
                            scope.centerY = scope.centerY ? scope.centerY:(rect.top + radius);*/
                            scope.centerX = rect.left + (rect.width/2);
                            scope.centerY = rect.top + radius
                            element.addClass('_md-dragging');
                            //console.log(e);
                            //scope.dragging(ev);
                        }
                        function onDragEnd(ev) {
                            if (!scope.dragging) return;
                            ev.stopPropagation();
                            scope.dragging = false;
                        }
                        function mouseDownListener() {
                            //   redrawTicks();

                            scope.mouseActive = true;
                            rEar.removeClass('md-focused');

                            $timeout(function() {
                                scope.mouseActive = false;
                            }, 100);
                        }
                        rEar
                            //.on('keydown', temp)
                            //.on('mousedown', mouseDownListener)
                            //.on('focus', focusListener)
                            //.on('blur', temp)
                            .on('$md.pressdown', onPressDown)
                            .on('$md.pressup', toggleDragging)
                            .on('$md.dragstart', onDragStart)
                            .on('$md.drag', processDragging)
                            .on('$md.dragend', onDragEnd);
                    };

                    var renderState = function(newValue, oldValue, preventAnimationOverride){
                        var max                 = service.toNumber(options.max || 0);
                        var end                 = newValue > 0 ? $window.Math.min(newValue, max) : 0;
                        var start               = (oldValue === end || oldValue < 0) ? 0 : (oldValue || 0); // fixes the initial animation
                        var changeInValue       = end - start;

                        var easingAnimation     = service.animations[options.animation];
                        var duration            = +options.duration || 0;
                        var preventAnimation    = preventAnimationOverride || (newValue > max && oldValue > max) || (newValue < 0 && oldValue < 0) || duration < 25;

                        var radius              = service.toNumber(options.radius);
                        var circleSize          = radius - (options.stroke/2) - service.getOffset(scope, options);
                        var isSemicircle        = options.semi;

                        svg.attr({
                            'aria-valuemax': max,
                            'aria-valuenow': end
                        });

                        var doAnimation = function(){
                            // stops some expensive animating if the value is above the max or under 0
                            if(preventAnimation){
                                service.updateState(end, max, circleSize, ring, radius, isSemicircle, rEar,innerBackground);

                                if(options.onRender){
                                    options.onRender(end, options, element);
                                }
                            }else{
                                var startTime = service.getTimestamp();
                                var id = ++lastAnimationId;

                                $window.requestAnimationFrame(function animation(){
                                    var currentTime = $window.Math.min(service.getTimestamp() - startTime, duration);
                                    var animateTo = easingAnimation(currentTime, start, changeInValue, duration);

                                    service.updateState(animateTo, max, circleSize, ring, radius, isSemicircle,rEar,innerBackground);

                                    if(options.onRender){
                                        options.onRender(animateTo, options, element);
                                    }

                                    if(id === lastAnimationId && currentTime < duration){
                                        $window.requestAnimationFrame(animation);
                                    }
                                });
                            }
                        };

                        if(options.animationDelay > 0){
                            $window.clearTimeout(lastTimeoutId);
                            $window.setTimeout(doAnimation, options.animationDelay);
                        }else{
                            doAnimation();
                        }
                    };

                    var keys = Object.keys(base.scope).filter(function(key){
                        return optionIsSpecified(key) && key !== 'current';
                    });

                    // properties that are used only for presentation
                    scope.$watchGroup(keys, function(newValue){
                        for(var i = 0; i < newValue.length; i++){
                            if(typeof newValue[i] !== 'undefined'){
                                options[keys[i]] = newValue[i];
                            }
                        }

                        renderCircle();
                        scope.$broadcast('$parentOffsetChanged');

                        // it doesn't have to listen for changes on the parent unless it inherits
                        if(options.offset === 'inherit' && !parentChangedListener){
                            parentChangedListener = scope.$on('$parentOffsetChanged', function(){
                                renderState(scope.current, scope.current, true);
                                renderCircle();
                            });
                        }else if(options.offset !== 'inherit' && parentChangedListener){
                            parentChangedListener();
                        }
                    });

                    // properties that are used during animation. some of these overlap with
                    // the ones that are used for presentation
                    scope.$watchGroup([
                        'current',
                        'max',
                        'radius',
                        'stroke',
                        'semi',
                        'offset'
                    ].filter(optionIsSpecified), function(newValue, oldValue){
                        renderState(service.toNumber(newValue[0]), service.toNumber(oldValue[0]));
                    });

                    function optionIsSpecified(name) {
                        return attrs.hasOwnProperty(name);
                    }
                },
                template: function(element){
                    var parent = element.parent();
                    var directiveName = 'round-progress';
                    var template = [
                        '<svg class="'+ directiveName +'" xmlns="http://www.w3.org/2000/svg" role="progressbar" aria-valuemin="0">',
                        '<circle class="outer-ring" fill="none"/>',
                        '<circle class="inner-ring" fill="none"/>',
                        '<circle class="bg" fill="none"/>',
                        '<path fill="none"/>',
                        '<g ng-transclude></g>',
                        '<circle class="left-ear" fill="none" filter="url(#f2)"/>',
                        '<circle class="right-ear" fill="none" filter="url(#f2)"/>',
                        '</svg>'
                    ];

                    while(
                    parent.length &&
                    parent[0].nodeName.toLowerCase() !== directiveName &&
                    typeof parent.attr(directiveName) === 'undefined'
                        ){
                        parent = parent.parent();
                    }

                    if(!parent || !parent.length){
                        template.unshift('<div class="round-progress-wrapper">');
                        template.push('</div>');
                    }

                    return template.join('\n');
                }
            });
        }]);

    })(applicationApp);
    (function (applicationApp) {
        'use strict';
        applicationApp.directive('mdTimerPicker', ['$parse', ($parse) => {
            return {
                template: '<div aria-hidden="true" class="md-calendar-time-header digit"><span class="number" ng-bind="getHour()"></span><span class="sep"></span><span class="number" ng-bind="getMinute()"></span><span class="sep"></span><span class="number" ng-bind="getSecond()"></span></div>' +
                '<div class="md-calendar-wrapper md-timer-wrapper">' +
                '<round-progress max="360" current="current" color="#00c5a3" bgcolor="#eaeaea" radius="80" stroke="20" semi="false" rounded="true" clockwise="true" responsive="false" duration="800" animation="easeInOutQuart" animation-delay="0"></round-progress>'+
                '</div>',
                scope: {
                    current: '=current',
                },
                link: function (scope, element, attrs) {
                    //console.log(arguments);
                    //scope.current = 0;
                    //window.test = ()=>{scope.current+=10;console.log(scope)}
                    scope.getHour = ()=>{
                        //console.log(Math.round(scope.current*10));
                        let timestamp= Math.round(scope.current*240),
                            hours = Math.floor(timestamp/3600);
                        hours = (hours<10)?`0${hours}`:hours;
                        return hours;
                    }
                    scope.getMinute = ()=>{
                        //console.log(Math.round(scope.current*10));
                        let timestamp= Math.round(scope.current*240),
                            minutes = Math.floor((timestamp%3600)/60);
                        minutes = (minutes<10)?`0${minutes}`:minutes;
                        return minutes;
                    }
                    scope.getSecond = ()=>{
                        //console.log(Math.round(scope.current*10));
                        let timestamp= Math.round(scope.current*240),
                            seconds = (timestamp%3600)%60;
                        seconds = (seconds<10)?`0${seconds}`:seconds;
                        return seconds;
                    }
                }
            };
        }]);

    })(applicationApp);
    (function (applicationApp) {
        'use strict';

        // POST RELEASE
        // TODO(jelbourn): Demo that uses moment.js
        // TODO(jelbourn): make sure this plays well with validation and ngMessages.
        // TODO(jelbourn): calendar pane doesn't open up outside of visible viewport.
        // TODO(jelbourn): forward more attributes to the internal input (required, autofocus, etc.)
        // TODO(jelbourn): something better for mobile (calendar panel takes up entire screen?)
        // TODO(jelbourn): input behavior (masking? auto-complete?)
        // TODO(jelbourn): UTC mode
        // TODO(jelbourn): RTL


        applicationApp.directive('mdSpinnerDatepicker', datePickerDirective);

        /**
         * @ngdoc directive
         * @name mdDatepicker
         * @module material.components.datepicker
         *
         * @param {Date} ng-model The component's model. Expects a JavaScript Date object.
         * @param {expression=} ng-change Expression evaluated when the model value changes.
         * @param {Date=} md-min-date Expression representing a min date (inclusive).
         * @param {Date=} md-max-date Expression representing a max date (inclusive).
         * @param {(function(Date): boolean)=} md-date-filter Function expecting a date and returning a boolean whether it can be selected or not.
         * @param {String=} md-placeholder The date input placeholder value.
         * @param {boolean=} ng-disabled Whether the datepicker is disabled.
         * @param {boolean=} ng-required Whether a value is required for the datepicker.
         *
         * @description
         * `<md-datepicker>` is a component used to select a single date.
         * For information on how to configure internationalization for the date picker,
         * see `$mdDateLocaleProvider`.
         *
         * This component supports [ngMessages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages).
         * Supported attributes are:
         * * `required`: whether a required date is not set.
         * * `mindate`: whether the selected date is before the minimum allowed date.
         * * `maxdate`: whether the selected date is after the maximum allowed date.
         *
         * @usage
         * <hljs lang="html">
         *   <md-datepicker ng-model="birthday"></md-datepicker>
         * </hljs>
         *
         */
        function datePickerDirective() {
            return {
                template: // Buttons are not in the tab order because users can open the calendar via keyboard
                // interaction on the text input, and multiple tab stops for one component (picker)
                // may be confusing.
                '<md-button class="md-datepicker-button md-icon-button" type="button" ' +
                'tabindex="-1" aria-hidden="true" ' +
                'ng-click="ctrl.openCalendarPane($event)" aria-label="timerpicker">' +
                '<md-icon class="md-datepicker-calendar-icon md-primary" md-svg-icon="device:ic_access_time_24px"></md-icon>' +
                '</md-button>' +
                '<div class="md-datepicker-input-container" ' +
                'ng-class="{\'md-datepicker-focused\': ctrl.isFocused}">' +
                '<input class="md-datepicker-input" aria-haspopup="true" ' +
                'ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)" ng-model="ctrl.date" />' +
                    /*'<md-button type="button" md-no-ink ' +
                     'class="md-datepicker-triangle-button md-icon-button" ' +
                     'ng-click="ctrl.openCalendarPane($event)" ' +
                     'aria-label="{{::ctrl.dateLocale.msgOpenCalendar}}">' +
                     '<div class="md-datepicker-expand-triangle"></div>' +
                     '</md-button>' +*/
                '</div>' +

                    // This pane will be detached from here and re-attached to the document body.
                '<div class="md-datepicker-calendar-pane md-timer-picker-pane">' +
                '<div class="md-datepicker-input-mask">' +
                '<div class="md-datepicker-input-mask-opaque"></div>' +
                '</div>' +
                '<div class="md-datepicker-calendar">' +
                '<md-timer-picker class="md-whiteframe-1dp" current="ctrl.time" enter="ctrl.date" ng-show="ctrl.isCalendarOpen"/>' +
                '</div>' +
                '</div>',
                require: ['ngModel', 'mdSpinnerDatepicker', '?^mdInputContainer'],
                scope: {
                    minDate: '=mdMinDate',
                    placeholder: '@mdPlaceholder',
                },
                controller: DatePickerCtrl,
                controllerAs: 'ctrl',
                bindToController: true,
                link: function (scope, element, attr, controllers) {
                    var ngModelCtrl = controllers[0];
                    var mdDatePickerCtrl = controllers[1];

                    var mdInputContainer = controllers[2];
                    if (mdInputContainer) {
                        throw Error('md-datepicker should not be placed inside md-input-container.');
                    }
                    scope.current = 1/240;
                    mdDatePickerCtrl.configureNgModel(ngModelCtrl);
                }
            };
        }

        /** Additional offset for the input's `size` attribute, which is updated based on its content. */
        var EXTRA_INPUT_SIZE = 3;

        /** Class applied to the container if the date is invalid. */
        var INVALID_CLASS = 'md-datepicker-invalid';

        /** Default time in ms to debounce input event by. */
        var DEFAULT_DEBOUNCE_INTERVAL = 500;

        /**
         * Height of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-height is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_HEIGHT = 368;

        /**
         * Width of the calendar pane used to check if the pane is going outside the boundary of
         * the viewport. See calendar.scss for how $md-calendar-width is computed; an extra 20px is
         * also added to space the pane away from the exact edge of the screen.
         *
         *  This is computed statically now, but can be changed to be measured if the circumstances
         *  of calendar sizing are changed.
         */
        var CALENDAR_PANE_WIDTH = 360;

        /**
         * Controller for md-datepicker.
         *
         * ngInject @constructor
         */
        function DatePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window,
                                $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
            /** @final */
            this.$compile = $compile;

            /** @final */
            this.$timeout = $timeout;

            /** @final */
            this.$window = $window;

            /** @final */
            this.dateLocale = $mdDateLocale;

            /** @final */
            this.dateUtil = $$mdDateUtil;

            /** @final */
            this.$mdConstant = $mdConstant;

            /* @final */
            this.$mdUtil = $mdUtil;

            /** @final */
            this.$$rAF = $$rAF;

            /**
             * The root document element. This is used for attaching a top-level click handler to
             * close the calendar panel when a click outside said panel occurs. We use `documentElement`
             * instead of body because, when scrolling is disabled, some browsers consider the body element
             * to be completely off the screen and propagate events directly to the html element.
             * @type {!angular.JQLite}
             */
            this.documentElement = angular.element(document.documentElement);

            /** @type {!angular.NgModelController} */
            this.ngModelCtrl = null;

            /** @type {HTMLInputElement} */
            this.inputElement = $element[0].querySelector('input');

            /** @final {!angular.JQLite} */
            this.ngInputElement = angular.element(this.inputElement);

            /** @type {HTMLElement} */
            this.inputContainer = $element[0].querySelector('.md-datepicker-input-container');

            /** @type {HTMLElement} Floating calendar pane. */
            this.calendarPane = $element[0].querySelector('.md-datepicker-calendar-pane');

            /** @type {HTMLElement} Calendar icon button. */
            this.calendarButton = $element[0].querySelector('.md-datepicker-button');

            /**
             * Element covering everything but the input in the top of the floating calendar pane.
             * @type {HTMLElement}
             */
            this.inputMask = $element[0].querySelector('.md-datepicker-input-mask-opaque');

            /** @final {!angular.JQLite} */
            this.$element = $element;

            /** @final {!angular.Attributes} */
            this.$attrs = $attrs;

            /** @final {!angular.Scope} */
            this.$scope = $scope;

            /** @type {Date} */
            this.date = null;
            this.time = null;

            /** @type {boolean} */
            this.isFocused = false;

            /** @type {boolean} */
            this.isDisabled;
            this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));

            /** @type {boolean} Whether the date-picker's calendar pane is open. */
            this.isCalendarOpen = false;

            /**
             * Element from which the calendar pane was opened. Keep track of this so that we can return
             * focus to it when the pane is closed.
             * @type {HTMLElement}
             */
            this.calendarPaneOpenedFrom = null;

            this.calendarPane.id = 'md-date-pane' + $mdUtil.nextUid();

            $mdTheming($element);

            /** Pre-bound click handler is saved so that the event listener can be removed. */
            this.bodyClickHandler = angular.bind(this, this.handleBodyClick);

            /** Pre-bound resize handler so that the event listener can be removed. */
            this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeCalendarPane), 100);

            // Unless the user specifies so, the datepicker should not be a tab stop.
            // This is necessary because ngAria might add a tabindex to anything with an ng-model
            // (based on whether or not the user has turned that particular feature on/off).
            if (!$attrs['tabindex']) {
                $element.attr('tabindex', '-1');
            }

            this.installPropertyInterceptors();
            this.attachChangeListeners();
            this.attachInteractionListeners();

            var self = this;
            $scope.$on('$destroy', function () {
                self.detachCalendarPane();
            });
        }

        DatePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];

        DatePickerCtrl.prototype.toTimestamp = function(value){
            if(typeof value !== 'string'){
                return 0;
            }

            var array = value.split(":");
            return new Number(array[0])*3600 + new Number(array[1])*60 + new Number(array[2]);
        }
        DatePickerCtrl.prototype.toDateTime = function(value){
            if(typeof value !== 'string'){
                return 0;
            }

            var array = value.split(":");
            return this.dateLocale.formatDate(new Date()) + " " + value;
        }
        DatePickerCtrl.prototype.toTime = function(value){
            if(typeof value !== 'number'){
                return "00:00:00";
            }

            let timestamp= Math.round(value*240),
                hours = Math.floor(timestamp/3600),
                minutes = Math.floor((timestamp%3600)/60),
                seconds = (timestamp%3600)%60;
            hours = (hours<10)?`0${hours}`:hours;
            minutes = (minutes<10)?`0${minutes}`:minutes;
            seconds = (seconds<10)?`0${seconds}`:seconds;
            return {time:`${hours}:${minutes}:${seconds}`,hours:hours,minutes:minutes,seconds:seconds};
        }
        /**
         * Sets up the controller's reference to ngModelController.
         * @param {!angular.NgModelController} ngModelCtrl
         */
        DatePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
            this.ngModelCtrl = ngModelCtrl;

            var self = this;
            ngModelCtrl.$render = function () {
                var value = self.ngModelCtrl.$viewValue;

                if (value && !(typeof value === "string")) {
                    throw Error('The ng-model for md-datepicker must be a String instance. ' +
                    'Currently the model is a: ' + (typeof value));
                }

                self.date = value;
                //self.date.setMilliseconds(0);
                self.time = self.toTimestamp(value);
                self.inputElement.value = value;//self.dateLocale.formatDate(value);
                self.resizeInputElement();
                self.updateErrorState();
            };
        };

        /**
         * Attach event listeners for both the text input and the md-calendar.
         * Events are used instead of ng-model so that updates don't infinitely update the other
         * on a change. This should also be more performant than using a $watch.
         */
        DatePickerCtrl.prototype.attachChangeListeners = function () {
            var self = this;

            self.$scope.$on('md-calendar-change', function (event, date) {
                /*self.ngModelCtrl.$setViewValue(date);
                 self.date = date;
                 self.inputElement.value = self.dateLocale.formatDate(date);
                 self.closeCalendarPane();
                 self.resizeInputElement();
                 self.updateErrorState();*/
            });

            self.$scope.$watch("ctrl.time", function(newValue){
                var date = self.toTime(newValue);
                self.ngModelCtrl.$setViewValue(date.time);
                /*self.date.setHours(date.hours);
                 self.date.setMinutes(date.minutes);
                 self.date.setSeconds(date.seconds);*/
                self.date = date.time;
                self.inputElement.value = date.time;//self.dateLocale.formatDate(date);
                //self.closeCalendarPane();
                self.resizeInputElement();
                //self.updateErrorState();
            })
            self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
            // TODO(chenmike): Add ability for users to specify this interval.
            self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
                DEFAULT_DEBOUNCE_INTERVAL, self));
        };

        /** Attach event listeners for user interaction. */
        DatePickerCtrl.prototype.attachInteractionListeners = function () {
            var self = this;
            var $scope = this.$scope;
            var keyCodes = this.$mdConstant.KEY_CODE;

            // Add event listener through angular so that we can triggerHandler in unit tests.
            self.ngInputElement.on('keydown', function (event) {
                if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                    self.openCalendarPane(event);
                    $scope.$digest();
                }
            });

            $scope.$on('md-calendar-close', function () {
                self.closeCalendarPane();
            });
        };

        /**
         * Capture properties set to the date-picker and imperitively handle internal changes.
         * This is done to avoid setting up additional $watches.
         */
        DatePickerCtrl.prototype.installPropertyInterceptors = function () {
            var self = this;

            if (this.$attrs['ngDisabled']) {
                // The expression is to be evaluated against the directive element's scope and not
                // the directive's isolate scope.
                var scope = this.$scope.$parent;

                if (scope) {
                    scope.$watch(this.$attrs['ngDisabled'], function (isDisabled) {
                        self.setDisabled(isDisabled);
                    });
                }
            }

            Object.defineProperty(this, 'placeholder', {
                get: function () {
                    return self.inputElement.placeholder;
                },
                set: function (value) {
                    self.inputElement.placeholder = value || '';
                }
            });
        };

        /**
         * Sets whether the date-picker is disabled.
         * @param {boolean} isDisabled
         */
        DatePickerCtrl.prototype.setDisabled = function (isDisabled) {
            this.isDisabled = isDisabled;
            this.inputElement.disabled = isDisabled;
            this.calendarButton.disabled = isDisabled;
        };

        /**
         * Sets the spinner ngModel.$error flags to be consumed by ngMessages. Flags are:
         *   - mindate: whether the selected date is before the minimum date.
         *   - maxdate: whether the selected flag is after the maximum date.
         *   - filtered: whether the selected date is allowed by the spinner filtering function.
         *   - valid: whether the entered text input is a valid date
         *
         * The 'required' flag is handled automatically by ngModel.
         *
         * @param {Date=} opt_date Date to check. If not given, defaults to the datepicker's model value.
         */
        DatePickerCtrl.prototype.updateErrorState = function (opt_date) {
            var date = opt_date || this.date;

            // Clear any existing errors to get rid of anything that's no longer relevant.
            this.clearErrorState();

            if (this.dateUtil.isValidDate(date)) {
                // Force all dates to midnight in order to ignore the time portion.
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

        /** Clears any error flags set by `updateErrorState`. */
        DatePickerCtrl.prototype.clearErrorState = function () {
            this.inputContainer.classList.remove(INVALID_CLASS);
            ['mindate', 'maxdate', 'filtered', 'valid'].forEach(function (field) {
                this.ngModelCtrl.$setValidity(field, true);
            }, this);
        };

        /** Resizes the input element based on the size of its content. */
        DatePickerCtrl.prototype.resizeInputElement = function () {
            this.inputElement.size = this.inputElement.value.length + EXTRA_INPUT_SIZE;
        };

        /**
         * Sets the model value if the user input is a valid date.
         * Adds an invalid class to the input element if not.
         */
        DatePickerCtrl.prototype.handleInputEvent = function () {
            var inputString = this.inputElement.value;

            if(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9])$/.test(inputString)){

                //this.ngModelCtrl.$setViewValue(inputString);
                this.date = this.toTime(inputString);
                this.time = this.toTimestamp(inputString)/240;
            } else {
                this.date = this.ngModelCtrl.$viewValue;
                //this.updateErrorState(this.toDateTime(inputString));
            }
            /*var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
             this.dateUtil.setDateTimeToMidnight(parsedDate);

             // An input string is valid if it is either empty (representing no date)
             // or if it parses to a valid date that the user is allowed to select.
             var isValidInput = inputString == '' || (
             this.dateUtil.isValidDate(parsedDate) &&
             this.dateLocale.isDateComplete(inputString) &&
             this.isDateEnabled(parsedDate)
             );

             // The datepicker's model is only updated when there is a valid input.
             if (isValidInput) {
             this.ngModelCtrl.$setViewValue(parsedDate);
             this.date = parsedDate;
             }

             this.updateErrorState(parsedDate);*/
        };

        /**
         * Check whether date is in range and enabled
         * @param {Date=} opt_date
         * @return {boolean} Whether the date is enabled.
         */
        DatePickerCtrl.prototype.isDateEnabled = function (opt_date) {
            return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
                (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
        };

        /** Position and attach the floating calendar to the document. */
        DatePickerCtrl.prototype.attachCalendarPane = function () {
            var calendarPane = this.calendarPane;
            calendarPane.style.transform = '';
            this.$element.addClass('md-datepicker-open');

            var elementRect = this.inputContainer.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect();

            // Check to see if the calendar pane would go off the screen. If so, adjust position
            // accordingly to keep it within the viewport.
            var paneTop = elementRect.top - bodyRect.top + 40;
            var paneLeft = elementRect.left - bodyRect.left - 40;

            // If ng-material has disabled body scrolling (for example, if a dialog is open),
            // then it's possible that the already-scrolled body has a negative top/left. In this case,
            // we want to treat the "real" top as (0 - bodyRect.top). In a normal scrolling situation,
            // though, the top of the viewport should just be the body's scroll position.
            var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
                -bodyRect.top :
                document.body.scrollTop;

            var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
                -bodyRect.left :
                document.body.scrollLeft;

            var viewportBottom = viewportTop + this.$window.innerHeight;
            var viewportRight = viewportLeft + this.$window.innerWidth;

            // If the right edge of the pane would be off the screen and shifting it left by the
            // difference would not go past the left edge of the screen. If the calendar pane is too
            // big to fit on the screen at all, move it to the left of the screen and scale the entire
            // element down to fit.
            if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
                if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
                    paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
                } else {
                    paneLeft = viewportLeft;
                    var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
                    calendarPane.style.transform = 'scale(' + scale + ')';
                }

                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            // If the bottom edge of the pane would be off the screen and shifting it up by the
            // difference would not go past the top edge of the screen.
            if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
                viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
                paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
                calendarPane.classList.add('md-datepicker-pos-adjusted');
            }

            calendarPane.style.left = paneLeft + 'px';
            calendarPane.style.top = paneTop + 'px';
            document.body.appendChild(calendarPane);

            // The top of the calendar pane is a transparent box that shows the text input underneath.
            // Since the pane is floating, though, the page underneath the pane *adjacent* to the input is
            // also shown unless we cover it up. The inputMask does this by filling up the remaining space
            // based on the width of the input.
            this.inputMask.style.left = elementRect.width + 'px';

            // Add CSS class after one frame to trigger open animation.
            this.$$rAF(function () {
                calendarPane.classList.add('md-pane-open');
            });
        };

        /** Detach the floating calendar pane from the document. */
        DatePickerCtrl.prototype.detachCalendarPane = function () {
            this.$element.removeClass('md-datepicker-open');
            this.calendarPane.classList.remove('md-pane-open');
            this.calendarPane.classList.remove('md-datepicker-pos-adjusted');

            if (this.isCalendarOpen) {
                this.$mdUtil.enableScrolling();
            }

            if (this.calendarPane.parentNode) {
                // Use native DOM removal because we do not want any of the angular state of this element
                // to be disposed.
                this.calendarPane.parentNode.removeChild(this.calendarPane);
            }
        };

        /**
         * Open the floating calendar pane.
         * @param {Event} event
         */
        DatePickerCtrl.prototype.openCalendarPane = function (event) {
            if (!this.isCalendarOpen && !this.isDisabled) {
                this.isCalendarOpen = true;
                this.calendarPaneOpenedFrom = event.target;

                // Because the calendar pane is attached directly to the body, it is possible that the
                // rest of the component (input, etc) is in a different scrolling container, such as
                // an md-content. This means that, if the container is scrolled, the pane would remain
                // stationary. To remedy this, we disable scrolling while the calendar pane is open, which
                // also matches the native behavior for things like `<select>` on Mac and Windows.
                this.$mdUtil.disableScrollAround(this.calendarPane);

                this.attachCalendarPane();
                this.focusCalendar();

                // Attach click listener inside of a timeout because, if this open call was triggered by a
                // click, we don't want it to be immediately propogated up to the body and handled.
                var self = this;
                this.$mdUtil.nextTick(function () {
                    // Use 'touchstart` in addition to click in order to work on iOS Safari, where click
                    // events aren't propogated under most circumstances.
                    // See http://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
                    self.documentElement.on('click touchstart', self.bodyClickHandler);
                }, false);

                window.addEventListener('resize', this.windowResizeHandler);
            }
        };

        /** Close the floating calendar pane. */
        DatePickerCtrl.prototype.closeCalendarPane = function () {
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

        /** Gets the controller instance for the calendar in the floating pane. */
        DatePickerCtrl.prototype.getCalendarCtrl = function () {
            return angular.element(this.calendarPane.querySelector('md-spinner-calendar')).controller('mdSpinnerCalendar');
        };

        /** Focus the calendar in the floating pane. */
        DatePickerCtrl.prototype.focusCalendar = function () {
            // Use a timeout in order to allow the calendar to be rendered, as it is gated behind an ng-if.
            var self = this;
            this.$mdUtil.nextTick(function () {
                //self.getCalendarCtrl().focus();
            }, false);
        };

        /**
         * Sets whether the input is currently focused.
         * @param {boolean} isFocused
         */
        DatePickerCtrl.prototype.setFocused = function (isFocused) {
            if (!isFocused) {
                this.ngModelCtrl.$setTouched();
            }
            this.isFocused = isFocused;
        };

        /**
         * Handles a click on the document body when the floating calendar pane is open.
         * Closes the floating calendar pane if the click is not inside of it.
         * @param {MouseEvent} event
         */
        DatePickerCtrl.prototype.handleBodyClick = function (event) {
            if (this.isCalendarOpen) {
                // TODO(jelbourn): way want to also include the md-datepicker itself in this check.
                var isInCalendar = this.$mdUtil.getClosest(event.target, 'md-timer-picker');
                if (!isInCalendar) {
                    this.closeCalendarPane();
                }

                this.$scope.$digest();
            }
        };
    })(applicationApp);

})(window.angular);























// 时间范围滚轮
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropTimeRangeSpinner', timeRangeSpinnerDirective);

    function timeRangeSpinnerDirective() {
        return {
            scope: {
                minTime: '=',
                maxTime: '=',
                timeFilter: '='
            },
            require: ['ngModel', 'ropTimeRangeSpinner'],
            controller: TimeRangeSpinnerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <md-toolbar class="md-primary">
                    <div class="md-toolbar-tools">
                        <h2 class="flex"><span ng-bind="ctrl.minTime"></span></h2>
                        <span> - </span>
                        <h2 class="flex"><span ng-bind="ctrl.maxTime"></span></h2>
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

    var SELECTED_DATE_CLASS = 'rop-timerange-spinner-selected-date';
    //var FOCUSED_DATE_CLASS = 'rop-focus';
    //var TODAY_CLASS = 'rop-calendar-date-today';
    var nextUniqueId = 0;

    function TimeRangeSpinnerCtrl($element, $attrs, $scope, $animate, $q, $mdConstant, $mdTheming, $$mdDateUtil, $mdDateLocale, $mdInkRipple, $mdUtil) {
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
    TimeRangeSpinnerCtrl.$inject = ["$element", "$attrs", "$scope", "$animate", "$q", "$mdConstant", "$mdTheming", "$$mdDateUtil", "$mdDateLocale", "$mdInkRipple", "$mdUtil"];
    TimeRangeSpinnerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            self.changeSelectedDate(self.ngModelCtrl.$viewValue);
        };
    };
    TimeRangeSpinnerCtrl.prototype.changeSelectedDate = function(date) {
        var self = this;
        var previousSelectedDate = this.selectedDate;
        this.selectedDate = date;
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
    TimeRangeSpinnerCtrl.prototype.changeDisplayDate = function(date) {
        if (!this.isInitialized) {
            this.buildInitialCalendarDisplay();
            return this.$q.when();
        }

        if (!this.dateUtil.isValidDate(date) || this.isMonthTransitionInProgress) {
            return this.$q.when();
        }

        if(this.displayDate && (this.displayDate instanceof Date) && (this.displayDate.getMonth() == date.getMonth())){
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
    TimeRangeSpinnerCtrl.prototype.animateDateChange = function(date) {
        this.scrollToMonth(date);
        return this.$q.when();
    };
    TimeRangeSpinnerCtrl.prototype.scrollToMonth = function(date) {
        if (!this.dateUtil.isValidDate(date)) {
            return;
        }

        /*var monthDistance = this.dateUtil.getMonthDistance(this.firstRenderableDate, date);
         this.calendarScroller.scrollTop = monthDistance * TBODY_HEIGHT;*/
        this.generateContent();
    };
    TimeRangeSpinnerCtrl.prototype.attachCalendarEventListeners = function () {
        this.$element.on('keydown', angular.bind(this, this.handleKeyEvent));
    };
    TimeRangeSpinnerCtrl.prototype.handleKeyEvent = function(event) {
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
    TimeRangeSpinnerCtrl.prototype.setNgModelValue = function (date) {
        this.$scope.$emit('rop-calendar-change', date);
        this.ngModelCtrl.$setViewValue(date);
        this.ngModelCtrl.$render();
    };
    TimeRangeSpinnerCtrl.prototype.boundDateByMinAndMax = function(date) {
        var boundDate = date;
        if (this.minDate && date < this.minDate) {
            boundDate = new Date(this.minDate.getTime());
        }
        if (this.maxDate && date > this.maxDate) {
            boundDate = new Date(this.maxDate.getTime());
        }
        return boundDate;
    };

    // 以下是操作
    TimeRangeSpinnerCtrl.prototype.buildInitialCalendarDisplay = function() {
        this.buildWeekHeader();
        //this.hideVerticalScrollbar();

        this.displayDate = this.selectedDate || this.today;
        this.isInitialized = true;
        this.generateContent();
        this.focus(this.displayDate);
    };
    TimeRangeSpinnerCtrl.prototype.buildWeekHeader = function() {
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
    TimeRangeSpinnerCtrl.prototype.getFocusDateFromKeyEvent = function(event) {
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

    TimeRangeSpinnerCtrl.prototype.focus = function(opt_date) {
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
    TimeRangeSpinnerCtrl.prototype.incrementMonth = function(numberOfMonths) {
        this.displayDate = this.dateUtil.incrementMonths(this.displayDate, numberOfMonths)
        this.generateContent();
    };
    TimeRangeSpinnerCtrl.prototype.getDateId = function(date) {
        return [
            'rop',
            this.id,
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ].join('-');
    };
    TimeRangeSpinnerCtrl.prototype.getMonthHeader = function() {
        return this.dateLocale.monthHeaderFormatter(this.displayDate);
    };


    // 跟内容相关
    TimeRangeSpinnerCtrl.prototype.generateContent = function() {
        //var TimeRangeSpinnerCtrl = this.TimeRangeSpinnerCtrl;
        //var date = this.dateUtil.incrementMonths(TimeRangeSpinnerCtrl.firstRenderableDate, this.offset);
        //var myDate = date && (date instanceof Date)?date: new Date();

        if(this.displayDate){
            this.$calendarBody.empty();
            this.$calendarBody.append(this.buildCalendarForMonth(this.displayDate));

            if (this.focusAfterAppend) {
                this.focusAfterAppend.classList.add(FOCUSED_DATE_CLASS);
                this.focusAfterAppend.focus();
                this.focusAfterAppend = null;
            }
        }
    };
    TimeRangeSpinnerCtrl.prototype.buildCalendarForMonth = function(opt_dateInMonth) {
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
    TimeRangeSpinnerCtrl.prototype.buildDateCell = function(opt_date) {
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

        return cell;
    };
    CalendarCtrl.prototype.isDateEnabled = function(opt_date) {
        return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) && (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
    }
    CalendarCtrl.prototype.getLocaleDay_ = function(date) {
        return (date.getDay() + (7 - this.dateLocale.firstDayOfWeek)) % 7
    };
})(window.angular);
// 时间范围的输入框
(function (angular) {
    'use strict';
    angular.module('rop.module.calendar').directive('ropTimeRangePicker', timeRangePickerDirective);

    function timeRangePickerDirective() {
        return {
            scope: {
                minTime: '=',
                maxTime: '=',
                minTimePlaceholder: '@',
                maxTimePlaceholder: '@',
                token: '@',
                timeFilter: '='
            },
            require: ['ngModel', 'ropTimeRangePicker'],
            controller: TimeRangePickerCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            template:`
                <form class="rop-timerangepicker" ng-class="{'disabled': ctrl.isDisabled}" name="timerRangeForm">
                    <md-icon class="rop-timerangepicker-icon" md-svg-icon="device:ic_access_time_24px" ng-click="ctrl.openTimeRangePane($event)"></md-icon>
                    <input class="rop-timerangepicker-input-start" name="minTime" ng-placeholder="ctrl.minTimePlaceholder" ng-model="ctrl.minTime" ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false) ng-pattern="'^([0-1][0-9]|2[0-3])'+ctrl.token+'([0-5][0-9])'+ctrl.token+'([0-5][0-9])$'">
                    <span> - </span>
                    <input class="rop-timerangepicker-input-end" name="maxTime" ng-placeholder="ctrl.maxTimePlaceholder" ng-model="ctrl.minTime" ng-focus="ctrl.setFocused(true)" ng-blur="ctrl.setFocused(false)" ng-pattern="'^([0-1][0-9]|2[0-3])'+ctrl.token+'([0-5][0-9])'+ctrl.token+'([0-5][0-9])$'">
                </form>

                <div class="rop-timerangepicker-pane md-whiteframe-z1">
                    <div class="rop-timerangepicker-input-mask">
                        <div class="rop-timerangepicker-input-mask-opaque"></div>
                    </div>
                    <div class="rop-timerange-spinner">
                        <rop-time-range-spinner role="dialog" min-time="ctrl.minTime" max-time="ctrl.maxTime" time-filter="ctrl.timeFilter" ng-model="ctrl.time" ng-if="ctrl.isTimeRangeSpinnerOpen">
                        </rop-time-range-spinner>
                    </div>
                </div>
            `,
            link: function (scope, element, attrs, controllers) {
                var ngModelCtrl = controllers[0];
                var mdTimeRangePickerCtrl = controllers[1];
                mdTimeRangePickerCtrl.configureNgModel(ngModelCtrl);
            }
        };
    }

    var DEFAULT_DEBOUNCE_INTERVAL = 500;
    var INVALID_CLASS = 'rop-timerangepicker-invalid';
    var CALENDAR_PANE_HEIGHT = 301;
    var CALENDAR_PANE_WIDTH = 472;

    function TimeRangePickerCtrl($scope, $element, $attrs, $compile, $timeout, $window, $mdConstant, $mdTheming, $mdUtil, $mdDateLocale, $$mdDateUtil, $$rAF) {
        this.$compile = $compile;
        this.$timeout = $timeout;
        this.$window = $window;

        // 对于时间选择，以下可能无用
        this.dateLocale = $mdDateLocale;
        this.dateUtil = $$mdDateUtil;
        this.$mdConstant = $mdConstant;
        this.$mdUtil = $mdUtil;

        // 一个动画之后
        this.$$rAF = $$rAF;

        // 用于文档流绝对定位
        this.documentElement = angular.element(document.documentElement);
        this.ngModelCtrl = null;
        this.inputStartElement = $element[0].querySelector('.rop-timerangepicker-input-start');
        this.ngInputStartElement = angular.element(this.inputStartElement);
        this.inputEndElement = $element[0].querySelector('.rop-timerangepicker-input-end');
        this.ngInputEndElement = angular.element(this.inputEndElement);
        this.inputContainer = $element[0].querySelector('.rop-timerangepicker');
        this.ngInputContainer = angular.element(this.inputContainer);
        this.timeRangeSpinnerPane = $element[0].querySelector('.rop-timerangepicker-pane');
        this.timeRangePickerButton = $element[0].querySelector('.rop-timerangepicker-icon');
        this.inputMask = $element[0].querySelector('.rop-timerangepicker-input-mask-opaque');
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;
        this.date = null;
        this.isFocused = false;
        this.isDisabled;
        this.setDisabled($element[0].disabled || angular.isString($attrs['disabled']));
        this.isTimeRangeSpinnerOpen = false;
        this.openOnFocus = $attrs.hasOwnProperty('ropOpenOnFocus');

        this.timeRangeSpinnerPaneOpenedFrom = null;
        this.timeRangeSpinnerPane.id = 'rop-timerange-spinner-pane' + $mdUtil.nextUid();

        $mdTheming($element);
        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowResizeHandler = $mdUtil.debounce(angular.bind(this, this.closeTimeRangeSpinnerPane), 100);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        if (!$attrs['tabindex']) {$element.attr('tabindex', '-1');}

        this.installPropertyInterceptors();
        this.attachChangeListeners();
        this.attachInteractionListeners();

        var self = this;
        $scope.$on('$destroy', function() {
            self.detachTimeRangeSpinnerPane();
        });
    }
    TimeRangePickerCtrl.$inject = ["$scope", "$element", "$attrs", "$compile", "$timeout", "$window", "$mdConstant", "$mdTheming", "$mdUtil", "$mdDateLocale", "$$mdDateUtil", "$$rAF"];
    // 由于是范围选择，ngmodel在这里变得无用, 只需要对输入的参数进行更新
    TimeRangePickerCtrl.prototype.configureNgModel = function(ngModelCtrl) {
        this.ngModelCtrl = ngModelCtrl;
        var self = this;
        ngModelCtrl.$render = function() {
            var value = self.ngModelCtrl.$viewValue;
            if (value && !(value instanceof String)) { throw Error('The ng-model for rop-timerange-picker must be a String instance. ' + 'Currently the model is a: ' + (typeof value));}
            if ((value.indexOf("-") == -1)){throw Error('The ng-model for rop-timerange-picker must be formatted like hh:MM:ss - hh:MM:ss. ')}
            self.time = value;
            var obj = self.splitModel();
            self.minTime = obj.minTime;
            self.maxTime = obj.maxTime;
            //self.inputElement.value = self.dateLocale.formatTime(value);
            //self.resizeInputElement();
            self.updateErrorState();
        };
    };
    TimeRangePickerCtrl.prototype.setDisabled = function(isDisabled) {
        this.isDisabled = isDisabled;
        this.inputStartElement.disabled = isDisabled;
        this.inputEndElement.disabled = isDisabled;
        this.timeRangePickerButton.disabled = isDisabled;
    };
    TimeRangePickerCtrl.prototype.updateErrorState = function(opt_time, isStartTime) {
        var time = opt_time || (isStartTime?this.splitModel().minTime:this.splitModel().maxTime);
        this.clearErrorState();

        if(this.$scope.timerRangeForm.$invalid){
            this.ngModelCtrl.$setValidity('valid', false);
        } else if(!this.dateUtil.isMinTimeBeforeMaxTime(this.minTime,this.maxTime,this.token)){
            this.ngModelCtrl.$setValidity('minAfterMax', false);
        } else if (angular.isFunction(this.timeFilter)) {
            this.ngModelCtrl.$setValidity('filtered', this.timeFilter(time));
        }
        // TODO(jelbourn): Change this to classList.toggle when we stop using PhantomJS in unit tests
        // because it doesn't conform to the DOMTokenList spec.
        // See https://github.com/ariya/phantomjs/issues/12782.
        if (!this.ngModelCtrl.$valid) {
            this.inputContainer.classList.add(INVALID_CLASS);
        }
    };
    TimeRangePickerCtrl.prototype.clearErrorState = function() {
        this.inputContainer.classList.remove(INVALID_CLASS);
        ['minAfterMax','filtered', 'valid'].forEach(function(field) {
            this.ngModelCtrl.$setValidity(field, true);
        }, this);
    };
    TimeRangePickerCtrl.prototype.handleBodyClick = function(event) {
        if (this.isTimeRangeSpinnerOpen) {
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'rop-time-range-spinner');
            if (!isInCalendar) {
                this.closeTimeRangeSpinnerPane();
            }
            this.$scope.$digest();
        }
    };
    TimeRangePickerCtrl.prototype.closeTimeRangeSpinnerPane = function() {
        if (this.isTimeRangeSpinnerOpen) {
            this.detachTimeRangeSpinnerPane();
            this.isTimeRangeSpinnerOpen = false;
            this.timeRangeSpinnerPaneOpenedFrom.focus();
            this.timeRangeSpinnerPaneOpenedFrom = null;

            this.ngModelCtrl.$setTouched();

            this.documentElement.off('click touchstart', this.bodyClickHandler);
            window.removeEventListener('resize', this.windowResizeHandler);
        }
    };
    TimeRangePickerCtrl.prototype.detachTimeRangeSpinnerPane = function() {
        this.$element.removeClass('rop-timerangepicker-open');
        this.timeRangeSpinnerPane.classList.remove('rop-pane-open');
        if (this.isTimeRangeSpinnerOpen) {this.$mdUtil.enableScrolling();}
        if (this.timeRangeSpinnerPane.parentNode) {this.timeRangeSpinnerPane.parentNode.removeChild(this.timeRangeSpinnerPane);}
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

        Object.defineProperty(this, 'min-time-placeholder', {
            get: function() { return self.inputStartElement.placeholder; },
            set: function(value) { self.inputStartElement.placeholder = value || ''; }
        });
        Object.defineProperty(this, 'max-time-placeholder', {
            get: function() { return self.inputEndElement.placeholder; },
            set: function(value) { self.inputEndElement.placeholder = value || ''; }
        });
    };
    TimeRangePickerCtrl.prototype.attachChangeListeners = function() {
        var self = this;

        self.$scope.$on('rop-timerange-change', function(event, obj) {
            self.ngModelCtrl.$setViewValue(obj.value);
            self.time = obj.value;
            //self.inputElement.value = self.dateLocale.formatDate(date);
            self.minTime = obj.minTime;
            self.maxTime = obj.maxTime;
            self.closeTimeRangeSpinnerPane();
            //self.resizeInputElement();
            self.updateErrorState();
        });

        //self.ngInputElement.on('input', angular.bind(self, self.resizeInputElement));
        // TODO(chenmike): Add ability for users to specify this interval.
        self.ngInputElement.on('input', self.$mdUtil.debounce(self.handleInputEvent,
            DEFAULT_DEBOUNCE_INTERVAL, self));
    };
    TimeRangePickerCtrl.prototype.handleInputEvent = function(isStartTime) {
        var inputString = isStartTime?this.inputStartElement.value:this.inputEndElement.value;
        //var parsedDate = inputString ? this.dateLocale.parseDate(inputString) : null;
        this.dateUtil.setDateTimeToMidnight(parsedDate);
        var isValidInput = inputString == '' || (
            this.dateUtil.isValidTime(inputString,this.token) &&
            this.isTimeEnabled(inputString)
            );
        if (isValidInput) {
            var time = isStartTime?(inputString+"-"+this.maxTime):(this.minTime+"-"+inputString);
            this.ngModelCtrl.$setViewValue(time);
            this.time = time;
        }
        this.updateErrorState();
    };
    TimeRangePickerCtrl.prototype.isTimeEnabled = function(opt_time,isStartTime) {
        return (isStartTime? this.dateUtil.isMinTimeBeforeMaxTime(opt_time,this.maxTime,this.token):this.dateUtil.isMinTimeBeforeMaxTime(this.minTime,opt_time,this.token)) && (!angular.isFunction(this.timeFilter) || this.timeFilter(opt_time))
    };
    TimeRangePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        var keyCodes = this.$mdConstant.KEY_CODE;

        self.ngInputStartElement.on('keydown', function(event) {
            if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                self.openTimeRangeSpinnerPane(event);
                $scope.$digest();
            }
        });
        self.ngInputEndElement.on('keydown', function(event) {
            if (event.altKey && event.keyCode == keyCodes.DOWN_ARROW) {
                self.openTimeRangeSpinnerPane(event);
                $scope.$digest();
            }
        });
        if (self.openOnFocus) {
            self.ngInputStartElement.on('focus', angular.bind(self, self.openTimeRangeSpinnerPane));
            self.ngInputEndElement.on('focus', angular.bind(self, self.openTimeRangeSpinnerPane));
            angular.element(self.$window).on('blur', self.windowBlurHandler);

            $scope.$on('$destroy', function() {
                angular.element(self.$window).off('blur', self.windowBlurHandler);
            });
        }
        $scope.$on('rop-calendar-close', function() {
            self.closeTimeRangeSpinnerPane();
        });
    };
    TimeRangePickerCtrl.prototype.handleWindowBlur = function() {
        this.inputFocusedOnWindowBlur = document.activeElement === this.inputElement;
    };

    // 以下是用于组件关联和操作所用
    TimeRangePickerCtrl.prototype.getTimeRangeSpinnerCtrl = function() {
        return angular.element(this.timeRangeSpinnerPane.querySelector('rop-time-range-spinner')).controller('ropTimeRangeSpinner');
    };
    TimeRangePickerCtrl.prototype.setFocused = function(isFocused) {
        if (!isFocused) {this.ngModelCtrl.$setTouched();}
        this.isFocused = isFocused;
    };
    TimeRangePickerCtrl.prototype.focusTimeRangeSpinner = function() {
        var self = this;
        this.$mdUtil.nextTick(function() {self.getTimeRangeSpinnerCtrl().focus();
        }, false);
    };
    TimeRangePickerCtrl.prototype.openTimeRangeSpinnerPane = function(event) {
        if (!this.isTimeRangeSpinnerOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isTimeRangeSpinnerOpen = true;
            this.timeRangeSpinnerPaneOpenedFrom = event.target;
            this.$mdUtil.disableScrollAround(this.timeRangeSpinnerPane);

            this.attachTimeRangeSpinnerPane();
            this.focusTimeRangeSpinner();

            var self = this;
            this.$mdUtil.nextTick(function() {
                self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);

            window.addEventListener('resize', this.windowResizeHandler);
        }
    };
    TimeRangePickerCtrl.prototype.attachTimeRangeSpinnerPane = function() {
        var calendarPane = this.timeRangeSpinnerPane;
        calendarPane.style.transform = '';
        this.$element.addClass('rop-timerangepicker-open');

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

            calendarPane.classList.add('rop-timerangepicker-pos-adjusted');
        }
        if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
            viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
            paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
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
    TimeRangePickerCtrl.prototype.splitModel = function(){
        if(this.time && (this.time instanceof "String") && (this.time.indexOf("-") != -1)){
            var timeArray = this.time.split("-");
            return {minTime:timeArray[0],maxTime:timeArray[1]}
        } else {
            return {minTime:"00"+this.token+"00"+this.token+"00",maxTime:"01"+this.token+"00"+this.token+"00"}
        }
    }
})(window.angular);






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
                <div class="rop-timerangepicker" ng-click="ctrl.openTimeRangePane($event)">
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
    /*TimeRangePickerCtrl.prototype.isDateEnabled = function(opt_date) {
     return this.dateUtil.isDateWithinRange(opt_date, this.minDate, this.maxDate) &&
     (!angular.isFunction(this.dateFilter) || this.dateFilter(opt_date));
     };*/
    /*TimeRangePickerCtrl.prototype.isTimeEnabled = function(time){
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
     };*/
    TimeRangePickerCtrl.prototype.attachInteractionListeners = function() {
        var self = this;
        var $scope = this.$scope;
        $scope.$on('rop-timerangepicker-close', function() {
            self.closeTimeRangePane();
        });
    };

    // 以下是用于组件关联和操作所用
    /*TimeRangePickerCtrl.prototype.getSpinnerCtrl = function() {
     return angular.element(this.spinnerPane.querySelector('rop-time-spinner')).controller('ropTimeSpinner');
     };*/
    /*TimeRangePickerCtrl.prototype.setFocused = function(isFocused) {
     if (!isFocused) {this.ngModelCtrl.$setTouched();}
     this.isFocused = isFocused;
     };
     TimeRangePickerCtrl.prototype.focusSpinner = function() {
     var self = this;
     this.$mdUtil.nextTick(function() {self.getSpinnerCtrl().focus(0);
     }, false);
     };*/
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