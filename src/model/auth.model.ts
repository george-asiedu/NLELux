export interface JwtTokenPayload {
  email: string;
  code: string;
  type: 'signup' | 'access' | 'refresh';
}
