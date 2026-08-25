let galleryImages = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
const container = document.querySelector('.main');

 

  // Create layout columns

  const navSide = document.createElement('div')
  navSide.classList.add('navSide');

  const navL = document.createElement('div')
  navL.classList.add('navL');

  const navR = document.createElement('div')
  navR.classList.add('navR');


  const mainSide = document.createElement('div')
  mainSide.classList.add('mainSide');

  const mainL = document.createElement('div');
  mainL.classList.add('main-l');




  const detailsSide = document.createElement('div')
  detailsSide.classList.add('detailsSide');

  const detailsL = document.createElement('div')
  detailsL.classList.add('detailsL');


const projectText = document.createElement('div');
projectText.classList.add('project-text');
  






  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  console.log("Project ID:", projectId);

  fetch('../../libraries/03_Projects/projects.json')
    .then(res => res.json())
    .then( projects => {

      const project = projects.find(
        p => p.name == projectId
      );

      console.log("Found project:", project);

      if (!project) {
        container.innerHTML = "Project not found";
        return;
      }


       const header = document.createElement('div');
      header.classList.add('project-header');


      const projectNumber = project.details.includes('Nummer: NEIN')

  ? ''

  : `${project.number}`;

  header.innerHTML = `
  <div class="project-name">


    ${projectNumber}
<br>
    ${project.name}

  </div>`;






projectText.innerHTML = `
  <div class="project-middle">
    ${
      project.credits
      ? `<div class="project-credits">
          ${project.credits}
         </div>`
      : ''
    }
  </div>
`;

detailsL.innerHTML = `
  <div class="project-description">
    ${project.description || ''}
  </div>
`;


mainSide.appendChild(header);
      const nav = document.createElement('div')
      nav.classList.add('project-nav');
      navL.appendChild(nav);


     const element = renderProject(project, nav);

     mainL.appendChild(element);

      container.appendChild(navSide);
      container.appendChild(navL);
      container.appendChild(navR);

      container.appendChild(mainSide);  
      container.appendChild(mainL);


      container.appendChild(detailsSide);
      container.appendChild(detailsL);

      container.appendChild(projectText);

   

      


initImageNavigation();
      

if (window.innerWidth > 700) {

  updateProjectLayout();

}

    })
    .catch(err => console.error(err));

});


/* -------------------------
   RENDER SINGLE PROJECT
------------------------- */
function renderProject(project, nav) {

  if (!project.images) project.images = {};

const categories = {
  "1_VIS_FOTOS": "FOTOS",
  "2_GRUNDRISS": "GRUNDRISS",
  "3_SCHNITTE": "SCHNITTE",
  "4_ANSICHTEN": "ANSICHTEN",
  "5_DETAILS_WEITERES": "DETAILS"
};

Object.keys(categories).forEach(category => {
  project.images[category] ||= [];
});

  

  const gallery = document.createElement('div');
  gallery.classList.add('project-gallery');

  
  Object.entries(categories).forEach(([category, title]) => {

    const images = project.images[category];

    if (!images.length) return;


     const link = document.createElement('a');
link.href = "#";
link.textContent = title;
link.classList.add('project-nav-link');
link.dataset.category = category;


    link.addEventListener('click', (e) => {
      e.preventDefault();

      const firstImage = gallery.querySelector(
      `.project-image[data-category="${category}"]`
      );

    if (firstImage) {

  galleryImages.forEach(img => img.classList.remove('active'));

  firstImage.classList.add('active');

  currentIndex = galleryImages.indexOf(firstImage);
  updateActiveCategory(category);





}
    });

    nav.appendChild(link);


    images.forEach(img => {

      const imgElement = document.createElement('img');

      imgElement.src = `../../libraries/03_Projects/_thumbnails/${project.id}/${category}/${img}`;

      imgElement.classList.add('project-image');
      imgElement.dataset.category = category;

      gallery.appendChild(imgElement);

    });

  });


  
const projectContent = document.createElement('div');
projectContent.classList.add('project-content');


projectContent.appendChild(gallery);

return projectContent;
}

/* -------------------------

   IMAGE NAVIGATION

------------------------- */

function initImageNavigation() {

  galleryImages = Array.from(document.querySelectorAll('.project-image'));

  if (!galleryImages.length) return;

  currentIndex = 0;

galleryImages[currentIndex].classList.add('active');

updateActiveCategory(
  galleryImages[currentIndex].dataset.category
);






galleryImages.forEach(img => {

  img.addEventListener('click', () => {

    galleryImages[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + 1) % galleryImages.length;

    galleryImages[currentIndex].classList.add('active');

    updateActiveCategory(
      galleryImages[currentIndex].dataset.category
    );

  });

});
}




function updateActiveCategory(category) {

  document.querySelectorAll('.project-nav-link')
    .forEach(link => {
      link.classList.remove('active');
    });

  const activeLink = Array.from(
    document.querySelectorAll('.project-nav-link')
  ).find(link => {
    return link.dataset.category === category;
  });

  if (activeLink) {
    activeLink.classList.add('active');
  }
}



function updateProjectLayout() {
  const main = document.querySelector('.main');
  const mainL = document.querySelector('.main-l');
  const mainSide = document.querySelector('.mainSide');
  const projectText = document.querySelector('.project-text');

  if (!main || !mainL || !mainSide || !projectText) return;

  const styles = getComputedStyle(main);

  const columnGap = parseFloat(styles.columnGap) || 0;
  const rowGap = parseFloat(styles.rowGap) || 0;

const paddingTop = parseFloat(styles.paddingTop) || 0;
const paddingBottom = parseFloat(styles.paddingBottom) || 0;
const paddingLeft = parseFloat(styles.paddingLeft) || 0;
const paddingRight = parseFloat(styles.paddingRight) || 0;

const mainRect = main.getBoundingClientRect();

const mainWidth =
  mainRect.width - paddingLeft - paddingRight;

const mainHeight =
  mainRect.height - paddingTop - paddingBottom;

  const mainSideWidth =
    mainSide.getBoundingClientRect().width;

  const mainRMinWidth =
    parseFloat(getComputedStyle(projectText).minWidth) || 0;


  /* -------------------------
     VERTICAL LIMIT
  ------------------------- */

const navHeight = window.innerHeight * 0.05;
const detailsMinHeight = window.innerHeight * 0.10;

const availableHeight = Math.max(
  0,
  mainHeight
    - navHeight
    - detailsMinHeight
    - rowGap * 2
);

  /*
    4:3

    height × 4/3 = width
  */

  const widthFromHeight =
    Math.max(0, availableHeight * 4 / 3);


  /* -------------------------
     HORIZONTAL LIMIT
  ------------------------- */

  const availableWidth =
    mainWidth
    - mainSideWidth
    - mainRMinWidth
    - columnGap * 2;


  /* -------------------------
     FINAL GALLERY WIDTH
  ------------------------- */
const galleryWidth =
  Math.max(
    0,
    Math.min(
      widthFromHeight,
      availableWidth
    )
  );

mainL.style.width =
  `${galleryWidth}px`;




  navL.style.width =
  `${galleryWidth}px`;

}
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) {
    updateProjectLayout();
  }
});

window.addEventListener('load', () => {
  if (window.innerWidth > 700) {
    updateProjectLayout();
  }
});