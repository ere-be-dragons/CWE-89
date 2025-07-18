import {DatabaseSync} from 'node:sqlite';
import * as settings from '#settings';
import {hash} from "#hash";

const db = new DatabaseSync(settings.database.location);

export function getById(id) {
  return db.prepare(`
    SELECT *
    FROM users
    WHERE id = '${id}';
  `).get();
}

export function authenticate(username, password) {
  const saltedPassword = hash(settings.user.password.salt, password, 'sha256');

  return db.prepare(`
    SELECT *
    FROM users
    WHERE name = '${username}'
      AND pass = '${saltedPassword}';
  `).get();
}

export function listAll() {
  return db.prepare(`
    SELECT name
    FROM users;
  `).all();
}

export default {authenticate, getById, listAll};
