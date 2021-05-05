import * as moment from 'moment';
import * as createError from 'http-errors';
import { controller, del, get, post, put } from 'route-decorators';
import { Request, Response, NextFunction } from 'express';

import ClassService from './ClassService';
import { validate } from '../../utils/app';
import { IRequest } from '../../utils/interfaces';

@controller('/classes')
export default class ClassController {
  public $routes: any[];

  @post()
  public async createClass(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const classObj = await ClassService.createOne(req.body);

      return res.status(200).json({
        message: 'Class created successfully',
        data: classObj,
      });
    } catch (e) {
      next(e);
    }
  }

  @get('/:classId')
  public async getClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const conditions = {
        ...req.query,
        _id: req.params.classId,
      };

      const classObj = await ClassService.findOne(conditions);
      if (!classObj) {
        throw createError(404, 'Class not found');
      }

      return res.status(200).json({
        message: 'Class retrieved successfully',
        data: classObj,
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listClasses(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const classes = await ClassService.findAll(req.query);

      return res.status(200).json({
        message: 'Classes retrieved successfully',
        ...classes,
      });
    } catch (e) {
      next(e);
    }
  }

  @put('/:classId')
  public async updateClass(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'create', true);
      const classObj = await ClassService.findOne({
        _id: req.params.classId,
      });

      if (!classObj) {
        throw createError(404, 'Class not found');
      }

      await ClassService.update(
        { _id: req.params.classId },
        req.body,
      );

      return res.status(200).json({
        message: 'Class updated successfully',
        data: await ClassService.findOne({ _id: req.params.classId }),
      });
    } catch (e) {
      next(e);
    }
  }

  @del('/:classId')
  public async deleteClass(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const classObj = await ClassService.findOne({
        _id: req.params.classId,
      });

      if (!classObj) {
        throw createError(404, 'Class not found');
      }

      await ClassService.remove(
        { _id: req.params.classId },
      );

      return res.status(200).json({
        message: 'Class deleted successfully',
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
