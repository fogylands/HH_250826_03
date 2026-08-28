document.addEventListener('DOMContentLoaded', () => {

  const wrapper = document.querySelector('.projects-wrapper');

  function updateScrollableState() {
  const main = document.querySelector('body.works .main');

  if (!main || !wrapper) return;

  const isScrollable = wrapper.scrollWidth > main.clientWidth;

  wrapper.classList.toggle('is-scrollable', isScrollable);
}


function syncColumnWidths() {

  const columns = [
    document.querySelectorAll('.work-group-left [data-column="0"]'),
    document.querySelectorAll('.work-group-left [data-column="1"]'),
    document.querySelectorAll('.work-group-right [data-column="2"]'),
    document.querySelectorAll('.work-group-right [data-column="3"]'),
    document.querySelectorAll('.work-group-right [data-column="4"]'),
    document.querySelectorAll('.work-group-right [data-column="5"]')
  ];

  columns.forEach((cells, index) => {

    let maxWidth = 0;

    cells.forEach(cell => {
      cell.style.width = 'max-content';
      maxWidth = Math.max(
        maxWidth,
        cell.getBoundingClientRect().width
      );
    });

    document
      .querySelectorAll(`[data-column="${index}"]`)
      .forEach(cell => {
        cell.style.width = `${maxWidth}px`;
      });

  });



const wrapperWidth = wrapper.clientWidth;

  const columnWidths = columns.map(cells => {
    return cells[0]?.getBoundingClientRect().width || 0;
  });

  const fixedGap = 4 * window.innerWidth / 100;

  const totalColumnWidth =
    columnWidths.reduce((sum, width) => sum + width, 0);

const calculatedGap =
  (wrapperWidth - totalColumnWidth - fixedGap) / 4;

const sharedGap = Math.max(
  fixedGap,
  calculatedGap
);

wrapper.style.setProperty('--shared-gap', `${sharedGap}px`);

}



const sortDirections = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true
};

  if (!wrapper) return;

window.addEventListener('resize', () => {
  syncColumnWidths();
  updateScrollableState();
});

  fetch('../../libraries/03_Projects/projects.json')
    .then(res => res.json())
    .then(async projects => {

projects.sort((a, b) => {
  const numberA = parseInt(a.number, 10);
  const numberB = parseInt(b.number, 10);

  if (numberB !== numberA) {
    return numberB - numberA;
  }

  return String(b.number).localeCompare(
    String(a.number),
    undefined,
    { numeric: true }
  );
});




const header = document.createElement('div');
header.classList.add('work-row', 'header-row');
header.style.gridColumn = '1 / -1';
header.dataset.header = 'true';

const leftHeader = document.createElement('div');
leftHeader.classList.add('work-group', 'work-group-left');

const rightHeader = document.createElement('div');
rightHeader.classList.add('work-group', 'work-group-right');




const leftGroup = document.createElement('div');
leftGroup.classList.add('work-group', 'work-group-left');

const rightGroup = document.createElement('div');
rightGroup.classList.add('work-group', 'work-group-right');

const headers = [
  "<",
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

cell.addEventListener('click', async () => {


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
      a.name,
      a.location,
      a.year,
      a.type,
      a.status
    ];

    const valuesB = [
      b.number,
      b.name,
      b.location,
      b.year,
      b.type,
      b.status
    ];

if (index === 0) {
  const numberA = parseInt(String(valuesA[index] || ''), 10) || 0;
  const numberB = parseInt(String(valuesB[index] || ''), 10) || 0;

  if (numberA !== numberB) {
    return (numberA - numberB) * direction;
  }

  return String(valuesA[index] || '').localeCompare(
    String(valuesB[index] || ''),
    undefined,
    { numeric: true }
  ) * direction;
}

if (index === 3) {
  const yearA = Number(String(valuesA[index] || '').split('-')[0]) || 0;
  const yearB = Number(String(valuesB[index] || '').split('-')[0]) || 0;

  return (yearA - yearB) * direction;
}

return String(valuesA[index] || '')
  .localeCompare(String(valuesB[index] || ''))
  * direction;


  });

  wrapper.innerHTML = '';

  const newLeftGroup = document.createElement('div');
  newLeftGroup.classList.add('work-group', 'work-group-left');

  const newRightGroup = document.createElement('div');
  newRightGroup.classList.add('work-group', 'work-group-right');

  wrapper.appendChild(header);

  for (const project of projects) {

    const projectElement = await renderProject(project);

    const cells =
      projectElement.querySelectorAll('[data-column]');

    cells.forEach(cell => {

      const column =
        Number(cell.dataset.column);

      if (column < 2) {
        newLeftGroup.appendChild(cell);
      } else {
        newRightGroup.appendChild(cell);
      }

    });
  }

  wrapper.appendChild(newLeftGroup);
  wrapper.appendChild(newRightGroup);
  
  syncColumnWidths();
  updateScrollableState();

});

if (index < 2) {
  leftHeader.appendChild(cell);
} else {
  rightHeader.appendChild(cell);
}

});


header.appendChild(leftHeader);
header.appendChild(rightHeader);
wrapper.appendChild(header);



      for (const project of projects) {
  const projectElement = await renderProject(project);

 const cells = projectElement.querySelectorAll('[data-column]');

cells.forEach(cell => {

  const column = Number(cell.dataset.column);

  if (column < 2) {
    leftGroup.appendChild(cell);
  } else {
    rightGroup.appendChild(cell);
  }

});
}

wrapper.appendChild(leftGroup);
wrapper.appendChild(rightGroup);

syncColumnWidths();

updateScrollableState();

    })
    .catch(err => console.error('Failed to load projects.json:', err));

});


/* -------------------------
   RENDER SINGLE PROJECT
------------------------- */

async function renderProject(project) {

  const container = document.createElement('div');
  container.classList.add('work-row', 'works-project');

  container.dataset.projectId = project.id;

  const year = project.year || '';
  const location = project.location || '';
  const type = project.type || '';
  const state = project.status || '';

  const hasImages = project.images && Object.values(project.images)
    .some(category => Array.isArray(category) && category.length > 0);

  const projectNumber = project.details.includes('Nummer: NEIN')
    ? ''
    : `${project.number}`;

  const content = `
    <div data-column="0" data-project-id="${project.id}">${projectNumber}</div>
    <div data-column="1" data-project-id="${project.id}">${project.name}</div>
    <div data-column="2" data-project-id="${project.id}">${location}</div>
    <div data-column="3" data-project-id="${project.id}">${year}</div>
    <div data-column="4" data-project-id="${project.id}">${type}</div>
    <div data-column="5" data-project-id="${project.id}">${state}</div>
  `;

  container.innerHTML = content;

  if (hasImages) {

    const projectUrl =
      `../project/project.html?id=${encodeURIComponent(project.name)}`;

container.querySelectorAll('[data-column]').forEach(cell => {

  cell.dataset.clickable = 'true';

  cell.addEventListener('mouseenter', () => {

    document
      .querySelectorAll(`[data-project-id="${project.id}"]`)
      .forEach(projectCell => {
        projectCell.classList.add('row-hover');
      });

  });

  cell.addEventListener('mouseleave', () => {

    document
      .querySelectorAll(`[data-project-id="${project.id}"]`)
      .forEach(projectCell => {
        projectCell.classList.remove('row-hover');
      });

  });

  cell.addEventListener('click', () => {
    window.location.href = projectUrl;
  });

});
  }

  return container;
}






