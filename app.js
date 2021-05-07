const axios = require('axios')
const interval = 3; 
const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0'


function ping() {
	axios.get(
			"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=411011&date=08-05-2021", 
			{headers: {'User-Agent': userAgent}}
	).then(
		(result) => {
			console.log(result.data);
	});
}

function getParameters() {
	if (argv.help){
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(argv.ifttt && typeof argv.ifttt !== 'string') {
		console.error('Please provide a valid IFTTT Webhook Key by appending --ifttt=<IFTTT-WEBHOOK-NAME> to recieve mobile notifications on IFTTT \nRefer documentation for more details');		
		return;
	} else if(argv.hook && !argv.key || !argv.hook && argv.key) {
		console.error('Please provide valid IFTTT Webhook Name key and a valid IFTTT Webhook Key');
		return;
	} else if(!argv.age) {
		console.error('Please provide valid minimum age key to recieve proper alerts');
		return;
	}
	} else if(!argv.pin) {
			console.error('Please provide required PIN by appending --pin=<PIN-CODE> \nRefer documentation for more details');
		return;
	} else {
		let today = new Date();
		const parameters = {
			key: argv.key,
			ifttt: argv.ifttt,
			age: argv.age,
			pinCode: argv.pin,
			date: format(today.getDate() + 1, 'dd-MM-yyyy')
		}
		console.log(parameters);
	}
}

function run(){
	getParameters();
}
ping();