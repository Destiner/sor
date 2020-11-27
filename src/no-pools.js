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
	const THETA = '0x3883f5e181fccaf8410fa61e12b59bad963fb645';

	await calculateForPair(WETH, THETA, '1e18', 'swapExactIn');
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

    console.log('Fetch pools')
    await sor.fetchFilteredPairPools(tokenIn, tokenOut);
    // await sor.fetchPools();
    console.log('Get swaps')
    const [tradeSwaps, tradeAmount] = await sor.getSwaps(tokenIn, tokenOut, swapType, amountNumber);
    console.log('Swaps', tradeSwaps.length, tradeAmount.toString());
}

calculate();
