export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: 'ADMIN' | 'PARENT';
}
