import * as jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.SECRET_KEY;

export interface JwtPayload {
  userId: string;
}

export function generateJwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET_KEY);
}

export function decodeJwtToken(token: string): JwtPayload | any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    return error + ' from catch';
  }
}
