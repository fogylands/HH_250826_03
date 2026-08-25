
  const mobileCategories = {
  "1_VIS_FOTOS": "FOTOS",
  "2_GRUNDRISS": "GRUNDRISS",
  "3_SCHNITTE": "SCHNITTE",
  "4_ANSICHTEN": "ANSICHTEN",
  "5_DETAILS_WEITERES": "DETAILS"
};

let activeMobileCategory = "1_VIS_FOTOS";
let loadedProjects = [];

document.addEventListener('DOMContentLoaded', () => {

  const wrapper = document.querySelector('.projects-wrapper');

  if (!wrapper) return;



 const mobileCategoryContainer = document.querySelector('.categories');

 if (mobileCategoryContainer) {

  Object.entries(mobileCategories).forEach(([category, title]) => {

    const link = document.createElement('a');

    link.href = '#';
    link.textContent = title;
    link.dataset.category = category;
    link.classList.add('mobile-category-link');

    if (category === activeMobileCategory) {
      link.classList.add('active');
    }

    link.addEventListener('click', (e) => {
  e.preventDefault();

  activeMobileCategory = category;

  document.querySelectorAll('.mobile-category-link').forEach(item => {
    item.classList.toggle(
      'active',
      item.dataset.category === activeMobileCategory
    );
  });

  renderMobileProjects();
});

    mobileCategoryContainer.appendChild(link);

  });

}



  fetch('../../libraries/03_Projects/projects.json')
    .then(res => res.json())
    .then(async projects => {

      
      projects.sort((a, b) => parseInt(b.number) - parseInt(a.number));
      loadedProjects = projects;

    const categoryRow = document.createElement('div');
    categoryRow.classList.add('project-category-row');

    const spacer = document.createElement('div');
    spacer.classList.add('category-spacer');

    categoryRow.appendChild(spacer); 

    const categoryTitles = {
    "1_VIS_FOTOS": "FOTOS",
    "2_GRUNDRISS": "GRUNDRISS",
    "3_SCHNITTE": "SCHNITTE",
    "4_ANSICHTEN": "ANSICHTEN",
    "5_DETAILS_WEITERES": "DETAILS"
    };

    Object.values(categoryTitles).forEach(title =>{
    const categoryTitle = document.createElement('div');
    categoryTitle.classList.add('category-title');
    categoryTitle.textContent= title;

    /* categoryRow.appendChild(categoryTitle) */

    })

    wrapper.appendChild(categoryRow);
    for (const project of projects) {

      const hasImages = project.images && Object.values(project.images)
      .some(category => Array.isArray(category) && category.length > 0);

      if (!hasImages) {
        continue;
      }

      const projectElement = await renderProject(project);
      wrapper.appendChild(projectElement);
    }
    initImageNavigation();
    renderMobileProjects();

 

  })
  .catch(err => console.error('Failed to load projects.json:', err));




});

/* -------------------------
   MOBILE PROJECTS
------------------------- */

function renderMobileProjects() {

  if (!loadedProjects.length) return;

  let mobileWrapper =
    document.querySelector('.mobile-projects-wrapper');

  if (!mobileWrapper) {

    mobileWrapper = document.createElement('div');
    mobileWrapper.classList.add('mobile-projects-wrapper');

    const main = document.querySelector('.main');

    if (!main) return;

    main.appendChild(mobileWrapper);
  }

  mobileWrapper.innerHTML = '';

  loadedProjects.forEach(project => {

    const images =
      project.images?.[activeMobileCategory] || [];

    // Don't show projects without this category
    if (!images.length) return;

    const projectElement =
      document.createElement('div');

    projectElement.classList.add('mobile-project');


    /* PROJECT NAME */

    const projectHeader =
      document.createElement('div');

    projectHeader.classList.add(
      'mobile-project-header'
    );

    projectHeader.innerHTML = `
      <a href="../project/project.html?id=${project.name}">
        ${project.number}<br>
        ${project.name}
      </a>
    `;


    /* GALLERY */

    const gallery =
      document.createElement('div');

    gallery.classList.add(
      'mobile-project-images'
    );


    images.forEach((img, index) => {

      const image =
        document.createElement('img');

      image.src =
        `../../libraries/03_Projects/_thumbnails/${project.id}/${activeMobileCategory}/${img}`;

      image.alt =
        mobileCategories[activeMobileCategory];

      image.classList.add(
        'mobile-project-image'
      );

      if (index === 0) {
        image.classList.add('active');
      }

      gallery.appendChild(image);

    });


    projectElement.appendChild(projectHeader);
    projectElement.appendChild(gallery);

    mobileWrapper.appendChild(projectElement);

  });

  initMobileImageNavigation();
}

