document.addEventListener('DOMContentLoaded', () => {

  const wrapper = document.querySelector('.projects-wrapper');
  const sortDirections = {
  0: true
};

  if (!wrapper) return;

  fetch('../../libraries/03_Projects/projects.json')
    .then(res => res.json())
    .then(async projects => {

projects.sort((a, b) => {
  return Number(b.number) - Number(a.number);
});

      const header = document.createElement('div');
      header.classList.add('work-row', 'header-row');

    const headers = [
  "<",
  "<",
  "<",
  "<",
  "<"
];

headers.forEach((title, index) => {

const cell = document.createElement('div');
cell.classList.add('sort-header');
cell.dataset.column = index;
cell.innerHTML = `<span>${title}</span>`;



if (index === 0) {

  const span = cell.querySelector('span');

  span.classList.add('selected');

  span.style.transform = 'rotate(270deg)';

}

cell.addEventListener('click', () => {

  // reset all arrows
  document.querySelectorAll('.sort-header span').forEach(span => {
    span.classList.remove('selected');
    span.style.transform = 'rotate(90deg)';
  });


  // select clicked arrow
  const span = cell.querySelector('span');
  span.classList.add('selected');


  // toggle direction
  sortDirections[index] = !sortDirections[index];


  // rotate according to direction
  if (sortDirections[index]) {
    span.style.transform = 'rotate(270deg)';
  } else {
    span.style.transform = 'rotate(90deg)';
  }


  const direction = sortDirections[index] ? 1 : -1;

  projects.sort((a, b) => {

    const valuesA = [
      a.number,
      a.location,
      a.year,
      a.type,
      a.status
    ];

    const valuesB = [
      b.number,
      b.location,
      b.year,
      b.type,
      b.status
    ];

if (index === 2) { // ZEITRAUM
  const yearA = Number(valuesA[index]?.split('-')[0]) || 0;
  const yearB = Number(valuesB[index]?.split('-')[0]) || 0;

  return (yearB - yearA) * direction;
}

return String(valuesA[index] || '')
  .localeCompare(String(valuesB[index] || ''))
  * direction;

  });
  wrapper.innerHTML = '';
  wrapper.appendChild(header);


  projects.forEach(async project => {
    const projectElement = await renderProject(project);
    wrapper.appendChild(projectElement);
  });

});

  header.appendChild(cell);

});

      wrapper.appendChild(header);

      for (const project of projects) {
        const projectElement = await renderProject(project);
        wrapper.appendChild(projectElement);
      }

    })
    .catch(err => console.error('Failed to load projects.json:', err));

});


/* -------------------------
   RENDER SINGLE PROJECT
------------------------- */

async function renderProject(project) {

  const container = document.createElement('div');
  container.classList.add('work-row', 'works-project');

  let year = project.year || '';
  let location = project.location || '';
  let type = project.type || '';
  let state = project.status || '';

  const hasImages = project.images && Object.values(project.images)
    .some(category => Array.isArray(category) && category.length > 0);

const projectNumber = project.details.includes('Nummer: NEIN')

  ? ''

  : `${project.number}`;

const content = `
  <div data-column="0">${projectNumber} ${project.name}</div>
  <div data-column="1">${location}</div>
  <div data-column="2">${year}</div>
  <div data-column="3">${type}</div>
  <div data-column="4">${state}</div>
`;
if (hasImages) {
  container.innerHTML = `
    <a class="work-link" href="../project/project.html?id=${project.name}">
      ${content}
    </a>
  `;
} else {
  container.innerHTML = content;
}

  return container;
}




document.addEventListener('mouseover', e => {

  const cell = e.target.closest('[data-column]');

  document.querySelectorAll('[data-column]')
    .forEach(el => {
      el.classList.remove('column-hover');
    });

  if (cell) {

    const column = cell.dataset.column;

    document
      .querySelectorAll(`[data-column="${column}"]`)
      .forEach(el => {
        el.classList.add('column-hover');
      });

  }

});