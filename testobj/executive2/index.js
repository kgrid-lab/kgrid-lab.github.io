// const lcs = require('../../lcscreening/src/index')
// const crcs = require('../../crcscreening/src/index')
// const tests = require('../../testscreening/src/index')

async function process(inputs){
  var results =[]

  // Use the endpoint as key
  // var crcs = global.cxt.getExecutor('knxW84nTAdyz')
  // var lcs = global.cxt.getExecutor('knlcs')
  // var tests =  global.cxt.getExecutor('kntests')

  // Use arkid, version, path
  var crcs = global.cxt.getExecutorByID("ark:/99999/crcscreening", "v1.0.0", "qalygain")
  var lcs = global.cxt.getExecutorByID("ark:/99999/lcscreening", "v1.0.1", "qalygain")
  //var tests =  global.cxt.getExecutor('kntests')

  var output ={}
  output = await crcs.execute(inputs.patient)
  results.push(output)
  if(lcs!=null) {
    output = await lcs.execute(inputs.patient)
    results.push(output)
  }else {
    results.push({"id":"lcscreening", "service": "Lung Cancer Screening", "error":"KO not found."})
  }
  //output = await tests.execute(inputs.patient)
  //results.push(output)

  /* Sort the result by the order of the QALY gain*/
  results.sort((a,b) => {
    if(a.qaly && b.qaly) {
      return b.qaly.gain - a.qaly.gain
    } else if(b.qaly){
      return true
    } else {
      return false
	}
  })
  return results;
}

module.exports = process
