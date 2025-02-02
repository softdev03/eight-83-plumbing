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
    const cleanServiceItemWrapper = document.querySelector('.shopify-section--booking-job .cleaning-service-items');
    const cleanServiceItems = cleanServiceItemWrapper.querySelectorAll('.cleaning-service-item');
    const cleanServiceItemError = document.querySelector('.shopify-section--booking-job .cleaning-service-error')
    const jobRooms = document.querySelectorAll('.shopify-section--booking-job .room');
    const jobPrev = document.querySelector('.shopify-section--booking-job .back-step');
    const jobNext = document.querySelector('.shopify-section--booking-job .next-step');
    const scheduleDate = document.querySelector('.shopify-section--booking-time .date-time-wrapper .date-time');
    const dateError = document.querySelector('.shopify-section--booking-time .date-error');
    const scheduleNext = document.querySelector('.shopify-section--booking-time .book-call');

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
        } else {
            dateError.classList.remove('show');
        }
        data.scheduleDate.date = '';
    });
    scheduleNext.addEventListener('click', () => {
        if (data.scheduleDate.date) {
            console.log(data);
        }
    });


    const email = 'david.wang05061995@gmail.com';
    const password = 'yjs20050325#';
    const credentials = btoa(`${email}:${password}`);

    // const jobData = {
    //     uuid: '123e4567-e539-40c9-9ea4-21db0343830b',  // Unique identifier for the job (UUID)
    //     active: 1,  // Set to 1 to indicate the job is active
    //     created_by_staff_uuid: '123e4567-a9e9-4e78-8910-21db08c02ecb',  // UUID of the staff who created the job
    //     date: '2025-02-10',  // The date of the job (in YYYY-MM-DD format)
    //     company_uuid: '73b75e5d-a787-441d-bf8f-225e310c3c8b',  // UUID for the company
    //     job_address: '123 Main St, Springfield, IL',  // The address for the job location
    //     billing_address: '123 Main St, Springfield, IL',  // The billing address
    //     status: 'Quote',  // Status of the job (e.g., Scheduled, In Progress, Completed)
    //     job_description: 'Customer requested a home cleaning service for the kitchen and bathroom.',  // Description of the job
    //     work_done_description: 'Cleaned kitchen and bathroom, removed trash, wiped down surfaces.',  // Description of the work done
    //     lng: -89.6500,  // Longitude of the job location (GPS coordinates)
    //     lat: 39.7817,  // Latitude of the job location (GPS coordinates)
    //     generated_job_id: 'JOB-1001',  // A generated unique job ID (can be set manually or auto-generated)
    //     payment_date: '2025-02-10 15:00:00',  // Date and time of the payment (if applicable)
    //     payment_actioned_by_uuid: '123e4567-a547-45ae-a094-21db03087d5b',  // UUID of the staff who processed the payment
    //     payment_method: 'Credit Card',  // Payment method used (e.g., Credit Card, PayPal)
    //     payment_amount: '100.00',  // Amount paid for the job
    //     total_invoice_amount: '100.00',  // Total amount of the invoice for the job
    //     category_uuid: '123e4567-af18-4701-8d91-21db0f31e1db',  // UUID for the category of the job (e.g., home cleaning)
    //     payment_note: 'Payment completed via credit card.',  // Any additional notes about the payment
    //     geo_is_valid: '1',  // Indicates if the geolocation is valid (1 for valid, 0 for invalid)
    //     purchase_order_number: 'PO-987654',  // Purchase order number associated with the job (if any)
    //     invoice_sent: '1',  // 1 if the invoice has been sent to the customer
    //     invoice_sent_stamp: '2025-02-10 16:00:00',  // Timestamp for when the invoice was sent
    //     ready_to_invoice: '1',  // 1 if the job is ready to be invoiced
    //     ready_to_invoice_stamp: '2025-02-10 15:30:00',  // Timestamp for when the job is ready to be invoiced
    //     payment_processed: '1',  // 1 if the payment has been processed
    //     payment_processed_stamp: '2025-02-10 15:15:00',  // Timestamp for when the payment was processed
    //     geo_country: 'USA',  // Country of the job location
    //     geo_postcode: '62701',  // Postal code of the job location
    //     geo_state: 'IL',  // State of the job location
    //     geo_city: 'Springfield',  // City of the job location
    //     geo_street: 'Main St',  // Street address of the job location
    //     geo_number: '123',  // Street number of the job location
    //     queue_uuid: '123e4567-1500-485b-93bb-21db07f210eb',  // UUID of the queue the job is in
    //     queue_expiry_date: '2025-02-10 17:00:00',  // Expiry date for the job in the queue
    //     queue_assigned_staff_uuid: '123e4567-f641-4a0e-961e-21db0624c4fb',  // UUID of the staff assigned to the queue
    //     payment_received: '1',  // 1 if the payment has been received
    //     payment_received_stamp: '2025-02-10 15:10:00',  // Timestamp for when the payment was received
    //     badges: 'VIP',  // Any special badge assigned to the job (e.g., VIP, Urgent)
    //     quote_date: '2025-02-05 14:00:00',  // Date and time the quote was provided
    //     quote_sent: 1,  // 1 if the quote has been sent to the customer
    //     quote_sent_stamp: '2025-02-05 14:15:00',  // Timestamp for when the quote was sent
    //     work_order_date: '2025-02-10 10:00:00',  // Date and time the work order is to be completed
    //     completion_date: '2025-02-10 14:00:00',  // Date and time the job was completed
    //     completion_actioned_by_uuid: '123e4567-15c5-4ea0-8a01-21db005dfc8b',  // UUID of the staff who marked the job as completed
    //     unsuccessful_date: '2025-02-10 13:00:00',  // Date and time if the job was unsuccessful
    //     job_is_scheduled_until_stamp: '2025-02-10 15:00:00',  // Timestamp for when the job is scheduled until
    //     active_network_request_uuid: '123e4567-7620-454e-95ca-21db008d0cab',  // UUID of the active network request for the job
    //     related_knowledge_articles: [
    //       {
    //         knowledge_article_uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',  // UUID of a related knowledge article
    //         relevance: 0  // Relevance of the article to the job
    //       }
    //     ]
    //   };

    const jobData = {
        "status": "Quote",
        "job_address": "123 Street Lane, London, SE2",
        "date": "2025-02-10",
        "job_contacts": {
            "first_name: ":"Alex",
            "last_name": "Chen",
            "email":"alexchen631996@gmail.com"
        }
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
            console.log('Job created successfully:', data);  // Handle the success response
            // console.log(JSON.stringify(data.notice));
        })
        .catch(error => {
            console.error('Error creating job:', error);  // Handle any errors
        });
    //       const apiUrl = 'https://api.servicem8.com/api_1.0/company.json';  // Endpoint to get company details

    // // Making a GET request to retrieve company details
    // fetch(apiUrl, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Basic ${credentials}`,  // Bearer token for authentication
    //     'Content-Type': 'application/json',     // We expect a JSON response
    //   }
    // })
    //   .then(response => response.json())  // Parse the JSON response
    //   .then(data => {
    //     // Handle the response and extract the company_uuid
    //     // const companyUuid = data.company.uuid;  // This will be the company UUID
    //     console.log(data);
    //     // console.log('Company UUID:', companyUuid);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching company details:', error);
    //   });

    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'accept': 'application/json',
    //         'Authorization': `Basic ${credentials}`
    //         // authorization: `Basic ZGF2aWQud2FuZzA1MDYxOTk1QGdtYWlsLmNvbTp5anMyMDA1MDMyNSM=`
    //     }
    // };

    // fetch('https://api.servicem8.com/api_1.0/job.json', options)
    //     .then(res => res.json())
    //     .then(res => console.log(res))
    //     .catch(err => console.error(err));
    // fetch('https://go.servicem8.com/oauth/access_token',{
    //     method: 'POST',
    //     mode: 'no-cors',
    //     headers: {
    //         accept: 'application/json'
    //     }
    // }).then(res=>res.json()).then(res=>{
    //     console.log(res);
    // }).catch(err=>{
    //     console.log(err);
    // });
});