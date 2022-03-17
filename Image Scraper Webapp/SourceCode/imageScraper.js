var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3082);
app.use('/static', express.static('public'));


/*
Set the pixelation key/value pair.
Receives: scraper response context (obj), scraper request parameters (obj)
Returns: context with updated pixelation value (obj)
*/
async function setPixelation(context, reqParams) {
  context.searchTerm = reqParams.searchTerm;
  if (reqParams.pixelation) {
    if (reqParams.pixelation > 199) {
      context.pixelation = 199;
    } else if (reqParams.pixelation < 0) {
      context.pixelation = 0;
    } else {
      context.pixelation = parseInt(reqParams.pixelation);
    }
  } else {
    context.pixelation = 0
  }
  return context;
}


/*
Set a response message and throw an error if no image was found, otherwise add 
image file name to context.
Receives: scraper response context (obj), PageImage Wikipedia data (obj)
Returns: context with updated image file name (obj)
*/
async function getImageFileName(context, data) {
  var pageid = Object.keys(data.query.pages);

  // In this case, no free images of the specifed subject were found
  if (pageid == -1 || !data.query.pages[pageid].thumbnail) { 
    context.noResult = "Could not find any free images of the specified search"
      + "term";
    context.result = 0;
    throw new Error('No free image results'); 
  // Otherwise, add the image file name to context
  } else {
    context.result = 1;
    context.fileName = data.query.pages[pageid].pageimage
  }  
  return context;
}


/*
Use the scraper request parameters to build a url string for the ImageInfo 
Wikipedia API.
Receives: scraper response context (obj), scraper request parameters (obj)
Returns: ImageInfo url (str)
*/
async function getImageInfoUrlString(context, reqParams) {
  var urlString;
  var urlImageInfo = "https://en.wikipedia.org/w/api.php?action=query&format="
    + "json&prop=imageinfo&iiprop=url|extmetadata|user|size&titles=File:";

  // Width was specified
  if (reqParams.width) { 
    urlString = urlImageInfo + context.fileName+"&iiurlwidth=" 
    + reqParams.width;
  }
  // Only height was specified (defaults to width if both dimensions are 
  // specified)
  else if (reqParams.height) { 
    urlString = urlImageInfo + context.fileName + "&iiurlheight=" 
    + reqParams.height;
  // No size was specified
  } else {  
    urlString = urlImageInfo + context.fileName;
  }
  return urlString;
}


/* 
Set scraper response context key/value pairs for the image url, width, height, 
description url, artist, license, and title.
Receives:  scraper response context (obj), ImageInfo Wikipedia data (obj)
Returns: scraper context with updated image info values (obj)
*/
async function setValuesWithImageInfo(context, data) {
  const prefix = data.query.pages[Object.keys(data.query.pages)].imageinfo[0];
  if (prefix.thumburl) {
    context.url = prefix.thumburl;
    context.width = prefix.thumbwidth;
    context.height = prefix.thumbheight;
  } else {
    context.url = prefix.url;
    context.width = prefix.width;
    context.height = prefix.height;
  }
  context.descriptionURL = prefix.descriptionurl;
  context.artist = prefix.extmetadata.Artist.value;
  context.licenseShortName = prefix.extmetadata.LicenseShortName.value;
  context.title = prefix.extmetadata.ObjectName.value;  
  return context;
}


/* 
Make two Wikipedia API requests (PageImage and ImageInfo), then use that data 
to update the scraper response context.
Receives: scraper response context (obj), scraper request parameters (obj), 
and next route
Returns: context with new values from Wikipedia (obj)
*/
async function getWikipediaData(context, reqParams) {
  var urlPageImages = "https://en.wikipedia.org/w/api.php?action=query&format="
    + "json&prop=pageimages&pilicense=free&titles=";

  // Query the Wikipedia API to get the file name of the specified subject
  var newContext = fetch(urlPageImages + context.searchTerm) 
    .then((pageImageRes) => pageImageRes.json())
    // Extract the name from the response data
    .then((pageImageJSON) => getImageFileName(context, pageImageJSON))
    .then((contextWithFileName) => {context = contextWithFileName})
    .then(result => getImageInfoUrlString(context, reqParams))
    // Fetch the image info properties using the file name
    .then((imageInfoUrl) => fetch(imageInfoUrl)) 
    .then((imageInfoRes) => imageInfoRes.json())
    // Use this data to set the rest of the context properties
    .then((imageInfoJSON) => setValuesWithImageInfo(context, imageInfoJSON))  
    .catch((error) => {
      console.log("Something went wrong with getWikipediaData()", error);
      if (context.result == 0) { // Threw error because no image was found
        return context;
      } else { // Got an image result but there was still an error
        next(error);
        return;
      }
    })  
  return newContext;
}


