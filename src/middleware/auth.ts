import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface PrivyClaims {
    app_id: string;
    issuer: string;
    issued_at: number;
    expiration: number;
    session_id: string;
    user_id: string;
}

declare global {
    namespace Express {
        interface Request {
            privyUser?: PrivyClaims;
        }
    }
}

// Privy verification key (PEM/SPKI format) from the Privy dashboard:
// App Settings → Verification key
const PRIVY_VERIFICATION_KEY = process.env.PRIVY_VERIFICATION_KEY;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or malformed Authorization header' });
        return;
    }

    if (!PRIVY_VERIFICATION_KEY) {
        console.error('❌ PRIVY_VERIFICATION_KEY is not set');
        res.status(500).json({ error: 'Server misconfiguration' });
        return;
    }

    const token = authHeader.slice(7);
    try {
        const claims = jwt.verify(token, PRIVY_VERIFICATION_KEY, {
            algorithms: ['ES256'],
            audience: PRIVY_APP_ID,
            issuer: 'privy.io',
        }) as PrivyClaims;
        req.privyUser = claims;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
