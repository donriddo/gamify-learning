import * as moment from 'moment';
import * as createError from 'http-errors';
import { controller, del, get, post, put } from 'route-decorators';
import { Request, Response, NextFunction } from 'express';

import UpcomingService from './UpcomingService';
import { validate } from '../../utils/app';
import { IRequest } from '../../utils/interfaces';

@controller('/upcomings')
export default class UpcomingController {
  public $routes: any[];

  @post()
  public async createUpcoming(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body);
      const upcoming = await UpcomingService.createOne(req.body);

      return res.status(200).json({
        message: 'Upcoming created successfully',
        data: upcoming,
      });
    } catch (e) {
      next(e);
    }
  }

  @get('/:upcomingId')
  public async getUpcoming(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const conditions = {
        ...req.query,
        _id: req.params.upcomingId,
      };

      const upcoming = await UpcomingService.findOne(conditions);
      if (!upcoming) {
        throw createError(404, 'Upcoming not found');
      }

      return res.status(200).json({
        message: 'Upcoming retrieved successfully',
        data: upcoming,
      });
    } catch (e) {
      next(e);
    }
  }

  @get()
  public async listUpcomings(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const upcomings = await UpcomingService.findAll(req.query);

      return res.status(200).json({
        message: 'Upcomings retrieved successfully',
        ...upcomings,
      });
    } catch (e) {
      next(e);
    }
  }

  @put('/:upcomingId')
  public async updateUpcoming(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      this.validate(req.body, 'create', true);
      const upcoming = await UpcomingService.findOne({
        _id: req.params.upcomingId,
      });

      if (!upcoming) {
        throw createError(404, 'Upcoming not found');
      }

      await UpcomingService.update(
        { _id: req.params.upcomingId },
        req.body,
      );

      return res.status(200).json({
        message: 'Upcoming updated successfully',
        data: await UpcomingService.findOne({ _id: req.params.upcomingId }),
      });
    } catch (e) {
      next(e);
    }
  }

  @del('/:upcomingId')
  public async deleteUpcoming(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {

    try {
      const upcoming = await UpcomingService.findOne({
        _id: req.params.upcomingId,
      });

      if (!upcoming) {
        throw createError(404, 'Upcoming not found');
      }

      await UpcomingService.remove(
        { _id: req.params.upcomingId },
      );

      return res.status(200).json({
        message: 'Upcoming deleted successfully',
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
