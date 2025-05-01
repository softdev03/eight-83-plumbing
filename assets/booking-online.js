const email = 'someone@anagency.com.au';
const password = 'ZA!D5.mT5u6ahUD';
const credentials = btoa(`${email}:${password}`);
let jobDescription = '';
let newAddress = '';
const getOption = {
	method: 'GET',
	headers: {
		'accept': 'application/json',
		'Authorization': `Basic ${credentials}`
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const data = {
		serviceItem: {},
		jobItem: {},
		scheduleDate: {}
	};
	const bookingServiceFirstStep = document.querySelector('.shopify-booking-service');
	const serviceItemsWrapper = bookingServiceFirstStep.querySelector('.shopify-section--booking-service .booking-service-items-list');
	const serviceItems = serviceItemsWrapper.querySelectorAll('.booking-service-item');
	const serviceNext = bookingServiceFirstStep.querySelector('.shopify-section--booking-service .next-step');
	const jobAddress = document.querySelector('.shopify-section--booking-job .job-address-input');
	const jobAddressError = document.querySelector('.shopify-section--booking-job .job-address-error');
	const emailAddress = document.querySelector('.shopify-section--booking-job .email-address-input');
	const emailAddressError = document.querySelector('.shopify-section--booking-job .email-address-error');
	const cleanServiceItemWrapper = document.querySelector('.shopify-section--booking-job .cleaning-service-items');
	const cleanServiceItems = cleanServiceItemWrapper.querySelectorAll('.cleaning-service-item');
	const cleanServiceItemError = document.querySelector('.shopify-section--booking-job .cleaning-service-error')
	const jobRooms = document.querySelectorAll('.shopify-section--booking-job .room');
	const jobPrev = document.querySelector('.shopify-section--booking-job .back-step');
	const jobNext = document.querySelector('.shopify-section--booking-job .next-step');
	const scheduleDate = document.querySelector('.shopify-section--booking-time .date-time-wrapper .start-date-time');
	const dateError = document.querySelector('.shopify-section--booking-time .date-error');
	const scheduleNext = document.querySelector('.shopify-section--booking-time .book-call');
	const processErrorMessage = document.querySelector('.shopify-section--booking-time .process-error-message');
	const clientEmail = bookingServiceFirstStep.getAttribute('client-email');
	const confirmMessage = bookingServiceFirstStep.getAttribute('confirm-message');
	bookingServiceFirstStep.removeAttribute('client-email');
	bookingServiceFirstStep.removeAttribute('confirm-message');

	for (const serviceItem of serviceItems) {
		serviceItem.addEventListener('click', () => {
			serviceItemsWrapper.querySelectorAll('.booking-service-item.selected').forEach(selectedItem => {
				selectedItem.classList.remove('selected');
			});
			serviceItem.classList.add('selected');
			data.serviceItem['price'] = parseFloat(serviceItem.getAttribute('price'));
			data.serviceItem['name'] = serviceItem.querySelector('.service-name')?.innerHTML;
			if (serviceNext.classList.contains('disable')) {
				serviceNext.classList.remove('disable');
			}
		});
	}
	serviceNext.addEventListener('click', (e) => {
		e.preventDefault();
		if (!serviceNext.classList.contains('disable')) {
			serviceNext.closest('.booking-online').classList.remove('show');

			const target = document.querySelector(serviceNext.getAttribute('href')).closest('.booking-online');
			target.classList.add('show');
			document.documentElement.scrollTo({ top: 0 });
		}
	});
	jobAddress.addEventListener('keyup', () => {
		data.jobItem.address = jobAddress.value;
		if (jobAddress.value === '') {
			jobAddressError.classList.add('show');
		} else {
			jobAddressError.classList.remove('show');
		}
	});
	emailAddress.addEventListener('keyup', () => {
		data.jobItem.emailAddress = emailAddress.value;
		if (emailAddress.value === '') {
			emailAddressError.classList.add('show');
		} else {
			if (validateEmail(emailAddress.value)) {
				emailAddressError.classList.remove('show');
			} else {
				emailAddressError.classList.add('show');
				data.jobItem.emailAddress = '';
			}
		}
	});
	for (const cleanServiceItem of cleanServiceItems) {
		cleanServiceItem.addEventListener('click', () => {
			cleanServiceItemWrapper.querySelectorAll('.cleaning-service-item.selected').forEach(selectedItem => {
				selectedItem.classList.remove('selected');
			});
			cleanServiceItem.classList.add('selected');
			data.jobItem.cleanServiceItem = cleanServiceItem.innerHTML;
		});
	}
	data.jobItem.place = {};
	for (const jobRoom of jobRooms) {
		const roomNameElem = jobRoom.querySelector('.room-name');
		const roomName = roomNameElem.getAttribute('native');
		data.jobItem.place[roomName] = 0;
		jobRoom.querySelector('.minus').addEventListener('click', () => {
			data.jobItem.place[roomName]--;
			if (data.jobItem.place[roomName] <= 0) {
				data.jobItem.place[roomName] = 0;
			}
			roomNameElem.innerHTML = `${data.jobItem.place[roomName]} ${roomName}(s)`;
		});
		jobRoom.querySelector('.plus').addEventListener('click', () => {
			data.jobItem.place[roomName]++;
			roomNameElem.innerHTML = `${data.jobItem.place[roomName]} of ${roomName}`;
		});
	}
	jobPrev.addEventListener('click', (e) => {
		e.preventDefault();

		jobPrev.closest('.booking-online').classList.remove('show');
		document.querySelector(jobPrev.getAttribute('href')).closest('.booking-online').classList.add('show');
		document.documentElement.scrollTo({ top: 0 });
	});
	jobNext.addEventListener('click', (e) => {
		e.preventDefault();
		if (data.jobItem.address) {
			jobAddressError.classList.remove('show');
		} else {
			jobAddressError.classList.add('show');
			return;
		}
		if (data.jobItem.emailAddress) {
			emailAddressError.classList.remove('show');
		} else {
			emailAddressError.classList.add('show');
			return;
		}
		if (!data.jobItem.cleanServiceItem) {
			cleanServiceItemError.classList.add('show');
			return;
		} else {
			cleanServiceItemError.classList.remove('show');
		}
		if (data.jobItem.address && data.jobItem.cleanServiceItem) {
			jobNext.closest('.booking-online').classList.remove('show');
			document.querySelector(jobNext.getAttribute('href')).closest('.booking-online').classList.add('show');
		}
		document.documentElement.scrollTo({ top: 0 });
	});

	let isProcessing = false;
	scheduleNext.addEventListener('click', () => {
		if (isProcessing) {
			return;
		}
		data.scheduleDate.date = calendar.getDateTime();
		const { year, month, hour, minute, date } = calendar.getDateTimeAsObject();
		const now = new Date();
		const inputDate = new Date(year, month - 1, date, hour, minute);
		if (now > inputDate) {
			dateError.classList.add('show');
			return;
		} else {
			dateError.classList.remove('show');
		}
		if (data.scheduleDate.date) {
			scheduleNext.innerHTML = scheduleNext.getAttribute('processing_text');
			isProcessing = true;
			newAddress = data.jobItem.address;
			createNewJob(data).then(res => {
				if (res) {
					getJobList().then(res => {
						const job = checkMyJob(res);
						createJobContact({ email: data.jobItem.emailAddress, jobId: job.uuid });
						bookSchedule(data.scheduleDate.date, job.uuid).then(res => {
							sendNotification(job.uuid,data.jobItem.emailAddress,clientEmail,confirmMessage).then(res1 => {
								showResult(res);
							}).catch(err => {
								showResult(false);
							});
						}).catch(err => {
							showResult(false);
						});
					}).catch(err => {
						showResult(false);
					});
				}
			}).catch(err => {
				showResult(false);
			});
		}
	});


	const showResult = (result) => {
		scheduleNext.innerHTML = scheduleNext.getAttribute('proceed_text');
		if (result) {
			processErrorMessage.classList.remove('show');
			location.href = '';
		} else {
			processErrorMessage.classList.add('show');
		}
		isProcessing = false;
	}
	const hTime = setInterval(() => {
		clearInterval(hTime);
		document.documentElement.scrollTo({ top: 0 });
	}, 1200);

	calendar.init('#custom-calendar', { startYear: 1990, lastYear: 2990 });
});
const validateEmail = (email) => {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
}
const checkMyJob = (jobList) => {
	const newJobDescription = jobDescription.toLocaleLowerCase().replace(' ', '').replace('\n', '');
	for (const job of jobList) {
		const newJobDescriptionFromServer = job.job_description.toLocaleLowerCase().replace(' ', '').replace('\n', '');
		if (newJobDescription === newJobDescriptionFromServer && newAddress === job.job_address) {
			return job;
		}
	}
}
const createNewJob = (information) => {
	return new Promise((resolve, reject) => {
		let place = '';
		for (const key in information.jobItem.place) {
			place += `${key} : ${information.jobItem.place[key]}\n`;
		}
		jobDescription = `Plumbing Service: ${information.serviceItem.name}  $${information.serviceItem.price}
        Plumbing Service: ${information.jobItem.cleanServiceItem}
        ${place}
        Schedule Date: ${information.scheduleDate.date}
        `;
		const jobData = {
			"status": "Quote",
			"job_address": information.jobItem.address,
			"date": information.scheduleDate.date,
			"job_description": jobDescription,
			"job_is_scheduled_until_stamp": information.scheduleDate.date
		};
		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
				authorization: `Basic ${credentials}`
			},
			body: JSON.stringify(jobData)
		};
		fetch('https://api.servicem8.com/api_1.0/job.json', options)
			.then(response => response.json())  // Parse the response as JSON
			.then(data => {
				if (data.errorCode === 0) {
					resolve(true)
				} else {
					reject(false)
				}
			})
			.catch(error => {
				reject(false);
			});
	});
}
const createJobContact = ({ email, jobId }) => {
	const options = {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
			authorization: `Basic ${credentials}`
		},
		body: JSON.stringify({ email, job_uuid: jobId, type: 'Job Contact' })
	};
	fetch('https://api.servicem8.com/api_1.0/jobcontact.json', options).then(res => res.json()).then(res => {
	}).catch(err => {
	});
}
const getJobList = () => {
	return new Promise((resolve, reject) => {
		fetch('https://api.servicem8.com/api_1.0/job.json', getOption)
			.then(res => res.json())
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			});
	});
}
const getStaffList = () => {
	return new Promise((resolve, reject) => {
		fetch('https://api.servicem8.com/api_1.0/staff.json', getOption).then(res => res.json()).then(res => {
			resolve(res);
		}).catch(err => {
			reject(false);
		});
	});
}
const getCurrentStaff = (staffList) => {
	for (const staff of staffList) {
		if (staff.email === email) {
			return staff;
		}
	}
	return null;
}
const bookSchedule = (date, jobId) => {
	return new Promise((resolve, reject) => {
		getStaffList().then(res => {
			const currentStaff = getCurrentStaff(res);
			const scheduleDate = getDate(date);
			const data = {
				job_uuid: jobId,
				staff_uuid: currentStaff.uuid,
				start_date: scheduleDate.start,
				end_date: scheduleDate.end,
				active: 1,
				activity_was_scheduled: 1
			};
			const options = {
				method: 'POST',
				headers: {
					'accept': 'application/json',
					'Authorization': `Basic ${credentials}`
				},
				body: JSON.stringify(data)
			};
			fetch('https://api.servicem8.com/api_1.0/jobactivity.json', options).then(res => res.json()).then(res => {
				if (res.errorCode === 0) {
					resolve(true);
				} else {
					reject(false);
				}
			}).catch(err => reject(false));
		}).catch(err => {
			reject(false);
		});
	});
}
const getDate = (input) => {
	const splitData = input.split('T');
	const [year,month,date] = splitData[0].split('-');
	let [hour,minute] = splitData[1].split('-');

	let rest = minute % 15;
	if(rest > 7) {
		rest = 15 - rest;
		minute = parseInt(minute) + rest;
	} else {
		minute -= rest;
	}
	const startDateObj = new Date(year,month - 1,date,parseInt(hour),minute);
	const endDateObj = new Date(year,month -1,date,parseInt(hour) + 1,minute);
	const startDate = `${startDateObj.getFullYear()}-${startDateObj.getMonth() + 1}-${startDateObj.getDate()} ${startDateObj.getHours()}:${startDateObj.getMinutes()}:00`;
	const endDate = `${endDateObj.getFullYear()}-${endDateObj.getMonth() + 1}-${endDateObj.getDate()} ${endDateObj.getHours()}:${endDateObj.getMinutes()}:00`;

	return {
		start: startDate,
		end: endDate
	};
}
const sendNotification = (jobId,email,clientEmail,message) => {
	return new Promise((resolve, reject) => {
		const htmlBody = message.split('[email]').join(email);
		const options = {
			method: 'POST',
			headers: {accept: 'application/json', 'content-type': 'application/json','Authorization': `Basic ${credentials}`},
			body: JSON.stringify({
				to: clientEmail,
				replyTo: email,
				subject: 'Notification for booking',
				htmlBody,
				regardingJobUUID: jobId
			})
		};
		
		fetch('https://api.servicem8.com/platform_service_email', options).then(res => res.json()).then(res => {
			resolve(true);
		}).catch(err => {
			reject(false);
		});
	});
}