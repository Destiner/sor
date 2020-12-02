require('dotenv').config();

const { JsonRpcProvider } = require('@ethersproject/providers');
const { SOR } = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');

const APP_CHAIN_ID = parseInt(process.env.APP_CHAIN_ID);
const APP_GAS_PRICE = process.env.APP_GAS_PRICE
const APP_MAX_POOLS = process.env.APP_MAX_POOLS
const ALCHEMY_ENDPOINT = process.env.ALCHEMY_ENDPOINT

async function calculate() {
    const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
    const BAL = '0xba100000625a3754423978a60c9317c58a424e3D';

    await calculateForPair(USDC, BAL, '1e9', 'swapExactIn'); // 1000
}

async function calculateForPair(tokenIn, tokenOut, amount, swapType) {
    console.log('Init SOR')
    const url = 'https://ipfs.fleek.co/ipns/balancer-team-bucket.storage.fleek.co/balancer-exchange/pools';
    const wsProvider = new JsonRpcProvider(ALCHEMY_ENDPOINT, APP_CHAIN_ID);
    const sor = new SOR(
        wsProvider,
        new BigNumber(APP_GAS_PRICE),
        parseInt(APP_MAX_POOLS),
        APP_CHAIN_ID,
        url,
    );

    const amountNumber = new BigNumber(amount);

    console.log('Fetch all pools')
    await sor.fetchPools();
    [, , spotPrice] = await sor.getSwaps(tokenIn, tokenOut, swapType, amountNumber);
    console.log('Spot price', spotPrice.toNumber());
}

calculate();
