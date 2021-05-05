import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, SaveOptions, UpdateQuery } from 'mongoose';
import { buildFindAllQuery, buildFindOneQuery } from '../../utils/app';
import Class, { ClassModel } from './ClassModel';

export default class ClassService {
  public static async createOne(
    classObj: ClassModel,
    options?: SaveOptions,
  ): Promise<ClassModel> {
    return await Class.create(classObj, options);
  }

  public static async createMany(
    classes: ClassModel[],
    options?: SaveOptions,
  ): Promise<ClassModel[]> {
    return await Class.create(classes, options);
  }

  public static async findOne(
    conditions: FilterQuery<DocumentType<ClassModel>>,
  ): Promise<DocumentType<ClassModel>> {
    return await buildFindOneQuery(Class, conditions);
  }

  public static async findAll(
    conditions: FilterQuery<DocumentType<ClassModel>>,
  ): Promise<{
    data: any;
    meta: {
      limit: number;
      offset: number;
      total: number;
    }
  }> {
    return await buildFindAllQuery(Class, conditions);
  }

  public static async update(
    conditions: FilterQuery<DocumentType<ClassModel>>,
    data: UpdateQuery<DocumentType<ClassModel>>,
  ): Promise<any> {
    return await Class.updateMany(conditions, data);
  }

  public static async remove(
    conditions: FilterQuery<DocumentType<ClassModel>>,
  ): Promise<any> {
    return await Class.deleteOne(conditions);
  }
}
