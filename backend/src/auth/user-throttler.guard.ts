// src/auth/user-throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

interface SupabaseUser {
  id: string;
  email?: string;
  [key: string]: any;
}

interface RequestWithUser extends Request {
  user?: SupabaseUser;
}

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: RequestWithUser): Promise<string> {
    const user = req.user;

    if (user?.id) {
      return `user:${user.id}`;
    }

    return super.getTracker(req);
  }
}
