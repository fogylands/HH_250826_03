const video = document.querySelector('.video-bg');
const poster = document.querySelector('.video-poster');

if (video && poster) {

  const startVideo = () => {

    video.play()
      .then(() => {
        poster.classList.add('is-hidden');
      })
      .catch(() => {
        // If Safari blocks autoplay, keep the image visible
      });

  };

  video.addEventListener('canplay', startVideo, { once: true });

  window.addEventListener('load', startVideo, { once: true });

}