document.addEventListener('DOMContentLoaded',()=>{
    const newTarget = document.querySelector('.shopify-section--video-new');
    if(newTarget) {
        const target = document.body;
        const config = {childList: true,subtree: true};
        const observer = new MutationObserver((mutationList)=>{
            for (const mutation of mutationList) {
                if(mutation.target.id === 'shopify-chat') {
                    newTarget.appendChild(mutation.target);
                    observer.disconnect();
                    break;
                }
            }
        });
        observer.observe(target,config);
    }
});