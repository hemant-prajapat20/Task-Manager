const fs = require('fs');
try {
  const content = fs.readFileSync('error.log', 'utf16le');
  console.log(content);
} catch (e) {
  console.error(e);
}
