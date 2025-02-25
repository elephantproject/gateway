import {
  Currency,
  CurrencyAmount,
  Fetcher,
  Pair,
  Percent,
  Router,
  Token,
  TokenAmount,
  Trade,
} from '@crocswap/sdk';
import { BigNumber } from 'ethers';
import {
  Pairish,
  Percentish,
  UniswapishSwapParameters,
} from '../../services/common-interfaces';
import {
  CronosBaseUniswapishSDKProvider,
  CronosBaseUniswapishConnector,
} from '../../chains/cronos/cronos-base/cronos-base-uniswapish-connector';
import routerAbi from './abi.json';
import { MadMeerkatConfig } from './mad_meerkat.config';
import { NetworkConfig } from '../../network/network.utils';

export class MadMeerkat extends CronosBaseUniswapishConnector {
  constructor(chain: string, network: string) {
    const sdkProvider = new MadMeerkatSDKProvider();
    super(sdkProvider, routerAbi, chain, network);
  }
  protected buildConfig(): NetworkConfig {
    return MadMeerkatConfig.config;
  }
}

class MadMeerkatSDKProvider implements CronosBaseUniswapishSDKProvider {
  public buildToken(
    chainId: number,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    projectLink?: string
  ): Token {
    return new Token(chainId, address, decimals, symbol, name, projectLink);
  }

  public buildTokenAmount(token: Token, amount: BigNumber): TokenAmount {
    return new TokenAmount(token, amount.toString());
  }

  public fetchPairData(
    tokenA: Token,
    tokenB: Token,
    provider?: import('@ethersproject/providers').BaseProvider
  ): Promise<Pairish> {
    return Fetcher.fetchPairData(tokenA, tokenB, provider);
  }

  public bestTradeExactIn(
    pairs: Pair[],
    currencyAmountIn: CurrencyAmount,
    currencyOut: Currency,
    bestTradeOptions?: {
      maxNumResults?: number;
      maxHops?: number;
    },
    currentPairs?: Pair[],
    originalAmountIn?: CurrencyAmount,
    bestTrades?: Trade[]
  ): Trade[] {
    return Trade.bestTradeExactIn(
      pairs,
      currencyAmountIn,
      currencyOut,
      bestTradeOptions,
      currentPairs,
      originalAmountIn,
      bestTrades
    );
  }

  public bestTradeExactOut(
    pairs: Pair[],
    currencyIn: Currency,
    currencyAmountOut: CurrencyAmount,
    bestTradeOptions?: {
      maxNumResults?: number;
      maxHops?: number;
    },
    currentPairs?: Pair[],
    originalAmountOut?: CurrencyAmount,
    bestTrades?: Trade[]
  ): Trade[] {
    return Trade.bestTradeExactOut(
      pairs,
      currencyIn,
      currencyAmountOut,
      bestTradeOptions,
      currentPairs,
      originalAmountOut,
      bestTrades
    );
  }

  public buildPercent(numerator: string, denominator?: string): Percentish {
    return new Percent(numerator, denominator);
  }

  public minimumAmountOut(
    trade: Trade,
    slippageTolerance: Percent
  ): CurrencyAmount {
    return trade.minimumAmountOut(slippageTolerance);
  }

  public maximumAmountIn(
    trade: Trade,
    slippageTolerance: Percent
  ): CurrencyAmount {
    return trade.maximumAmountIn(slippageTolerance);
  }

  public swapCallParameters(
    trade: Trade,
    tradeOptions: {
      allowedSlippage: Percent;
      ttl: number;
      recipient: string;
      feeOnTransfer?: boolean;
      deadline?: number;
    }
  ): UniswapishSwapParameters {
    return Router.swapCallParameters(trade, tradeOptions);
  }
}
