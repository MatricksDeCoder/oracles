const coinGeckoAPI = require('coingecko-api')

// run script with 
// truffle exec scripts/price.js --network development

const Oracle       = artifacts.require('Oracle.sol')

// request every 5 seconds (pull based)
const POLL_INTERVAL = 5000;

// Initiate the CoinGecko API Client
const CoinGeckoClient = new coinGeckoAPI();

let currPrice, response, bytes
// 
module.exports = async done => {

    const[_,reporter] = await web3.eth.getAccounts()   
    const oracle      = await Oracle.deployed()    
    
    while(true) {
        console.log('Fetching price: ')
        
        response  = await CoinGeckoClient.coins.fetch('bitcoin', {});
        currPrice = parseFloat(response.data.market_data.current_price.usd);
        currPrice = parseInt(currPrice * 100)    
        console.log("Price received from CoinGecko: ", currPrice)
        
        // create equivalent to below
        // bytes32 _key = keccak256(abi.encodePacked('BTC/USD'));
        bytes   = web3.utils.soliditySha3('BTC/USD')
        await oracle.updateData(
            bytes, 
            currPrice,
            {from: reporter}
          ); 
        console.log(`new price BTC/USD ${currPrice/100} updated on chain`)

        await new Promise((resolve, _) => setTimeout(resolve, POLL_INTERVAL));

    }

    done()

}


