import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
  },
})
export class ClassModel {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public date!: string;
}

export default getModelForClass(
  ClassModel,
  { options: { customName: 'Class' } },
);
