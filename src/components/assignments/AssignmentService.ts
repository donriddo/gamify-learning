import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import Assignment, { AssignmentModel } from './AssignmentModel';

export default class AssignmentService {
  public static async createOne(
    assignment: AssignmentModel,
    options?: SaveOptions,
  ): Promise<DocumentType<AssignmentModel>> {
    return await Assignment.create(assignment, options);
  }

  public static async createMany(
    assignments: AssignmentModel[],
    options?: SaveOptions,
  ): Promise<DocumentType<AssignmentModel>[]> {
    return await Assignment.create(assignments, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<AssignmentModel>>,
  ): Promise<DocumentType<AssignmentModel>> {
    return await buildFindOneQuery(Assignment, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<AssignmentModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return await buildFindAllQuery(Assignment, conditions);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<AssignmentModel>>,
    data: UpdateQuery<DocumentType<AssignmentModel>>,
  ): Promise<any> {
    return await Assignment.updateOne(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<AssignmentModel>>,
  ): Promise<any> {
    return await Assignment.deleteOne(conditions);
  }
}
