const express = require('express');
const bodyParser = require('body-parser');
const { URL } = require('url');
const app = express();

app.set('port', (process.env.PORT || 3000));


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// error handling middleware
app.use(function(err, req, res, next){
console.log(err); // to see properties of message in our console
res.status(422).send({error: err.message});
});
	

var num;
var url;

app.get('/', function(req,res){
	res.render('index');
});

app.get('/new/:url*', function(req,res){

	// Create short url, store and display the info.
	var baseUrl = req.protocol + '://' + req.headers.host + "/";
	url = req.url.slice(5);
	var urlObj = {};
	if (validateURL(url)) {
		//confirmed valid now create short url

		//get random num concat to url
		num = Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4);
		var newLink = baseUrl + num;
		console.log('newLink');
		console.log(newLink);

		urlObj = {"original_url": url, "short_url":newLink};
		res.send(urlObj);
	} else {
		urlObj = {
			"error": "Wrong url format, make sure you have a valid protocol and real site."
		};
		res.send(urlObj);
	}

});

app.get('/:num', function(req,res) {
	console.log(num);
	console.log(req.params.num);
	if (req.params.num === num) {
		res.redirect(url);
	} else {
		urlObj = {
			"error": "Wrong url format, make sure you have a valid protocol and real site."
		}
		res.send(urlObj);
	}
})

//helper functions
function validateURL(url) {
	// Checks to see if it is an actual url
	// Regex from https://gist.github.com/dperini/729294
	var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	return regex.test(url);
}

// listen for requests
app.listen(process.env.port || app.get('port'), () => {
console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});