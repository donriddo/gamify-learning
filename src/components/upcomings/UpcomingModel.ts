import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true,
  },
})
export class UpcomingModel {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public date!: string;
}

export default getModelForClass(
  UpcomingModel,
  { options: { customName: 'Upcoming' } },
);
