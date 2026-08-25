const fs = require('fs');

// read txt file
const text = fs.readFileSync('studio.txt', 'utf-8');

// split into lines
const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');

let data = {};
let employees = [];
let readingEmployees = false;

lines.forEach(line => {
  // detect employee list start
  if (line === "Mitarbeiter:") {
    readingEmployees = true;
    return;
  }

  if (readingEmployees) {
    employees.push(line);
  } else {
    const [key, value] = line.split(':').map(s => s.trim());

    if (key === "Start") data.start = value;
    if (key === "Studio Location") data.studioLocation = value;
    if (key === "Mitarbeiter") data.employeeCount = Number(value);
  }
});

data.employees = employees;

// write JSON file
fs.writeFileSync('studio.json', JSON.stringify(data, null, 2));

console.log("✅ JSON created!");