import { IpcMainInvokeEvent } from 'electron';
import dataToRenderer from '../toRenderer/dataToRenderer';
import sendErrorToRenderer from '../toRenderer/errorToRenderer';
import { SearchResult } from './types';
import log from '../util/log';
import { snippets } from '../snippet/util';

export async function handleSearchInput(
  _event: IpcMainInvokeEvent,
  text: string
) {
  try {
    const returnableResults: SearchResult[] = await snippets(text);

    dataToRenderer('SEARCH:RESULTS', returnableResults);
  } catch (error) {
    log(error);
    sendErrorToRenderer(error);
  }
}
