const fs = require('fs');

// read txt file
const text = fs.readFileSync('studio.txt', 'utf-8');

// split into lines
const lines = text.split('\n').map(l => l.trim());

let data = {};
let employees = [];
let readingEmployees = false;
let currentEmployee = null;
let currentText = [];

function saveEmployee() {
  if (currentEmployee) {
    employees.push({
      name: currentEmployee,
      text: currentText.join(' ')
    });
  }
}

lines.forEach(line => {
  if (line === '') return;

  if (line === 'Mitarbeiter:') {
    readingEmployees = true;
    return;
  }

  if (readingEmployees) {
    // employee name ends with ':'
    if (line.endsWith(':')) {
      saveEmployee();
      currentEmployee = line.replace(':', '');
      currentText = [];
    } else {
      currentText.push(line);
    }
  } else {
    const [key, value] = line.split(':').map(s => s.trim());

    if (key === 'Start') data.start = value;
    if (key === 'Studio Location') data.studioLocation = value;
    if (key === 'Mitarbeiter') data.employeeCount = Number(value);
  }
});

saveEmployee();

data.employees = employees;

// write JSON file
fs.writeFileSync('studio.json', JSON.stringify(data, null, 2));

console.log('✅ JSON created!');