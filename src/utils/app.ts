import * as createError from 'http-errors';
import { omit } from 'lodash';
import * as validator from 'lx-valid';
import { createLogger, transports } from 'winston';

import * as config from '../../config';

const isProduction = config.get('env') === 'production';
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  transports: [
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

export function validate(object, schema, options) {
  const fn = options.isUpdate ? validator.getValidationFunction() : validator.validate;
  const result = fn(object, schema, Object.assign({ cast: true }, options));

  if (!result.valid) {
    const msg = `'${result.errors[0].property}' ${result.errors[0].message}`;
    throw createError(400, msg, result.errors);
  }
}

export function processPopulate(query) {
  const paths = query?.split('.');
  let currentPopulate;
  while (paths?.length) {
    const path = paths.pop();
    const populate: any = { path };

    if (currentPopulate) {
      currentPopulate = { path, populate: currentPopulate };
    } else {
      currentPopulate = populate;
    }
  }

  return currentPopulate;
}

export function buildPopulateQuery(populate, cursor) {
  const populateFields = populate?.split(',');
  if (populateFields?.length) {
    populateFields.forEach((field) => {
      cursor = cursor.populate(processPopulate(field));
    });
  }

  return cursor;
}

export async function buildFindOneQuery(model, conditions) {
  const populate = conditions.$populate;
  const query = omit(conditions, ['$offset', '$limit', '$populate']);

  const cursor = model.findOne(query);

  const data = await buildPopulateQuery(populate, cursor);

  return data;
}

export async function buildFindAllQuery(
  model,
  conditions,
) {
  const limit = parseInt(conditions.$limit || 10, 10);
  const offset = parseInt(conditions.$offset || 0, 10);
  const search = conditions.$search;
  const populate = conditions.$populate;
  const query = omit(conditions, ['$offset', '$limit', '$populate', '$search']);

  const total = await model.countDocuments(query);

  let cursor = model.find(query);

  cursor = cursor.skip(offset).limit(limit);

  const data = await buildPopulateQuery(populate, cursor);

  return {
    data,
    meta: { limit, offset, total },
  };
}

export const loggerStream = {
  write: (message) => (isProduction ? logger : console).info(message.trim()),
};
