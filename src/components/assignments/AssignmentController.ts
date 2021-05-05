import * as moment from 'moment';
import * as createError from 'http-errors';
import { controller, del, get, post, put } from 'route-decorators';
import { Request, Response, NextFunction } from 'express';

import AssignmentService from './AssignmentService';
import { validate } from '../../utils/app';
import { IRequest } from '../../utils/interfaces';

@controller('/assignments')
export default class AssignmentController {
  public $routes: any[];

  @post()
  public async createAssignment(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const assignment = await AssignmentService.createOne(req.body);

      return res.status(200).json({
        message: 'Assignment created successfully',
        data: assignment,
      });
    } catch (e) {
      next(e);
    }
  }

  @get('/:assignmentId')
  public async getAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const conditions = {
        ...req.query,
        _id: req.params.assignmentId,
      };

      const assignment = await AssignmentService.findOne(conditions);
      if (!assignment) {
        throw createError(404, 'Assignment not found');
      }

      return res.status(200).json({
        message: 'Assignment retrieved successfully',
        data: assignment,
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listAssignments(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const assignments = await AssignmentService.findAll(req.query);

      return res.status(200).json({
        message: 'Assignments retrieved successfully',
        ...assignments,
      });
    } catch (e) {
      next(e);
    }
  }

  @put('/:assignmentId')
  public async updateAssignment(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'create', true);
      const assignment = await AssignmentService.findOne({
        _id: req.params.assignmentId,
      });

      if (!assignment) {
        throw createError(404, 'Assignment not found');
      }

      await AssignmentService.update(
        { _id: req.params.assignmentId },
        req.body,
      );

      return res.status(200).json({
        message: 'Assignment updated successfully',
        data: await AssignmentService.findOne({ _id: req.params.assignmentId }),
      });
    } catch (e) {
      next(e);
    }
  }

  @del('/:assignmentId')
  public async deleteAssignment(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const assignment = await AssignmentService.findOne({
        _id: req.params.assignmentId,
      });

      if (!assignment) {
        throw createError(404, 'Assignment not found');
      }

      await AssignmentService.remove(
        { _id: req.params.assignmentId },
      );

      return res.status(200).json({
        message: 'Assignment deleted successfully',
      });
    } catch (e) {
      next(e);
    }
  }

  private validate(body, type = 'create', isUpdate = false) {
    let fields = {};

    if (type === 'create') {
      fields = {
        title: {
          type: 'string',
          required: !isUpdate,
        },
        date: {
          type: 'string',
          required: !isUpdate,
          conform: (value) => {
            return moment(value, true).isValid();
          },
          messages: {
            conform: 'invalid date sent',
          },
        },
      };
    }

    validate(
      body,
      {
        properties: fields,
      },
      {
        strictRequired: !isUpdate,
        unknownProperties: 'delete',
        trim: true,
      },
    );
  }
}
