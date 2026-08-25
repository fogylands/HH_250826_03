const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PROJECTS_DIR = path.join(__dirname, '03_Projects');
const THUMBNAILS_DIR = path.join(PROJECTS_DIR, '_thumbnails');
const OUTPUT_FILE = path.join(PROJECTS_DIR, 'projects.json');

const projects = [];


/* =================================
   GENERATE THUMBNAILS
================================= */

async function generateThumbnails() {

  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });

  const projectFolders = fs.readdirSync(PROJECTS_DIR);

  for (const project of projectFolders) {

    const projectPath = path.join(PROJECTS_DIR, project);

    if (!fs.statSync(projectPath).isDirectory()) continue;
    if (project === '_thumbnails') continue;

    const folders = fs.readdirSync(projectPath);

    for (const folder of folders) {

      const folderPath = path.join(projectPath, folder);

      if (!fs.statSync(folderPath).isDirectory()) continue;

      const outputFolder = path.join(
        THUMBNAILS_DIR,
        project,
        folder
      );

      fs.mkdirSync(outputFolder, { recursive: true });

      const images = fs.readdirSync(folderPath);

      for (const image of images) {

        if (!/\.(jpg|jpeg|png|webp)$/i.test(image)) {
          continue;
        }

        const input = path.join(folderPath, image);

        /*
         * Always create JPEG thumbnails.
         * This also makes PNG/WebP files consistent.
         */
        const outputName =
          path.parse(image).name + '.jpg';

        const output = path.join(
          outputFolder,
          outputName
        );

        await sharp(input)
          .resize({
            width: 800,
            withoutEnlargement: true
          })
          .jpeg({
            quality: 70
          })
          .toFile(output);

        console.log('Thumbnail:', output);
      }
    }
  }

  console.log('✅ All thumbnails generated');
}


/* =================================
   GENERATE PROJECTS JSON
================================= */

function generateProjects() {

  const projectFolders = fs.readdirSync(PROJECTS_DIR);

  for (const projectNumber of projectFolders) {

    const projectPath =
      path.join(PROJECTS_DIR, projectNumber);

    if (!fs.statSync(projectPath).isDirectory()) {
      continue;
    }

    // Don't treat the thumbnail folder as a project
    if (projectNumber === '_thumbnails') {
      continue;
    }


    /* -------------------------
       DEFAULT METADATA
    ------------------------- */

    const parts = projectNumber.split('_');

    let number = parts[0];
    let name = parts.slice(1, -1).join(' ');

    let description = '';
    let credits = '';
    let location = '';
    let year = '';
    let type = '';
    let status = '';
    let details = '';


    /* -------------------------
       PROJECT DESCRIPTION
    ------------------------- */

    const txtPath = path.join(
      projectPath,
      'Project-Description.txt'
    );

    if (fs.existsSync(txtPath)) {

      const lines = fs
        .readFileSync(txtPath, 'utf8')
        .split(/\r?\n/);


      /* NAME */

      const nameIndex = lines.findIndex(line =>
        line.trim().toLowerCase().startsWith('name:')
      );

      if (nameIndex !== -1) {

        name = lines[nameIndex]
          .replace(/^name:\s*/i, '')
          .trim();

        lines.splice(nameIndex, 1);
      }


      /* DETAILS START */

      const detailsIndex = lines.findIndex(line =>
        line.trim().startsWith('Ort:')
      );


      /*
       * Everything before "Ort:" is the description.
       *
       * IMPORTANT:
       * Do NOT trim every individual line.
       * This preserves line breaks and tabs.
       */

      const descriptionEnd =
        detailsIndex !== -1
          ? detailsIndex
          : lines.length;

      description = lines
        .slice(0, descriptionEnd)
        .join('\n')
        .trim();


      /* DETAILS */

      if (detailsIndex !== -1) {

        const detailLines =
          lines.slice(detailsIndex);

        detailLines.forEach(line => {

          const trimmed = line.trim();

          if (trimmed.startsWith('Ort:')) {
            location =
              trimmed.replace(/^Ort:\s*/, '');
          }

          if (trimmed.startsWith('Zeitraum:')) {
            year =
              trimmed.replace(/^Zeitraum:\s*/, '');
          }

          if (trimmed.startsWith('Art:')) {
            type =
              trimmed.replace(/^Art:\s*/, '');
          }

          if (trimmed.startsWith('Status:')) {
            status =
              trimmed.replace(/^Status:\s*/, '');
          }

        });


        details = detailLines
          .join('\n')
          .trim();
      }
    }


    /* -------------------------
       CREDITS
    ------------------------- */

    const creditsPath =
      path.join(projectPath, 'Credits.txt');

    if (fs.existsSync(creditsPath)) {

      credits = fs
        .readFileSync(creditsPath, 'utf8')
        .trim()
        .split(/\r?\n/)
        .filter(line => line.trim() !== '')
        .join('<br>');
    }


    /* -------------------------
       GATHER IMAGES
    ------------------------- */

    const images = {};

    const folders =
      fs.readdirSync(projectPath);

    for (const folder of folders) {

      const folderPath =
        path.join(projectPath, folder);

      if (!fs.statSync(folderPath).isDirectory()) {
        continue;
      }

const folderImages =
  fs.readdirSync(folderPath)
    .filter(file =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    )
    .sort()
    .map(file =>
      path.parse(file).name + '.jpg'
    );
  
      images[folder] = folderImages;
    }


    /* -------------------------
       ADD PROJECT
    ------------------------- */

    projects.push({
      number,
      name,
      id: projectNumber,
      description,
      credits,
      location,
      year,
      type,
      status,
      details,
      images
    });
  }


  /* -------------------------
     WRITE JSON
  ------------------------- */

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(projects, null, 2)
  );

  console.log('✅ projects.json generated');
}


/* =================================
   RUN EVERYTHING
================================= */

async function main() {

  console.log('-----------------------------');
  console.log('GENERATING PROJECTS');
  console.log('-----------------------------');

  await generateThumbnails();

  generateProjects();

  console.log('-----------------------------');
  console.log('✅ DONE');
  console.log('-----------------------------');
}

main().catch(error => {

  console.error(
    '❌ Error generating projects:',
    error
  );

  process.exit(1);
});