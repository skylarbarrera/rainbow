import { forEach, get, keys, omit } from 'lodash';

// -- Constants ------------------------------------------------------------- //
const MULTICALL_UPDATE_RESULTS = 'multicall/MULTICALL_UPDATE_RESULTS';
const MULTICALL_ADD_LISTENERS = 'multicall/MULTICALL_ADD_LISTENERS';
const MULTICALL_REMOVE_LISTENERS = 'multicall/MULTICALL_REMOVE_LISTENERS';

// -- Actions --------------------------------------------------------------- //
export interface Call {
  address: string;
  callData: string;
}

export function toCallKey(call: Call): string {
  return `${call.address}-${call.callData}`;
}

export const multicallAddListeners = ({ calls, chainId }) => (
  dispatch,
  getState
) => {
  const { listeners: existingListeners } = getState().multicall;
  const updatedListeners = {
    ...existingListeners,
  };

  updatedListeners[chainId] = updatedListeners[chainId] ?? {};

  forEach(calls, call => {
    const callKey = toCallKey(call);
    updatedListeners[chainId][callKey] =
      (updatedListeners[chainId][callKey] ?? 0) + 1;
  });

  dispatch({
    payload: updatedListeners,
    type: MULTICALL_ADD_LISTENERS,
  });
};

export const multicallRemoveListeners = ({ chainId, calls }) => (
  dispatch,
  getState
) => {
  const { listeners: existingListeners } = getState().multicall;
  let updatedListeners = {
    ...existingListeners,
  };

  if (!updatedListeners[chainId]) return;

  forEach(calls, call => {
    const callKey = toCallKey(call);
    if (!updatedListeners[chainId][callKey]) return;
    if (updatedListeners[chainId][callKey] === 1) {
      updatedListeners = omit(updatedListeners, `[${chainId}][${callKey}]`);
    } else {
      updatedListeners[chainId][callKey]--;
    }
  });
  dispatch({
    payload: updatedListeners,
    type: MULTICALL_REMOVE_LISTENERS,
  });
};

export const multicallUpdateResults = ({ chainId, results, blockNumber }) => (
  dispatch,
  getState
) => {
  const { results: existingResults } = getState().multicall;
  const updatedResults = {
    ...existingResults,
  };
  forEach(keys(results), callKey => {
    const current = get(results, `[${chainId}][${callKey}]`);
    if ((current?.blockNumber ?? 0) > blockNumber) return;
    updatedResults[chainId][callKey] = { blockNumber, data: results[callKey] };
  });

  dispatch({
    payload: updatedResults,
    type: MULTICALL_UPDATE_RESULTS,
  });
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_MULTICALL_STATE = {
  listeners: {},
  results: {},
};

export default (state = INITIAL_MULTICALL_STATE, action) => {
  switch (action.type) {
    case MULTICALL_ADD_LISTENERS:
      return {
        ...state,
        listeners: action.payload,
      };
    case MULTICALL_REMOVE_LISTENERS:
      return {
        ...state,
        listeners: action.payload,
      };
    case MULTICALL_UPDATE_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    default:
      return state;
  }
};
