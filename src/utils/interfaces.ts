import { Request } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import { AssignmentModel } from '../components/assignments/AssignmentModel';

export interface IRequest extends Request {
  assignment: DocumentType<AssignmentModel>;
}
