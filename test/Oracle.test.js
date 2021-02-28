const Oracle      = artifacts.require('./Oracle')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Oracle', ([deployer, reporter, notReporter]) => {

    let result,txRes, oracle,bytes

    beforeEach( async () => {
        oracle = await Oracle.new(deployer)
        await oracle.updateReporter(reporter, true, {from: deployer})
        await oracle.updateReporter(notReporter, false, {from:deployer})
    })

    describe('deployment', () => {
        it('tracks the admin', async () => {
            result = await oracle.admin()
            result.should.equal(deployer)
        })

        it('tracks that reporter is authorized reporter', async ()  => {
            result = await oracle.reporters(reporter)
            result.should.equal(true)
        })

        it('tracks the notReporter is not a authorized reporter', async ()  => {
            result = await oracle.reporters(notReporter)
            result.should.equal(false)
        })
    })

    describe('updateReporter()', () => {
        it('rejects update report from not admin', async () => {
            txRes = await oracle.updateReporter(notReporter, true, {from:reporter}).should.be.rejected
        })
    
        beforeEach(async () => {
            txRes = await oracle.updateReporter(notReporter, true, {from:deployer})
        })

        it('emits UpdateReporter Event', async () => {
            const log = txRes.logs[0]
            log.event.should.eq('UpdateReporter')
            const event = log.args

            event._reporter.should.equal(notReporter, 'updated to reporter should be notReporter')
            event._isReporter.should.equal(true, 'isReporter should be true')
        })
                  
        it('updates reporter from valid admin', async () => {
            result = await oracle.reporters(notReporter)
            result.should.equal(true)
        })   
    })
    
    describe('getData() and updateData()', () => {
        beforeEach(async () => {
            bytes = web3.utils.soliditySha3('BTC/USD')
            //update data to 300 should work
            txRes = await oracle.updateData(bytes, 300, {from:reporter})   
        })    
        
        it('emits UpdateData Event', async () => {
            const log = txRes.logs[0]
            log.event.should.eq('UpdateData')
            const event = log.args

            event._updater.should.equal(reporter, 'updater of data should be reporter')
            event._payload.toString().should.equal('300', 'should be correct data update')
        })

        it('gets correct data', async () => {
            result = await oracle.getData(bytes, {from:reporter})
            result._payload.toString().should.equal('300')   
        })       
    })

})