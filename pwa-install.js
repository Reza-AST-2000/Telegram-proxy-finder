let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show your custom install button here
    // For example, by removing a 'hidden' class from a button element
    const installButton = document.getElementById('install-pwa-button');
    if (installButton) {
        installButton.style.display = 'block';
    }
});

const installPWA = () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
};

const installButton = document.getElementById('install-pwa-button');
if (installButton) {
    installButton.addEventListener('click', installPWA);
}
