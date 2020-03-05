const qalyears = require('@kgrid/qalyutil/qalylookup')
const ptlevels = require('@kgrid/qalyutil/ptlvlConverter')
const lookupindexer = require('@kgrid/qalyutil/lookupIndexer')
const config = require('./config.json')

function qalygain(inputs){
  var features = inputFeatures(inputs)
  var ptlvl = ptlevels(config,features)
  var luindex = lookupindexer(__dirname, config, inputs.features.age, ptlvl)
  var outputObj = {}
  outputObj.id=config.id
  outputObj.service = config.service
  if(Object.keys(luindex).length!=0){
    var result = qalyears(config, luindex)
    if(Object.keys(result).length!=0){
      outputObj.qaly = result
      outputObj.data_source = {}
      outputObj.data_source.updateDate = config.updatedOn
      outputObj.data_source.type = config.datatype
    } else {
      outputObj.error = "Data missing."
    }
  } else {
    outputObj.error = "No data available."
  }
  return outputObj
}

function inputFeatures(pt){
  /* ----- Derived Features ----- */
  pt.features.smoker = (pt.features.smokeyear>0) && (pt.features.quityear==0)
  pt.features.obesity = pt.features.bmi>=30
  //  Colorectal Cancer Screening  //

  var features = JSON.parse(JSON.stringify(config.factors))
  for( var key in features){
    features[key]=pt.features[key]
  }

  /* ----- Mapped Features ----- */
  features.race = raceMapping(features.race)
  // Colorectal Cancer Screening

  return features
}

function raceMapping(race){
  const raceMap = {
    // Common
    "Non-hispanic white":"Non-hispanic white",
    "Hispanic":"Hispanic",
    // CRC Screening
    "Non-hispanic black":"Non-hispanic black",
    "All Other Race":"All Other Race",
    // Lung Cancer Screening
    "Non-hispanic Black/African American":"Non-hispanic black",
    "Non-Hispanic American Indian/Alaska Native":"All Other Race",
    "Non-Hispanic Asian or Pacific Islander":"All Other Race",
    "Non-Hispanic Unknown Race":"All Other Race"
  }
  return raceMap[race] || "All Other Race"

}

module.exports= qalygain
