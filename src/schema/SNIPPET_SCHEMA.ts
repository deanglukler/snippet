import * as yup from 'yup';

export const allowedFilenameChars = /^[a-zA-Z0-9._-\s]+$/;

export const SNIPPET_SCHEMA = yup.object().shape({
  body: yup.string().required(),
  title: yup
    .string()
    .matches(
      allowedFilenameChars,
      'Title can only contain letters, numbers, periods, underscores, and hyphens.'
    )
    .required(),
  metadata: yup
    .object()
    .shape({
      tags: yup.array(),
      timestampMili: yup.number(),
    })
    .required(),
});
