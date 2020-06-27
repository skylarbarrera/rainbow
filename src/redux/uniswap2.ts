import { getAllPairsAndTokensV2 } from '../handlers/uniswap';
import { logger } from '../utils';

// -- Constants ------------------------------------------------------------- //
const UNISWAP2_SET_PAIRS_AND_TOKENS = 'uniswap2/UNISWAP2_SET_PAIRS_AND_TOKENS';

// -- Actions --------------------------------------------------------------- //
export const uniswap2GetAllPairsAndTokens = () => async dispatch => {
  try {
    const pairsAndToken = await getAllPairsAndTokensV2();
    if (pairsAndToken) {
      dispatch({
        payload: pairsAndToken,
        type: UNISWAP2_SET_PAIRS_AND_TOKENS,
      });
    }
  } catch (error) {
    logger.log('Error getting all pairs and tokens', error);
  }
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_UNISWAP_STATE = {
  pairs: {},
  tokens: {},
};

export default (state = INITIAL_UNISWAP_STATE, action) => {
  switch (action.type) {
    case UNISWAP2_SET_PAIRS_AND_TOKENS:
      console.log(action.payload);
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