function initMobileImageNavigation() {

  document.querySelectorAll('.mobile-project-images').forEach(gallery => {

    const images =
      gallery.querySelectorAll('.mobile-project-image');

    if (images.length < 2) return;

    let index = 0;

    gallery.addEventListener('click', () => {

      images[index].classList.remove('active');

      index = (index + 1) % images.length;

      images[index].classList.add('active');

    });

  });

}


/* -------------------------
   RENDER SINGLE PROJECT
------------------------- */

async function renderProject(project) {

  if (!project.images) project.images = {};

  const standardCategories = [
    "1_VIS_FOTOS",
    "2_GRUNDRISS",
    "3_SCHNITTE",
    "4_ANSICHTEN",
    "5_DETAILS_WEITERES"
  ];

  standardCategories.forEach(cat => {
    if (!Array.isArray(project.images[cat])) {
      project.images[cat] = [];
    }
  });

  const container = document.createElement('div');
  container.classList.add('project');



  const content = document.createElement('div');
  content.classList.add('collapsible-content');

  const galleryRow = document.createElement('div');
  galleryRow.classList.add('project-gallery-row');

  const header = document.createElement('div');
  header.classList.add('project-header');
const projectNumber = project.details.includes('Nummer: NEIN')
  ? ''
  : `<span class="project-number">${project.number}</span><br>`;

header.innerHTML = `
  <a class="project-name" href="../project/project.html?id=${project.name}">
    ${projectNumber}
    <span>${project.name}</span>
  </a>
`;
  galleryRow.appendChild(header);



standardCategories.forEach(category => {
  const images = project.images[category];

  const categoryDiv = document.createElement('div');
  categoryDiv.classList.add('project-images');
  categoryDiv.dataset.category = category;

  if (!images.length) {
    const blackImage = document.createElement('div');
    blackImage.classList.add(
      'project-image',
      'active',
      'black-image'
    );

    categoryDiv.appendChild(blackImage);

  } else {

    images.forEach((img, idx) => {
      const imgElement = document.createElement('img');

      imgElement.src =
        `../../libraries/03_Projects/_thumbnails/${project.id}/${category}/${img}`;

      imgElement.alt = category;
      imgElement.classList.add('project-image');

      if (idx === 0) {
        imgElement.classList.add('active');
      }

      categoryDiv.appendChild(imgElement);
    });
  }

  galleryRow.appendChild(categoryDiv);
});

  content.appendChild(galleryRow);
  content.appendChild(document.createElement('br'));

  container.appendChild(content);

  return container;

}




/* -------------------------
   IMAGE NAVIGATION
------------------------- */

function initImageNavigation() {

  const imageContainers = document.querySelectorAll('.project-images');

  imageContainers.forEach(container => {

    const images = container.querySelectorAll('.project-image');

    if (!images.length) return;

    let index = 0;

    images[index].classList.add('active');

    container.addEventListener('click', (e) => {

  e.stopPropagation();

  images[index].classList.remove('active');

  index = (index + 1) % images.length;

  images[index].classList.add('active');

});

  });

}



