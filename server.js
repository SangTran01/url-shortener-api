const express = require('express');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');
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

app.get('/', function(req,res){
	res.render('index');
});

app.get('/api/whoami/', function(req,res) {
	console.log(req.headers);
	const clientIp = requestIp.getClientIp(req); 
	var language = req.headers['accept-language'];
	var software = req.headers['user-agent'];

	//stripping string for language info
	var comma = language.indexOf(',');
	language = language.substring(0, comma != -1 ? comma : language.length);


	//stripping string for software info
	software = software.substring(software.indexOf("(") + 1);
	var rightParanthese = software.indexOf(')');
	software = software.substring(0, rightParanthese != -1 ? rightParanthese : software.length);

	//send response
	res.json({
		ipaddress:clientIp,
		language:language,
		software:software
	});
});


// listen for requests
app.listen(process.env.port || app.get('port'), () => {
console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});