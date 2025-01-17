import * as argon2 from "argon2";

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
};

export async function createHash(value) {
  return await argon2.hash(value, {
    ...hashingConfig,
  });
}

export async function verifyValueWithHash(value, hash) {
  return await argon2.verify(hash, value, hashingConfig);
}
