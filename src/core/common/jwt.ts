export const JWTConfiguration = {
  secret: 'I am a secret',
  expiration: 3600,
  refreshExpiration: 3600 * 24 * 7,
  pattern: /(^[\w-]*\.[\w-]*\.[\w-]*$)/g,
}
