import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import * as settings from '#settings';
import {parseArgs} from 'node:util';

const {values: {username, password}} = parseArgs({options: {
  username: {
    type: 'string',
    short: 'u',
  },
  password: {
    type: 'string',
    short: 'p',
  },
}});

if (!username || !password) {
  console.log('Must specify --username and --password');
  process.exit(1);
}

const db = new DatabaseSync(settings.database.location);

db.exec(
  `
	CREATE TABLE IF NOT EXISTS users (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT,
	  pass TEXT
	);
  `,
);

db.prepare('INSERT INTO users (name, pass) VALUES (?, ?);')
  .run(
    username,
    createHash('sha256')
      .update(`${settings.user.password.salt}-${password}`)
      .digest('hex'),
  );

console.log(`created user ${username}`);
