const MIN_TO_SEC = [60, 0];
const HOUR_TO_SEC = [3600, 0];
const DAY_TO_SEC = [86400, 0];
const DEGREE_TO_RAD = [0.01745329251, 0];
const MINUTE_TO_RAD = [0.0002908882, 0];
const SECOND_TO_RAD = [0.00000484813, 0];
const HECTARE_TO_METER2 = [10000, 0];
const LITER_TO_METER3 = [0.001, 0];
const TONNE_TO_KILOG = [1000, 0];
const AU_TO_M = [149597870700, 0];
const NEPER_TO_DIMLESS = [1, 0];
const BEL_TO_DIMLESS = [1.1512925465, 0];
const DECIBEL_TO_DIMLESS = [0.11512925465, 0];

var express = require('express');
var router = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Unit Coverter' });
});

router.get(/api/, function(req, res) {
  var unitString = req.query.unit_string;
  var parsed = parseString(unitString);
  var unit_name = getUnits(parsed);
  var multiplication_factor = getConversionFactor(parsed, 0);
  var linear_shift = getConversionFactor(parsed, 1);
  res.json({ "unit_name": unit_name, "multiplication_factor": multiplication_factor, "linear_shift":  linear_shift });
});

/*
*/
function parseString(str, re){
  var result = [];
  var current = "";
  for (var i = 0; i < str.length; i++){
    if (str[i] == "*" || str[i] == "/"){
      result.push(current);
      result.push(str[i]);
      current = "";
    } else {
      current += str[i];
    }
  }
  result.push(current);
  return result;
}

/*

*/
function getUnits(parsed) {
  var result = "";
  for (var i = 0; i < parsed.length; i+=2){
    if (parsed[i] == "minutes"){
      result += "seconds";
      parsed[i] = MIN_TO_SEC;
    } else if (parsed[i] == "hours"){
      result += "seconds";
      parsed[i] = HOUR_TO_SEC;
    } else if (parsed[i] == "days"){
      result += "seconds";
      parsed[i] = DAY_TO_SEC;
    } else if (parsed[i] == "degrees"){
      result += "radians";
      parsed[i] = DEGREE_TO_RAD;
    } else if (parsed[i] == "\'"){
      result += "radians";
      parsed[i] = MINUTE_TO_RAD;
    } else if (parsed[i] == "seconds" || parsed[i] == "\'\'"){
      result += "radians";
      parsed[i] = SECOND_TO_RAD;
    } else if (parsed[i] == "hectares"){
      result += "meters^2";
      parsed[i] = HECTARE_TO_METER2;
    } else if (parsed[i] == "liters"){
      result += "meters^3";
      parsed[i] = LITER_TO_METER3;
    } else if (parsed[i] == "AU"){
      result += "meters";
      parsed[i] = AU_TO_M;
    } else if (parsed[i] == "tonnes"){
      result += "kilograms";
      parsed[i] = TONNE_TO_KILOG;
    } else if (parsed[i] == "nepers"){
      result = result.substring(0, result.length - 1);
      parsed[i] = NEPER_TO_DIMLESS;
    } else if (parsed[i] == "bels"){
      result = result.substring(0, result.length - 1);
      parsed[i] = BEL_TO_DIMLESS;
    } else if (parsed[i] == "decibels"){
      result = result.substring(0, result.length - 1);
      parsed[i] = DECIBEL_TO_DIMLESS;
    } else if (parsed[i] == "meters" || parsed[i] == "kilograms" || parsed[i] == "seconds" || parsed[i] == "radians"){
      result += parsed[i];
      parsed[i] = [1, 0];
    } else {
      return "";
    }

    if (parsed[i + 1] == "*" || parsed[i + 1] == "/"){
      result += parsed[i + 1];
    } else if (i == parsed.length - 1) {
      return result;
    } else {
      return "";
    }
  }
}

/*

*/
function getConversionFactor(parsed, index){
  var mult = parsed[0][0];
  var shift = parsed[0][1];
  for (var i = 1; i < parsed.length; i += 2){
    console.log(i + ": " + mult + ", " + shift);
    if (parsed[i] == "*") {
      mult = mult * parsed[i+1][0];
      shift = shift * mult + parsed[i+1][1];
    } else if (parsed[i] == "/"){
      mult = mult / parsed[i+1][0];
      shift = shift * mult + parsed[i+1][1];
    }
    console.log(i + ": " + mult + ", " + shift);
  }
  if (index === 0) {
    return mult;
  } else if (index === 1) {
    return shift;
  }
}

module.exports = router;
