let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('install-pwa-button');
    if (installButton) {
        // کلاس hidden را حذف کنید تا دکمه نمایش داده شود.
        installButton.classList.remove('hidden');
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
