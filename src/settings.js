export const database = {
  location: process.env.DATABASE_LOCATION ?? 'database.sqlite',
};

export const user = {
  password: {
    salt: process.env.USER_PASSWORD_SALT ?? 'salty',
  },
  proof: {
    salt: process.env.USER_PROOF_SALT ?? 'proven-salty',
  },
};
