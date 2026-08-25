const fs = require('fs');
const path = require('path');

const EMPLOYEES_DIR = path.join(__dirname, '02_Employees');
const OUTPUT_FILE = path.join(__dirname, 'studio.json');

const employees = [];

fs.readdirSync(EMPLOYEES_DIR)
  .filter(file => file.toLowerCase().endsWith('.txt'))
  .sort()
  .forEach(file => {

    const filePath = path.join(EMPLOYEES_DIR, file);

    const content = fs.readFileSync(filePath, 'utf8');

    const lines = content.split(/\r?\n/);

    const name = lines.shift()?.trim() || '';

   const text = lines.join('\n');

    employees.push({
      name,
      text
    });

  });

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(employees, null, 2),
  'utf8'
);

console.log(`Generated ${OUTPUT_FILE}`);
console.log(`${employees.length} employees found.`);