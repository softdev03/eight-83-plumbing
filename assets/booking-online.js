const email = 'someone@anagency.com.au';
const password = 'ZA!D5.mT5u6ahUD';
const credentials = btoa(`${email}:${password}`);
let jobDescription = '';
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
    const serviceItemsWrapper = document.querySelector('.shopify-section--booking-service .booking-service-items-list');
    const serviceItems = serviceItemsWrapper.querySelectorAll('.booking-service-item');
    const serviceNext = document.querySelector('.shopify-section--booking-service .next-step');
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
    const scheduleEndDate = document.querySelector('.shopify-section--booking-time .date-time-wrapper .end-date-time');
    const dateError = document.querySelector('.shopify-section--booking-time .start-date-error');
    const endDateError = document.querySelector('.shopify-section--booking-time .end-date-error');
    const scheduleNext = document.querySelector('.shopify-section--booking-time .book-call');
    const processErrorMessage = document.querySelector('.shopify-section--booking-time .process-error-message');

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
            if(validateEmail(emailAddress.value)) {
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
            roomNameElem.innerHTML = `${data.jobItem.place[roomName]} ${roomName}(s)`;
        });
    }
    jobPrev.addEventListener('click', (e) => {
        e.preventDefault();

        jobPrev.closest('.booking-online').classList.remove('show');
        document.querySelector(jobPrev.getAttribute('href')).closest('.booking-online').classList.add('show');
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
    });
    scheduleDate.addEventListener('change', () => {
        const inputDate = new Date(scheduleDate.value);
        const now = new Date();
        if (inputDate < now) {
            dateError.classList.add('show');
            data.scheduleDate.date = '';
        } else {
            dateError.classList.remove('show');
            data.scheduleDate.date = scheduleDate.value;
        }
    });
    scheduleEndDate.addEventListener('change', () => {
        const inputDate = new Date(scheduleEndDate.value);
        const startDate = new Date(scheduleDate.value);
        const now = new Date();
        if (inputDate < now || inputDate < startDate) {
            endDateError.classList.add('show');
            data.scheduleDate.endDate = '';
        } else {
            endDateError.classList.remove('show');
            data.scheduleDate.endDate = scheduleEndDate.value;
        }
    });
    scheduleNext.addEventListener('click', () => {
        if (data.scheduleDate.date && data.scheduleDate.endDate) {
            scheduleNext.innerHTML = scheduleNext.getAttribute('processing_text');
            createNewJob(data).then(res => {
                if (res) {
                    getJobList().then(res => {
                        const job = checkMyJob(res);
                        createJobContact({email: data.jobItem.emailAddress,jobId:job.uuid});
                        bookSchedule(data.scheduleDate.date,data.scheduleDate.endDate,job.uuid).then(res=>{
                            showResult(res);
                        }).catch(err=>{
                            showResult(false);
                        });
                    }).catch(err => {
                        showResult(false);
                    });
                }
            }).catch(err=>{
                showResult(false);
            });
        }
    });


    const showResult = (result) => {
        scheduleNext.innerHTML = scheduleNext.getAttribute('proceed_text');
        if(result) {
            processErrorMessage.classList.remove('show');
        } else {
            processErrorMessage.classList.add('show');
        }
        // location.href = '';
    }
});
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
const checkMyJob = (jobList) => {
    const newJobDescription = jobDescription.toLocaleLowerCase().replace(' ', '').replace('\n', '');
    for (const job of jobList) {
        const newJobDescriptionFromServer = job.job_description.toLocaleLowerCase().replace(' ', '').replace('\n', '');
        if (newJobDescription === newJobDescriptionFromServer) {
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
        Cleaning Service: ${information.jobItem.cleanServiceItem}
        ${place}
        `;
        const jobData = {
            "status": "Quote",
            "job_address": information.jobItem.address,
            "date": information.scheduleDate.date,
            "job_description": jobDescription
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
const createJobContact = ({email,jobId}) => {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Basic ${credentials}`
        },
        body: JSON.stringify({email,job_uuid: jobId,type: 'Job Contact'})
    };
    fetch('https://api.servicem8.com/api_1.0/jobcontact.json',options).then(res=>res.json()).then(res=>{
    }).catch(err=>{
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
    return new Promise((resolve,reject)=>{
        fetch('https://api.servicem8.com/api_1.0/staff.json',getOption).then(res=>res.json()).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(false);
        });
    });
}
const getCurrentStaff = (staffList) => {
    for (const staff of staffList) {
        if(staff.email === email) {
            return staff;
        }
    }
    return null;
}
const bookSchedule = (date, endDate, jobId) => {
    return new Promise((resolve,reject)=>{
        getStaffList().then(res=>{
            const currentStaff = getCurrentStaff(res);
            const data = {
                job_uuid: jobId,
                staff_uuid: currentStaff.uuid,
                start_date: formatDate(date),
                end_date: formatDate(endDate),
                active: 1
            };
            console.log(data);
            const options = {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify(data)
            };
            fetch('https://api.servicem8.com/api_1.0/jobactivity.json', options).then(res => res.json()).then(res => {
                if(res.errorCode === 0) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }).catch(err => reject(false));
        }).catch(err=>{
            reject(false);
        });
    });
}
const formatDate = (input) => {
    const dateObj = new Date(input);
    
    // Step 2: Get the components of the date and time
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    // Step 3: Determine AM/PM and convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;  // Convert to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Step 4: Format the date and time
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    
    return formattedDateTime;
}