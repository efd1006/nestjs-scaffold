import * as bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(p1, p2) {
  return await bcrypt.compare(p1, p2)
}