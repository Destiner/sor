require('dotenv').config();

const { WebSocketProvider } = require('@ethersproject/providers');
const { SOR } = require('@balancer-labs/sor');
const BigNumber = require('bignumber.js');

const APP_CHAIN_ID = parseInt(process.env.APP_CHAIN_ID);
const APP_GAS_PRICE = process.env.APP_GAS_PRICE
const APP_MAX_POOLS = process.env.APP_MAX_POOLS
const ALCHEMY_WS_ENDPOINT = process.env.ALCHEMY_WS_ENDPOINT

async function calculate() {
	const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	const MKR = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2';
	const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';

	await calculateForPair(WETH, MKR, 'swapExactIn');
	await calculateForPair(WETH, MKR, 'swapExactOut');
	await calculateForPair(WETH, DAI, 'swapExactIn');
	await calculateForPair(WETH, DAI, 'swapExactOut');
}

async function calculateForPair(tokenIn, tokenOut, swapType) {
	console.log('Init SOR')
	const wsProvider = new WebSocketProvider(ALCHEMY_WS_ENDPOINT, APP_CHAIN_ID);
	const sor = new SOR(
        wsProvider,
        new BigNumber(APP_GAS_PRICE),
        parseInt(APP_MAX_POOLS),
        APP_CHAIN_ID,
    );

    const amount = new BigNumber('1e18');

    console.log('Fetch pools')
    // await sor.fetchFilteredPairPools(tokenIn, tokenOut);
    await sor.fetchPools();
    console.log('Get swaps')
    const [tradeSwaps, tradeAmount] = await sor.getSwaps(tokenIn, tokenOut, swapType, amount);
    console.log('Swaps', tradeSwaps.length, tradeAmount.toString());
}

calculate();
