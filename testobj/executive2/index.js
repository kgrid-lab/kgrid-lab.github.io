async function process(inputs){
  var results =[]

  // Use arkid, version, path
  var cervcs = global.cxt.getExecutorByID("ark:/99999/cervcscreening", "1.0.0", "qalygain")
  var crcs = global.cxt.getExecutorByID("ark:/99999/crcscreening", "1.0.0", "qalygain")
  var lcs = global.cxt.getExecutorByID("ark:/99999/lcscreening", "1.0.1", "qalygain")
  //var tests =  global.cxt.getExecutor('kntests')

  var output ={}
  if(cervcs!=null) {
    output = await cervcs.execute(inputs.patient)
    results.push(output)
  }else {
    results.push({"id":"cervcscreening", "service": "Cervical Cancer Screening", "error":"KO not found."})
  }
  if(crcs!=null) {
    output = await crcs.execute(inputs.patient)
    results.push(output)
  }else {
    results.push({"id":"crcscreening", "service": "Colorectal Cancer Screening", "error":"KO not found."})
  }
  if(lcs!=null) {
    output = await lcs.execute(inputs.patient)
    results.push(output)
  }else {
    results.push({"id":"lcscreening", "service": "Lung Cancer Screening", "error":"KO not found."})
  }

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
