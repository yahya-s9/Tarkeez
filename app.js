const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

// create empty variables because EJS will try to render them
// during logic of get request.
var city = ""; var cityWithComma = ""; var country = "";
var fajr = ""; var sunrise = ""; var dhuhr = "";
var asr = ""; var maghrib = ""; var isha = "";

//global middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // now can serve up local files
app.set('view engine',"ejs");

// When client browser makes get request at the root..
app.get("/", function(req, res)
{
  // req is request client sends to our server
  // res is the response we send to client server

// everytime index.ejs is loaded, render the value
// of these variables in place of their respective keys
  res.render('index', {
    CityKey: cityWithComma,
    CountryKey: country,
    fajrKey: fajr,
    dhuhrKey: dhuhr,
    asrKey: asr,
    maghribKey: maghrib,
    ishaKey: isha
  });

}); // end logic of how to handle get request

app.post("/", function(req, res){

  // grab city & country from the form
  city = req.body.citySubmission;
  country = req.body.countrySubmission;
  cityWithComma = city + ",";

  // URL of our API call, passing in the city & country user chose.
  const url = "https://api.aladhan.com/v1/timingsByCity?city=" + city + "&country=" + country + "&method=2";

  // use https package to make a get request to API
  https.get(url, function(apiresponse){

    // tap into  API's response using the "on" method.
    apiresponse.on("data", function(data) {

      //convert hexidecimal sting apiData to JSON format
      const apiData = JSON.parse(data);

      // collect prayer times from apiData
      fajr = apiData.data.timings.Fajr;
      dhuhr = apiData.data.timings.Dhuhr;
      asr = apiData.data.timings.Asr;
      maghrib = apiData.data.timings.Maghrib;
      isha = apiData.data.timings.Isha;

      // now redirect so EJS can render everyhting
      res.redirect("/");

    }); // end logic of how to handle api response
  }); // end logic of api request
}); // end logic of how to handle post request from the form

app.listen(process.env.PORT || 3000, function(){
console.log("Server running on port 3000");
})

//timings according to ISNA
