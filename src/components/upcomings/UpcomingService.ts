import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import Upcoming, { UpcomingModel } from './UpcomingModel';

export default class UpcomingService {
  public static async createOne(
    upcoming: UpcomingModel,
    options?: SaveOptions,
  ): Promise<DocumentType<UpcomingModel>> {
    return await Upcoming.create(upcoming, options);
  }

  public static async createMany(
    upcomings: UpcomingModel[],
    options?: SaveOptions,
  ): Promise<DocumentType<UpcomingModel>[]> {
    return await Upcoming.create(upcomings, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<UpcomingModel>>,
  ): Promise<DocumentType<UpcomingModel>> {
    return await buildFindOneQuery(Upcoming, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<UpcomingModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return await buildFindAllQuery(Upcoming, conditions);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<UpcomingModel>>,
    data: UpdateQuery<DocumentType<UpcomingModel>>,
  ): Promise<any> {
    return await Upcoming.updateOne(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<UpcomingModel>>,
  ): Promise<any> {
    return await Upcoming.deleteOne(conditions);
  }
}