/* 
Replace the image url with the new url pointing to the pixelated version.
Receives: scraper response context (obj), pixelator response data (obj)
Returns: context with new url (obj)
*/
async function swapUrl(context, pixJSON) {
  context.url = pixJSON.new_url
  return context;
}


/* 
If pixelation was requested and an image result was found then pixelate the 
image, otherwise leave the response context unchanged.
Receives: scraper response context (obj), next route
Returns: context with the correct image url (obj)
*/
async function getPixelated(context) {
  var urlPixelator = "https://image-pixelatorio.herokuapp.com/api";
  var pixelatorBody = {
      urlString: context.url,
      pix_amount: context.pixelation    
  };

  if (context.pixelation > 0 && context.result == 1) {
    // Send the pixelator a post request with the parameters in the body
    var newContext = fetch(urlPixelator, {  
      method: "POST",
      body: JSON.stringify(pixelatorBody),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then((pixelatorRes) => pixelatorRes.json())
    .then((pixJSON) => swapUrl(context, pixJSON)) 
    .catch((error) => {
      console.log("Something went wrong with getPixelated()", error);
      next(error);
      return;
    })
    return newContext;
  } else { return context }
}


/*
Use the request parameters to get image data from Wikipedia and, if requested, 
the Pixelator image transformer
Receives: scraper request parameters (obj), next route
Returns: complete scraper context (obj)
*/
async function scrapeImage(reqParams) {
  var context = {};
 
  // Set pixelation parameter
  var scraperData = setPixelation(context, reqParams)
    // Use the request parameters to get information from Wikipedia
    .then((contextWithPixParam) => getWikipediaData(contextWithPixParam, 
      reqParams))
    // Pixelate the image if required
    .then((contextWithWikiData) => getPixelated(contextWithWikiData))
    .catch((error) => {
      console.log("Something went wrong with scrapeImage()", error);
      next(error)
      return;
    })
  return scraperData;
  }


// Home page
app.get('/', function (req, res, next) {
  var context = {};
  context.pageTitle = "Image Scraper Microservice GUI";
  res.render('Home', context);
});


// Displays the image result
app.get('/result', function (req, res, next) {
  var context = {};
  context.pageTitle = "Image Scraper Microservice GUI - Results";
  res.render('Result', context);
});


// Informs the user that no free images were found
app.get('/noresult', function (req, res, next) {
  var context = {};
  context.pageTilte = "Image Scraper Microservice GUI - No Results";
  res.render('NoResult', context);
});


// Image Scraper API documentation
app.get('/apidoc', function (req, res, next) {
  var context = {};
  context.pageTitle = "API Documentation";
  res.render('APIdoc', context);
});


// Queries to this address will deliver JSON data of the specified image
app.get('/api', function (req, res, next) {
  scrapeImage(req.query)
    // Send the response data as JSON
    .then((scraperData) => res.json(scraperData))
    .catch((error) => {
      console.log("Something went wrong with get /api", error);
      next(error)
      return;
    });
  });
  

// Posts to this address will render the data on the Result page if an image 
// was found, otherwise it will direct to the NoResult page.
app.post('/result', function (req, res, next) {
  scrapeImage(req.body)
    .then((scraperData) => {
      if (scraperData.result == 0) {
        res.render('NoResult', scraperData)
      } else {
        res.render('Result', scraperData)
      }
    })
    .catch((error) => {
      console.log("Something went wrong with post /result", error);
      next(error)
      return;
    });
});


app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function () {
  console.log("Express started on http://flip3.engr.oregonstate.edu:" 
    + app.get('port') + '; press Ctrl-C to terminate.');
});