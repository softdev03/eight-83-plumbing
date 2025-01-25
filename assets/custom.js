document.addEventListener('DOMContentLoaded',()=>{
    const newTarget = document.querySelector('.shopify-section--video-new');
    if(newTarget) {
        const target = document.body;
        const config = {childList: true,subtree: true};
        const observer = new MutationObserver((mutationList)=>{
            for (const mutation of mutationList) {
                console.log(mutation.target.id);
                if(mutation.target.id === 'shopify-chat') {
                    newTarget.appendChild(mutation.target);
                    observer.disconnect();
                    break;
                }
            }
        });
        observer.observe(target,config);
    }

    const map = new google.maps.Map(document.getElementById('service-map-with-postcodes'), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      const marker = new google.maps.Marker({
        position: { lat: 37.7749, lng: -122.4194 },
        map: map,
        title: 'San Francisco'
      });
});