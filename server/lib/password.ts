import { compare, hash, truncates } from 'bcryptjs'

const PASSWORD_SALT_ROUNDS = 12

export function hashPassword(password: string) {
  return hash(password, PASSWORD_SALT_ROUNDS)
}

export function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash)
}

export function isPasswordTooLongForHash(password: string) {
  return truncates(password)
}
