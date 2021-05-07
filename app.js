const axios = require('axios')
const interval = 3;
const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0'
const dotenv = require('dotenv');
const dateformat = require('dateformat');
dotenv.config();
let args = process.env;


function ping(parameters) {
	axios.get(
			"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=" + parameters.pincode + "&date=" + parameters.date, 
			{headers: {'User-Agent': userAgent}}
	).then(
		(result) => {
			console.log(result.data);
		}, (error) => {
			console.log(error);
	});
}

function getParameters() {
	if (args.help){
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(args.ifttt && typeof args.ifttt !== 'string') {
		console.error('Please provide a valid IFTTT Webhook Key by appending --ifttt=<IFTTT-WEBHOOK-NAME> to recieve mobile notifications on IFTTT \nRefer documentation for more details');		
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(args.ifttt && !args.key || !args.ifttt && args.key) {
		console.error('Please provide valid IFTTT Webhook Name key and a valid IFTTT Webhook Key');
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(!args.age) {
		console.error('Please provide valid minimum age key to recieve proper alerts');
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(!args.pincode) {
		console.error('Please provide required PIN by appending --pin=<PIN-CODE> \nRefer documentation for more details');
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else {
		let date = new Date()
		date.setDate(date.getDate() + 1);
		const parameters = {
			key: args.key,
			ifttt: args.ifttt,
			age: args.age,
			pincode: args.pincode,
			date: dateformat(date, 'dd-mm-yyyy')
		}
		console.log(parameters);
		ping(parameters);
	}
}

function run(){
	getParameters();
}

run();