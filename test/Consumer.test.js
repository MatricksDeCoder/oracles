const Consumer    = artifacts.require('./Consumer')
const Oracle      = artifacts.require('./Oracle')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Consumer', ([deployer,reporter]) => {

    let result,oracle,consumer, bytes, txRes

    beforeEach(async() => {
        oracle    = await Oracle.new(deployer)
        consumer  = await Consumer.new(oracle.address)
        // add a reporter to add data 
        await oracle.updateReporter(reporter, true, {from:deployer})
        // reporter updates oracle data
        bytes = web3.utils.soliditySha3('BTC/USD')
        await oracle.updateData(bytes, 75, {from:reporter})   
    })

    describe('useOracleData()', () => {
        it('returns an integer result price ', async() => {
            result = await consumer.useOracleData({from:deployer})
            result.toString().should.equal('75')
        })
        //can do tests if data changed every x interval to test before x has not changed etc
    })

})
