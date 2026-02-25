const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'waitlist.db');

try {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT email, created_at FROM waitlist ORDER BY created_at DESC').all();

  if (rows.length === 0) {
    console.log('Waitlist is empty.');
  } else {
    console.log(`Waitlist (${rows.length} entries):`);
    console.log('----------------------------------------');
    rows.forEach(row => {
      console.log(`${row.created_at} | ${row.email}`);
    });
    console.log('----------------------------------------');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Error: waitlist.db file not found.');
  } else {
    console.error('Error reading waitlist:', error.message);
  }
}
