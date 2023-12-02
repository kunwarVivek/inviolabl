import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Clerk from '@clerk/clerk-sdk-node/esm/instance';


@Injectable()
export class ClerkSessionMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Retrieve the particular session ID from a header
      const session_id = req.header('Session_id');

      const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

      if (!session_id) {
        return res.status(401).json({ message: 'Unauthorized: session_id not provided' });
      }

      // Retrieve the session list from Clerk
      const sessionList = await clerkClient.sessions.getSessionList();
      console.log(sessionList)

      // Check if the provided session_id is in the session list
      const isValidSession = sessionList.some(session => session.id === session_id);

      if (!isValidSession) {
        return res.status(401).json({ message: 'Unauthorized: Invalid session_id' });
      }

      // Continue with the next middleware or route handler if the session_id is valid
      next();
    } catch (error) {
      console.error('Error in ClerkSessionMiddleware:', error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
