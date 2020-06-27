import { get, isEmpty } from 'lodash';
import { getReserve } from '../handlers/uniswap';
import { web3Provider } from '../handlers/web3';
import { logger } from '../utils';
import { multicallUpdateOutdatedListeners } from './multicall';
import { uniswapUpdateTokenReserves } from './uniswap';

// -- Actions ---------------------------------------- //
const web3UpdateReserves = () => async (dispatch, getState) => {
  const { inputCurrency, outputCurrency } = getState().uniswap;

  if (!(inputCurrency || outputCurrency)) return;
  try {
    const [inputReserve, outputReserve] = await Promise.all([
      getReserve(get(inputCurrency, 'address')),
      getReserve(get(outputCurrency, 'address')),
    ]);

    dispatch(uniswapUpdateTokenReserves(inputReserve, outputReserve));
  } catch (error) {
    logger.log('Error updating Uniswap token reserves', error);
  }
};

const web3UpdateUniswapV2Reserves = blockNumber => async (
  dispatch,
  getState
) => {
  const { listeners } = getState().multicall;
  try {
    if (isEmpty(listeners)) return;
    dispatch(multicallUpdateOutdatedListeners(blockNumber));
  } catch (error) {
    logger.log(
      '[web3 listener] - Error updating Uniswap V2 token reserves',
      error
    );
  }
};

export const web3ListenerInit = () => dispatch => {
  web3Provider.pollingInterval = 10000;
  web3Provider.on('block', () => dispatch(web3UpdateReserves()));
  web3Provider.on('block', blockNumber =>
    dispatch(web3UpdateUniswapV2Reserves(blockNumber))
  );
};

export const web3ListenerStop = () => () => {
  web3Provider.removeAllListeners('block');
};
