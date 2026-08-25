






document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------
     CURSOR CROSS
  ------------------------- */
  const vertical = document.querySelector('.cursor-vertical');
  const horizontal = document.querySelector('.cursor-horizontal');

  if (vertical && horizontal) {
    document.addEventListener('mousemove', (e) => {
      vertical.style.left = `${e.clientX}px`;
      horizontal.style.top = `${e.clientY}px`;
    });
  }

});