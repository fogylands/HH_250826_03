document.addEventListener('DOMContentLoaded', () => {

  const wrapper = document.querySelector('.projects-wrapper');



  /* -------------------------
     BACKGROUND VIDEO LOAD
  ------------------------- */
  const video = document.querySelector('.video-bg');

  if (video) {
    video.classList.remove('is-loaded');

    const showVideo = () => {
      video.classList.add('is-loaded');
    };

    video.addEventListener('canplay', showVideo);
    video.addEventListener('playing', showVideo);
  }

});

