// src/middlewares/TokenMiddleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext } from '../database/context/RequestContext';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const store = new Map<string, string>();

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      store.set('token', token);
    }

    requestContext.run(store, () => {
      next();
    });
  }
}