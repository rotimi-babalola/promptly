// src/auth/user-throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { id: string };
}

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: RequestWithUser): Promise<string> {
    const userId = req.user?.id;

    if (userId) {
      return `speak:${userId}`;
    }

    return super.getTracker(req);
  }
}
