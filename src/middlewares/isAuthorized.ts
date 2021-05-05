import { Response, NextFunction } from 'express';
import * as createError from 'http-errors';

import AssignmentService from '../components/assignments/AssignmentService';
import { IRequest } from '../utils/interfaces';

export default async function isAssignmentized(
  req: IRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw createError(
        401,
        'You are not assignmentized to access this resource',
      );
    }

    const assignment = await AssignmentService.findOne({ apiKey });
    if (!assignment) {
      throw createError(
        401,
        'You are not assignmentized to access this resource',
      );
    }

    req.assignment = assignment;

    next();
  } catch (error) {
    next(error);
  }
}
