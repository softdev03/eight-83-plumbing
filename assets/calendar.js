const calendar = {
	forwardMonth: function () {
		this.setMonth(this.data.month + 1);
		const lastDate = this.getLastDate(this.data.year, this.data.month);
		if (this.data.date > lastDate) {
			this.setDate(lastDate);
		}
	},
	backwardMonth: function () {
		this.setMonth(this.data.month - 1);
		const lastDate = this.getLastDate(this.data.year, this.data.month);
		if (this.data.date > lastDate) {
			this.setDate(this.lastDate);
		}
	},
	getDateTime: function () {
		let date = `${this.data.year}-${this.data.month < 10 ? '0' + this.data.month : this.data.month}-${this.data.date < 10 ? '0' + this.data.date : this.data.date}T${this.data.isPM ? this.data.hour + 12 : (this.data.hour === 12 ? '00' : (this.data.hour < 10 ? '0' + this.data.hour : this.data.hour))}-${this.data.minute < 10 ? '0' + this.data.minute : this.data.minute}`;
		return date;
	},
	getDateTimeAsObject: function () {
		return {
			year: this.data.year,
			month: this.data.month,
			date: this.data.date,
			hour: this.data.isPM ? this.data.hour + 12 : this.data.hour === 12 ? 0 : this.data.hour,
			minute: this.data.minute
		};
	},
	getCalendarState: function () {
		return this.data.state;
	},
	getLastDate: function (year, month) {
		let lastDate = 0;
		if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
			lastDate = 31;
		} else if (month === 4 || month === 6 || month === 9 || month === 11) {
			lastDate = 30;
		} else {
			if (year % 4 === 0) {
				lastDate = 29;
			} else {
				lastDate = 28;
			}
		}
		return lastDate;
	},
	createElement: function (selector) {
		if (selector) {
			const tempCalendar = document.querySelector(selector);
			if (tempCalendar) {
				this.data.calendarEl = tempCalendar;
				this.initDate();
				const upArrow = tempCalendar.getAttribute('upArrow');
				const downArrow = tempCalendar.getAttribute('downArrow');
				tempCalendar.removeAttribute('upArrow');
				tempCalendar.removeAttribute('downArrow');
				this.data.calendarEl.innerHTML = `
                    ${this.createCalendar(upArrow, downArrow)}
                    ${this.createClock()}
                `;
				this.data.state = 1;
			}
			return true;
		}
		return false;
	},
	createClock: function () {
		const isPM = (new Date()).getHours() >= 12 ? true : false;
		return `
            <div class='clock'>
                ${this.createHours()}
                ${this.createMinutes()}
                <div class='pm-selector'>
                    <p class='m-0 clock-slider-item ${!isPM ? 'selected' : ''} am'>AM</p>
                    <p class='m-0 clock-slider-item pm ${isPM ? 'selected' : ''}'>PM</p>
                </div>
            </div>
        `;
	},
	createHours: function () {
		let thisHour = (new Date()).getHours();
		thisHour = thisHour > 12 ? thisHour - 12 : thisHour;
		thisHour = thisHour === 0 ? 12 : thisHour;
		let hourList = '';
		for (let i = 1; i < 13; i++) {
			hourList += `<p class='swiper-slide ${thisHour === i ? 'selected' : ''} clock-slider-item m-0 hour-item' index='${i - 1}'>${i < 10 ? '0' + i : i}</p>`;
		}
		return `
            <div class='hour-slider'>
                <div class='swiper-wrapper'>${hourList}</div>
            </div>
        `;
	},
	createMinutes: function () {
		const thisMinute = (new Date()).getMinutes();
		this.setMinute(thisMinute);
		let minuteList = '';
		for (let i = 0; i < 60; i++) {
			minuteList += `<p class='swiper-slide clock-slider-item m-0 minute-item ${thisMinute === i ? 'selected' : ''}' index='${i}'>${i < 10 ? '0' + i : i}</p>`;
		}
		return `
            <div class='minute-slider'>
                <div class='swiper-wrapper'>${minuteList}</div>
            </div>
        `;
	},
	createCalendar: function (upArrow, bottomArrow) {
		return `<div class='calendar'>
                    <div class='calendar-heading'>
                        <div class="year-month">
                            <p class="m-0 month">${this.data.monthArr[this.data.month - 1]}</p>
                            <p class="m-0 year">${this.data.year}</p>
                        </div>
                        <div class="buttons">
                            <div class="arrow-direction top">
                                <img src='${upArrow}' width = "30px" height="30px" />
                            </div>
                            <div class="arrow-direction down">
                                <img src='${bottomArrow}' width = "30px" height="30px" />
                            </div>
                        </div>
                    </div>
                    <div class='calendar-content'>
                        ${this.createYearList()}
                        ${this.createMonth()}
                    </div>
                </div>`;
	},
	createYearList: function () {
		let yearList = '';
		for (let i = this.data.startYear; i <= this.data.lastYear; i++) {
			let monthList = '';
			let selected = '';
			const currentMonthIndex = this.data.month - 1;
			for (const [index, monthItem] of this.data.monthArr.entries()) {
				selected = '';
				if (i === this.data.year && index === currentMonthIndex) {
					selected = 'selected this-month';
				}
				monthList += `
                    <p class='month-item m-0 text-upper ${selected}' month='${index}'>${monthItem.substring(0, 3)}</p>
                `;
			}
			yearList += `
                <div class='year-item' year='${i}' index='${i - this.data.startYear}'>
                    <h1 class='year-item-heading m-0'>${i}</h1>
                    <div class='year-item-month'>${monthList}</div>
                </div>
            `;
		}
		return `<div class='calendar-year-list'>${yearList}</div>`;
	},
	createMonth: function () {
		let theader = '<tr>';
		for (const day of this.data.dayArr) {
			theader += `<th>${day.substring(0, 2)}</th>`;
		}
		theader += '</tr>';

		let tbody = '';
		for (let i = 0; i < 6; i++) {
			tbody += '<tr>';
			for (let j = 0; j < 7; j++) {
				tbody += '<td class="date-item"></td>';
			}
			tbody += '</tr>';
		}
		return `
            <table class='current-month-content'>
                ${theader}
                ${tbody}
            </table>
            <button class="init-today">Today</button>
        `;
	},
	drawCalendar: function () {
		this.data.state = 0;
		const firstDateDay = new Date(this.data.year, this.data.month - 1, 1).getDay();
		const dateItems = this.data.calendarEl.querySelectorAll('.date-item');
		let prevMonth = this.data.month === 1 ? 12 : this.data.month - 1;
		let prevYear = this.data.month === 1 ? this.data.year - 1 : this.data.year;
		const prevMonthLastDate = this.getLastDate(prevYear, prevMonth);
		const lastDatePos = this.getLastDate(this.data.year, this.data.month) + firstDateDay - 1;

		const today = new Date();
		const thisYear = today.getFullYear();
		const thisMonth = today.getMonth() + 1;
		const thisDate = today.getDate();
		for (let i = 0; i < 42; i++) {
			const index = i - firstDateDay;
			dateItems[i].classList.remove('selected');
			dateItems[i].classList.remove('today');
			const currentDate = index + 1;
			if (i < firstDateDay) {
				dateItems[i].innerHTML = prevMonthLastDate + currentDate;
				dateItems[i].classList.add('out');
			} else if (i > lastDatePos) {
				dateItems[i].classList.add('out');
				dateItems[i].innerHTML = i - lastDatePos;
			} else {
				dateItems[i].innerHTML = currentDate;
				dateItems[i].classList.remove('out');

				if (this.data.year === thisYear && this.data.month === thisMonth && currentDate === thisDate) {
					dateItems[i].classList.add('today');
					if (thisDate === this.data.date) {
						dateItems[i].classList.add('selected');
					}
				} else if (currentDate === this.data.date) {
					dateItems[i].classList.add('selected');
				}
			}
			dateItems[i].setAttribute('index', index);
		}
	},
	init: function (selector, { startYear, lastYear }) {
		this.setRange(startYear, lastYear);
		if (this.createElement(selector)) {
			this.drawCalendar();
			this.initEvent();
		}
	},
	initYearListScroll: function () {
		const selectedItem = this.data.calendarEl.querySelector('.month-item.selected');
		const accordionItem = selectedItem.closest('.year-item');
		const index = parseInt(accordionItem.getAttribute('index'));
		const itemHeight = accordionItem.querySelector('.year-item-heading').offsetHeight;
		const container = accordionItem.closest('.calendar-year-list');
		accordionItem.querySelector('.year-item-heading').click();
		container.scrollTo(0, 0);
		container.scrollTo(0, index * itemHeight);
	},
	initDate: function () {
		const now = new Date();
		this.setYear(now.getFullYear());
		this.setMonth(now.getMonth() + 1);
		this.setDate(now.getDate());
		this.setHour(now.getHours());
		this.setMinute(now.setMinutes());
	},
	initEvent: function () {
		const hourSlider = new Swiper('.shopify-section--booking-time .hour-slider', {
			direction: "vertical",
			loop: true,
			slidesPerView: "auto",
			spaceBetween: 10,
		});
		const minuteSlider = new Swiper('.shopify-section--booking-time .minute-slider', {
			direction: "vertical",
			loop: true,
			slidesPerView: "auto",
			spaceBetween: 10,
		});

		const hourIndex = parseInt(this.data.calendarEl.querySelector('.hour-item.selected').getAttribute('index'));
		const minuteIndex = parseInt(this.data.calendarEl.querySelector('.minute-item.selected').getAttribute('index'));
		hourSlider.slideTo(hourIndex);
		minuteSlider.slideTo(minuteIndex);

		const yearList = this.data.calendarEl.querySelector('.calendar-year-list');
		const dateItems = this.data.calendarEl.querySelectorAll('.date-item');
		const tempCalendar = this;
		document.addEventListener('click', (e) => {
			if (e.target.classList.contains('year-month') || e.target.closest('.year-month')) {
				if (!yearList.classList.contains('show')) {
					yearList.classList.add('show');
					const hTime = setInterval(() => {
						clearInterval(hTime);
						tempCalendar.initYearListScroll();
					}, 100);
				}
			} else if (e.target.classList.contains('date-item')) {
				if (e.target.classList.contains('out')) {
					let index = parseInt(e.target.getAttribute('index'));
					if (index > 0) {
						index++;
					}
					tempCalendar.setDate(index);
					tempCalendar.drawCalendar();
				} else {
					dateItems.forEach(item => {
						item.classList.remove('selected');
					});
					e.target.classList.add('selected');
					let index = parseInt(e.target.getAttribute('index'));
					if (index > 0) {
						index++;
					}
					tempCalendar.setDate(index);
				}
			} else if (e.target.classList.contains('arrow-direction') || e.target.closest('.arrow-direction')) {
				if (!yearList.classList.contains('show')) {
					if (e.target.classList.contains('top') || e.target.closest('.top')) {
						tempCalendar.setMonth(tempCalendar.data.month > 1 ? tempCalendar.data.month - 1 : -1);
						tempCalendar.drawCalendar();
					} else if (e.target.classList.contains('down') || e.target.closest('.down')) {
						tempCalendar.setMonth(tempCalendar.data.month + 1);
						tempCalendar.drawCalendar();
					}
				}
			} else if (e.target.classList.contains('init-today')) {
				const now = new Date();
				tempCalendar.setYear(now.getFullYear());
				tempCalendar.setMonth(now.getMonth() + 1);
				tempCalendar.setDate(now.getDate());
				tempCalendar.drawCalendar();
			} else if (e.target.classList.contains('year-item-heading')) {
				const accordionItems = tempCalendar.data.calendarEl.querySelectorAll('.year-item');
				accordionItems.forEach(item => {
					if (item.classList.contains('open')) {
						item.classList.remove('open');
						const accordionContent = item.querySelector('.year-item-month');
						accordionContent.style.height = '0px';
						accordionContent.style.padding = '0px';
					}
				});
				const thisAccordion = e.target.closest('.year-item');
				thisAccordion.classList.add('open');
				const accordionContent = thisAccordion.querySelector('.year-item-month');
				accordionContent.style.height = `${accordionContent.scrollHeight}px`;
				accordionContent.style.padding = '3px 0px';
			} else if (e.target.classList.contains('hour-item')) {
				if (!e.target.classList.contains('selected')) {
					tempCalendar.data.calendarEl.querySelector('.hour-item.selected')?.classList.remove('selected');
					e.target.classList.add('selected');
					tempCalendar.setHour(parseInt(e.target.innerHTML));
				}
			} else if (e.target.classList.contains('minute-item')) {
				if (!e.target.classList.contains('selected')) {
					tempCalendar.data.calendarEl.querySelector('.minute-item.selected')?.classList.remove('selected');
					e.target.classList.add('selected');
					tempCalendar.setMinute(parseInt(e.target.innerHTML));
				}
			} else if (e.target.classList.contains('clock-slider-item') && e.target.closest('.pm-selector')) {
				if (!e.target.classList.contains('selected')) {
					tempCalendar.data.calendarEl.querySelector('.pm-selector').querySelector('.clock-slider-item.selected')?.classList.remove('selected');
					e.target.classList.add('selected');
					tempCalendar.setPM(e.target.classList.contains('pm'));
				}
			} else if (e.target.classList.contains('month-item')) {
				tempCalendar.data.calendarEl.querySelector('.month-item.selected')?.classList.remove('selected');
				e.target.classList.add('selected');
			}
		});
		document.addEventListener('dblclick', (e) => {
			if (e.target.classList.contains('month-item')) {
				const month = parseInt(e.target.getAttribute('month')) + 1;
				const year = parseInt(e.target.closest('.year-item').getAttribute('year'));
				yearList.classList.remove('show');
				tempCalendar.setYear(year);
				tempCalendar.setMonth(month);
				tempCalendar.drawCalendar();
			}
		});
		const hourInterval = 3;
		this.data.calendarEl.querySelector('.hour-slider').addEventListener('wheel', (e) => {
			e.preventDefault();
			if (e.deltaY < 0) {
				for (let i = 0; i < hourInterval; i++) {
					hourSlider.slidePrev();
				}
			} else {
				for (let i = 0; i < hourInterval; i++) {
					hourSlider.slideNext();
				}
			}
		});
		const minuteInterval = 6;
		this.data.calendarEl.querySelector('.minute-slider').addEventListener('wheel', (e) => {
			e.preventDefault();
			if (e.deltaY < 0) {
				for (let i = 0; i < minuteInterval; i++) {
					minuteSlider.slidePrev();
				}
			} else {
				for (let i = 0; i < minuteInterval; i++) {
					minuteSlider.slideNext();
				}
			}
		});
	},
	setYear: function (y, directUpdate) {
		if (y >= this.data.startYear && y <= this.data.lastYear) {
			this.data.year = y;
			this.data.state = 1;
			this.setDay();
			if (this.data.calendarEl) {
				const year = this.data.calendarEl.querySelector('.year-month')?.querySelector('.year');
				if (year) {
					year.innerHTML = y;
				}
			}
		} else {
			this.data.state = -1;
		}
		if (!directUpdate) {
			this.updateYearList(this.data.year, this.data.month);
		}
		const lastDate = this.getLastDate(this.data.year, this.data.month);
		if (this.data.date > lastDate) {
			this.setDate(lastDate);
		}
	},
	setMonth: function (m, directUpdate) {
		if (m === -1) {
			this.data.month = 12;
			this.setYear(this.data.year - 1);
		} else if (m === 13) {
			this.data.month = 1;
			this.setYear(this.data.year + 1);
		} else {
			this.data.month = m;
		}
		this.data.state = 1;
		this.setDay();
		if (this.data.calendarEl) {
			const month = this.data.calendarEl.querySelector('.year-month')?.querySelector('.month');
			if (month) {
				month.innerHTML = this.data.monthArr[this.data.month - 1];
			}
		}
		if (!directUpdate) {
			this.updateYearList(this.data.year, this.data.month);
		}
		const lastDate = this.getLastDate(this.data.year, this.data.month);
		if (this.data.date > lastDate) {
			this.setDate(lastDate);
		}
	},
	setDate: function (d) {
		let max = this.getLastDate(this.data.year, this.data.month);
		if (d > max) {
			this.setMonth(this.data.month + 1);
			this.setDate(d - max);
		} else if (d < 0) {
			let prevMax = 0;
			if (this.data.month === 1 || this.data.month === 2 || this.data.month === 4 || this.data.month === 6 || this.data.month === 8 || this.data.month === 9 || this.data.month === 11) {
				prevMax = 31;
			} else if (this.data.month === 5 || this.data.month === 7 || this.data.month === 10 || this.data.month === 12) {
				prevMax = 30;
			} else {
				if (this.data.year % 4 === 0) {
					prevMax = 29;
				} else {
					prevMax = 28;
				}
			}
			this.setMonth(this.data.month > 1 ? this.data.month - 1 : -1);
			this.setDate(d + prevMax + 1);
		} else if (d !== 0) {
			this.data.date = d;
		}
		this.data.state = 1;
		this.setDay();
	},
	setDay: function () {
		const newDate = new Date(this.data.year, this.data.month - 1, this.data.date);
		this.data.day = newDate.getDay();
	},
	setHour: function (h) {
		if (h > 0 && h < 13) {
			this.data.hour = h;
		} else if (h === 0) {
			this.data.hour = 12;
			this.setPM(false);
		} else if (h > 12) {
			this.data.hour = h - 12;
			this.setPM(true);
		}
		this.data.state = 1;
	},
	setMinute: function (min) {
		if (min > -1 && min < 60) {
			this.data.minute = min;
		}
		this.data.state = 1;
	},
	setPM: function (isPM) {
		this.data.isPM = isPM;
		this.data.state = 1;
	},
	setRange: function (startYear, lastYear) {
		if (startYear <= lastYear) {
			this.data.startYear = startYear;
			this.data.lastYear = lastYear;
		}
	},
	updateYearList: function (y, m) {
		if (m < 1 || m > 12) {
			return;
		}
		if (this.data.calendarEl) {
			this.data.calendarEl.querySelector('.month-item.selected')?.classList.remove('selected');
			this.data.calendarEl.querySelector(`.year-item[year="${y}"]`)?.querySelectorAll('.month-item')[m - 1].classList.add('selected');;
		}
	},
	data: {
		calendarEl: null,
		dayArr: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		monthArr: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		year: 0,
		month: 0,
		date: 0,
		day: 0,
		hour: 0,
		minute: 0,
		isPM: false,
		startYear: 0,
		lastYear: 0,
		state: 0            //0: initial state, -1: no need to redraw calendar, 1: need to update calendar
	}
};