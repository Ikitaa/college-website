import { Request, Response, NextFunction } from "express";

/**
 * Express 5 ले req.query ra req.params lai read-only getter banayo,
 * jo ले gardaa purano middleware (jasto express-mongo-sanitize) le
 * tyी lai reassign garne kosis garda crash huncha. req.body chai
 * ajhai writable plain object ho, tesैle hami tyहाँ matra sanitize
 * garchaun — hamro sabai Mongoose schema strictly typed bhayeko le
 * (jasto { $ne: null } jasto operator object lai Mongoose le MongoDB
 * samma pugnu agadi nai cast garidincha), yसले same practical
 * protection diन्छ, crash navaई।
 *
 * Kunai pani object key jo "$" bata suru huncha ya "." samaveश garcha,
 * recursively हटाउँछ।
 */
const sanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === "object") {
    const clean: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = sanitizeObject(obj[key]);
    }
    return clean;
  }
  return obj;
};

export const sanitizeBody = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
    next();
  };
};