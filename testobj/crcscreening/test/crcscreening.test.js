const scoreFunction = require('../src/index')
const config = require('../src/config.json')

let outputs = {
  "result": {
    "name": "Colorectal Cancer Screening",
    "qaly":  {
      "gain": ["2.600989", "3.955557","0.946593"]
    }
  }
}

config.filenames.age.forEach(function(e, index){
  if(index<=2){
    test('First Row', () => {
        let inputs = {
          "features":
          {
            "age": e,
            "gender": "Male",
            "race":"Non-hispanic white",
            "smoker": false,
            "colitis": false,
            "fap": false,
            "hiv": "No",
            "famcrc": "None"
          }
        }
        expect(scoreFunction(inputs).qaly.gain).toEqual(outputs.result.qaly.gain[index]);
    })
  }
});

test('Good Inputs', () => {
    let inputs =  {
        "features":
        {
          "age": 50,
          "race": "All Other Race",
          "gender": "Female",
          "edu": 5,
          "emp": true,
          "famlc": 2,
          "smokeyear": 30,
          "quityear": 7,
          "cigpday": 5,
          "bmi": 32.5,
          "colitis": false,
          "fap": true,
          "hiv": "Unknown",
          "famcrc": "None"
        }
  }
    let outputs = {
      "result": {
          "name": "Colorectal Cancer Screening",
          "qaly": {
                  "index": "1731",
                  "value": "1731,50,1,3,0,0,1,1,1,0,16.963659,16.076511,15.342934,14.757739,-1.620725,-1.318772",
                  "noscreening": "16.076511",
                  "screening": "14.757739",
                  "gain": "-1.318772"
                }
    }
  }
    expect(scoreFunction(inputs).qaly.gain).toEqual(outputs.result.qaly.gain);

});
