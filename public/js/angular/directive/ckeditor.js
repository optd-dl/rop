"use strict";!function(angular){function editorDirective(){return{scope:{minDate:"=",maxDate:"=",dateFilter:"=",rangeCalendar:"@"},require:["ngModel","ropWYSIWYGEditor"],controller:EditorCtrl,controllerAs:"ctrl",bindToController:!0,template:"\n                <textarea >\n            ",link:function(scope,element,attrs,controllers){var ngModelCtrl=controllers[0],editorCtrl=controllers[1];editorCtrl.configureNgModel(ngModelCtrl)}}}function EditorCtrl($element,$attrs,$scope,$animate,$q,$mdConstant,$mdTheming,$$mdDateUtil,$mdDateLocale,$mdInkRipple,$mdUtil){$mdTheming($element),this.$animate=$animate,this.$q=$q,this.$mdInkRipple=$mdInkRipple,this.$mdUtil=$mdUtil,this.keyCode=$mdConstant.KEY_CODE,this.dateUtil=$$mdDateUtil,this.dateLocale=$mdDateLocale,this.$element=$element,this.$scope=$scope,this.calendarElement=$element[0].querySelector(".rop-calendar"),this.$calendarBody=angular.element($element[0].querySelector(".rop-calendar-month")),this.today=this.dateUtil.createDateAtMidnight(),this.ngModelCtrl=null,this.selectedDate=null,this.displayDate=null,this.focusDate=null,this.isInitialized=!1,this.focusAfterAppend=null,this.id=nextUniqueId++,$attrs.tabindex||$element.attr("tabindex","-1");var self=this;this.cellClickHandler=function(){var cellElement=this;this.hasAttribute("data-timestamp")&&$scope.$apply(function(){var timestamp=Number(cellElement.getAttribute("data-timestamp"));self.setNgModelValue(self.dateUtil.createDateAtMidnight(timestamp))})},this.attachCalendarEventListeners()}var model=angular.module("rop.module.WYSIWYGEditor",[]);model.directive("ropWYSIWYGEditor",editorDirective),CalendarCtrl.$inject=["$element","$attrs","$scope","$animate","$q","$mdConstant","$mdTheming","$$mdDateUtil","$mdDateLocale","$mdInkRipple","$mdUtil"],CalendarCtrl.prototype.configureNgModel=function(ngModelCtrl){this.ngModelCtrl=ngModelCtrl;var self=this;ngModelCtrl.$render=function(){self.changeSelectedDate(self.ngModelCtrl.$viewValue)}},CalendarCtrl.prototype.changeSelectedDate=function(date){var self=this,previousSelectedDate=this.selectedDate;this.selectedDate=date,this.changeDisplayDate(date).then(function(){if(previousSelectedDate){var prevDateCell=document.getElementById(self.getDateId(previousSelectedDate));prevDateCell&&prevDateCell.classList.remove(SELECTED_DATE_CLASS)}if(date){var dateCell=document.getElementById(self.getDateId(date));dateCell&&dateCell.classList.add(SELECTED_DATE_CLASS)}})},CalendarCtrl.prototype.changeDisplayDate=function(date){if(!this.isInitialized)return this.buildInitialCalendarDisplay(),this.$q.when();if(!this.dateUtil.isValidDate(date)||this.isMonthTransitionInProgress)return this.$q.when();if(!this.rangeCalendar&&this.displayDate&&this.displayDate instanceof Date&&this.displayDate.getMonth()==date.getMonth())return this.$q.when();this.isMonthTransitionInProgress=!0,this.displayDate=date;var animationPromise=this.animateDateChange(date),self=this;return animationPromise.then(function(){self.isMonthTransitionInProgress=!1}),animationPromise},CalendarCtrl.prototype.animateDateChange=function(date){return this.scrollToMonth(date),this.$q.when()},CalendarCtrl.prototype.scrollToMonth=function(date){this.dateUtil.isValidDate(date)&&this.generateContent()},CalendarCtrl.prototype.attachCalendarEventListeners=function(){this.$element.on("keydown",angular.bind(this,this.handleKeyEvent));var self=this;"0"==this.rangeCalendar?(this.$scope.$watch(function(){return self.maxDate},function(e,date){self.ngModelCtrl.$render()}),this.$scope.$on("range-change",function(e,obj){self.ngModelCtrl.$setViewValue(obj.minDate),self.ngModelCtrl.$render()})):"1"==this.rangeCalendar&&(this.$scope.$on("range-change",function(e,obj){self.ngModelCtrl.$setViewValue(obj.maxDate),self.ngModelCtrl.$render()}),this.$scope.$watch(function(){return self.minDate},function(date){self.ngModelCtrl.$render()}))},CalendarCtrl.prototype.handleKeyEvent=function(event){var self=this;this.$scope.$apply(function(){if(event.which==self.keyCode.ESCAPE||event.which==self.keyCode.TAB)return self.$scope.$emit("rop-calendar-close"),void(event.which==self.keyCode.TAB&&event.preventDefault());if(event.which===self.keyCode.ENTER)return self.setNgModelValue(self.focusDate),void event.preventDefault();var date=self.getFocusDateFromKeyEvent(event);date&&(date=self.boundDateByMinAndMax(date),event.preventDefault(),event.stopPropagation(),self.changeDisplayDate(date).then(function(){self.focus(date)}))})},CalendarCtrl.prototype.setNgModelValue=function(date){this.$scope.$emit("rop-calendar-change",date),this.setRangeCalendarDate(date),this.ngModelCtrl.$setViewValue(date),this.ngModelCtrl.$render()},CalendarCtrl.prototype.boundDateByMinAndMax=function(date){var boundDate=date;return"0"!=this.rangeCalendar&&this.minDate&&date<this.minDate&&(boundDate=new Date(this.minDate.getTime())),"1"!=this.rangeCalendar&&this.maxDate&&date>this.maxDate&&(boundDate=new Date(this.maxDate.getTime())),boundDate},CalendarCtrl.prototype.buildInitialCalendarDisplay=function(){this.buildWeekHeader(),this.displayDate=this.selectedDate||this.today,this.isInitialized=!0,this.generateContent(),this.focus(this.displayDate)},CalendarCtrl.prototype.buildWeekHeader=function(){for(var firstDayOfWeek=this.dateLocale.firstDayOfWeek,shortDays=this.dateLocale.shortDays,row=document.createElement("tr"),i=0;i<7;i++){var th=document.createElement("th");th.textContent=shortDays[(i+firstDayOfWeek)%7],row.appendChild(th)}this.$element.find("thead").append(row)},CalendarCtrl.prototype.getFocusDateFromKeyEvent=function(event){var dateUtil=this.dateUtil,keyCode=this.keyCode;switch(event.which){case keyCode.RIGHT_ARROW:return dateUtil.incrementDays(this.focusDate,1);case keyCode.LEFT_ARROW:return dateUtil.incrementDays(this.focusDate,-1);case keyCode.DOWN_ARROW:return event.metaKey?dateUtil.incrementMonths(this.focusDate,1):dateUtil.incrementDays(this.focusDate,7);case keyCode.UP_ARROW:return event.metaKey?dateUtil.incrementMonths(this.focusDate,-1):dateUtil.incrementDays(this.focusDate,-7);case keyCode.PAGE_DOWN:return dateUtil.incrementMonths(this.focusDate,1);case keyCode.PAGE_UP:return dateUtil.incrementMonths(this.focusDate,-1);case keyCode.HOME:return dateUtil.getFirstDateOfMonth(this.focusDate);case keyCode.END:return dateUtil.getLastDateOfMonth(this.focusDate);default:return null}},CalendarCtrl.prototype.focus=function(opt_date){var date=opt_date||this.selectedDate||this.today,previousFocus=this.calendarElement.querySelector(".rop-focus");previousFocus&&previousFocus.classList.remove(FOCUSED_DATE_CLASS);var cellId=this.getDateId(date),cell=document.getElementById(cellId);cell&&(cell.classList.add(FOCUSED_DATE_CLASS),cell.focus()),this.focusDate=date},CalendarCtrl.prototype.incrementMonth=function(numberOfMonths){this.displayDate=this.dateUtil.incrementMonths(this.displayDate,numberOfMonths),this.generateContent()},CalendarCtrl.prototype.getDateId=function(date){return["rop",this.id,date.getFullYear(),date.getMonth(),date.getDate()].join("-")},CalendarCtrl.prototype.getMonthHeader=function(){return this.dateLocale.monthHeaderFormatter(this.displayDate)},CalendarCtrl.prototype.generateContent=function(){this.displayDate&&(this.$calendarBody.empty(),this.$calendarBody.append(this.buildCalendarForMonth(this.displayDate)),this.focusAfterAppend&&(this.focusAfterAppend.classList.add(FOCUSED_DATE_CLASS),this.focusAfterAppend.focus(),this.focusAfterAppend=null))},CalendarCtrl.prototype.buildCalendarForMonth=function(opt_dateInMonth){var date=this.dateUtil.isValidDate(opt_dateInMonth)?opt_dateInMonth:new Date,firstDayOfMonth=this.dateUtil.getFirstDateOfMonth(date),firstDayOfTheWeek=this.getLocaleDay_(firstDayOfMonth),monthBody=document.createDocumentFragment(),row=document.createElement("tr");monthBody.appendChild(row);for(var rowIndex=0;rowIndex<6;rowIndex++){row=document.createElement("tr"),monthBody.appendChild(row);for(var dayIndex=0;dayIndex<7;dayIndex++){var dateOfMonth=this.dateUtil.incrementDays(firstDayOfMonth,7*rowIndex+dayIndex-firstDayOfTheWeek),cellOfDate=this.buildDateCell(dateOfMonth);row.appendChild(cellOfDate)}}return monthBody},CalendarCtrl.prototype.buildDateCell=function(opt_date){var calendarCtrl=this,cell=document.createElement("td");if(cell.tabIndex=-1,cell.classList.add("rop-calendar-date"),opt_date){cell.setAttribute("tabindex","-1"),cell.id=calendarCtrl.getDateId(opt_date),cell.setAttribute("data-timestamp",opt_date.getTime()),this.dateUtil.isSameDay(opt_date,calendarCtrl.today)&&cell.classList.add(TODAY_CLASS),this.dateUtil.isSameMonthAndYear(opt_date,calendarCtrl.displayDate)||cell.classList.add("rop-calendar-date-overflow"),this.dateUtil.isValidDate(calendarCtrl.selectedDate)&&this.dateUtil.isSameDay(opt_date,calendarCtrl.selectedDate)&&cell.classList.add(SELECTED_DATE_CLASS);var cellText=this.dateLocale.dates[opt_date.getDate()];if(this.rangeCalendar){var selectionIndicator=document.createElement("span");cell.appendChild(selectionIndicator),selectionIndicator.classList.add("rop-calendar-date-selection-indicator"),selectionIndicator.textContent=cellText,calendarCtrl.focusDate&&this.dateUtil.isSameDay(opt_date,calendarCtrl.focusDate)&&(this.focusAfterAppend=cell),angular.isFunction(this.dateFilter)&&!this.dateFilter(opt_date)||"0"==this.rangeCalendar&&opt_date>this.maxDate||"1"==this.rangeCalendar&&opt_date<this.minDate?cell.classList.add("rop-calendar-date-disabled"):(cell.addEventListener("click",calendarCtrl.cellClickHandler),this.dateUtil.isDateWithinRange(opt_date,this.minDate,this.maxDate)&&(cell.classList.add(IN_RANGE_CLASS),this.dateUtil.isSameDay(opt_date,this.minDate)?"0"==this.rangeCalendar?cell.classList.add(RANGE_START_CLASS):"1"==this.rangeCalendar&&cell.classList.add(MILESTONE_START_CLASS):this.dateUtil.isSameDay(opt_date,this.maxDate)&&("0"==this.rangeCalendar?cell.classList.add(MILESTONE_END_CLASS):"1"==this.rangeCalendar&&cell.classList.add(RANGE_END_CLASS))))}else if(this.isDateEnabled(opt_date)){var selectionIndicator=document.createElement("span");cell.appendChild(selectionIndicator),selectionIndicator.classList.add("rop-calendar-date-selection-indicator"),selectionIndicator.textContent=cellText,cell.addEventListener("click",calendarCtrl.cellClickHandler),calendarCtrl.focusDate&&this.dateUtil.isSameDay(opt_date,calendarCtrl.focusDate)&&(this.focusAfterAppend=cell)}else cell.classList.add("rop-calendar-date-disabled"),cell.textContent=cellText}return cell},CalendarCtrl.prototype.isDateEnabled=function(opt_date){return this.dateUtil.isDateWithinRange(opt_date,this.minDate,this.maxDate)&&(!angular.isFunction(this.dateFilter)||this.dateFilter(opt_date))},CalendarCtrl.prototype.getLocaleDay_=function(date){return(date.getDay()+(7-this.dateLocale.firstDayOfWeek))%7},CalendarCtrl.prototype.setRangeCalendarDate=function(date){"0"==this.rangeCalendar?this.minDate=this.dateUtil.createDateAtMidnight(date):"1"==this.rangeCalendar&&(this.maxDate=this.dateUtil.createDateAtMidnight(date))}}(window.angular);