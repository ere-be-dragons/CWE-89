import {createHash} from 'node:crypto';

export function hash(salt, input, algorithm = 'sha256') {
  return createHash(algorithm)
    .update(`${salt}-${input}`)
    .digest('hex');
}
