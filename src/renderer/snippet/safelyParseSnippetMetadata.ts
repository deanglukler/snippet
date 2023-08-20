import log from '../util/log';
import { SnippetMetaData } from '../../types';

export default function safelyParseMetadata(
  fileContent: string
): SnippetMetaData {
  let partialMetadata: Partial<SnippetMetaData> = {};
  try {
    partialMetadata = JSON.parse(fileContent) as Partial<SnippetMetaData>;
  } catch (err) {
    log(err);
  }
  return {
    tags: partialMetadata.tags || [],
    timestampMili: partialMetadata.timestampMili || 0,
    liked: partialMetadata.liked || false,
  };
}
