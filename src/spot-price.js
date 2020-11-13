require('dotenv').config();

const { JsonRpcProvider } = require('@ethersproject/providers');
const { SOR } = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');

const APP_CHAIN_ID = parseInt(process.env.APP_CHAIN_ID);
const APP_GAS_PRICE = process.env.APP_GAS_PRICE
const APP_MAX_POOLS = process.env.APP_MAX_POOLS
const ALCHEMY_ENDPOINT = process.env.ALCHEMY_ENDPOINT

async function calculate() {
	const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

	await calculateForPair(DAI, WETH, 'swapExactIn');
}

async function calculateForPair(tokenIn, tokenOut, swapType) {
	console.log('Init SOR')
	const url = 'https://cloudflare-ipfs.com/ipns/balancer-team-bucket.storage.fleek.co/balancer-exchange/pools';
	const wsProvider = new JsonRpcProvider(ALCHEMY_ENDPOINT, APP_CHAIN_ID);
	const sor = new SOR(
        wsProvider,
        new BigNumber(APP_GAS_PRICE),
        parseInt(APP_MAX_POOLS),
        APP_CHAIN_ID,
        url,
    );

    let spotPrice;

    console.log('Fetch all pools');
    await sor.fetchPools();
    console.log('Get swaps for 1 unit');
    [, , spotPrice] = await sor.getSwaps(tokenIn, tokenOut, swapType, new BigNumber('1e18'));
    console.log('Spot price', spotPrice);
    console.log('Get swaps for 10 unit');
    [, , spotPrice] = await sor.getSwaps(tokenIn, tokenOut, swapType, new BigNumber('10e18'));
    console.log('Spot price', spotPrice);
    console.log('Get swaps for 100 unit');
    [, , spotPrice] = await sor.getSwaps(tokenIn, tokenOut, swapType, new BigNumber('100e18'));
    console.log('Spot price', spotPrice);
}

calculate();
