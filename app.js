const axios = require("axios")
const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0"
const dotenv = require("dotenv");
const dateformat = require("dateformat");
dotenv.config();
let args = process.env;
const interval = process.env.interval;

function getParameters() {
	if (args.help){
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(args.notifier && typeof args.notifier !== "string") {
		console.error("Please provide a valid IFTTT Webhook Key in .env file as => notifier=<IFTTT-WEBHOOK-NAME> to recieve mobile notifications on IFTTT \nRefer documentation for more details");		
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(args.notifier && !args.key || !args.notifier && args.key) {
		console.error("Please provide valid IFTTT Webhook Name key and a valid IFTTT Webhook Key  in .env file");
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(!args.age) {
		console.error("Please provide valid minimum age key in .env file to recieve proper alerts");
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(!args.pincode) {
		console.error("Please provide required PIN code  in .env file as => pincode=<6-DIGIT-PINCODE> \nRefer documentation for more details");
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else {
		let date = new Date()
		date.setDate(date.getDate() + 1);
		const parameters = {
			notifier: args.notifier,
			key: args.key,
			age: args.age,
			pincode: args.pincode,
			date: dateformat(date, "dd-mm-yyyy")
		}
		console.log(parameters);
		runloop(parameters);
	}
}

function ping({notifier, key, age, pincode, date}) {
	axios.get(
			"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=" + pincode + "&date=" + date, 
			{headers: {"User-Agent": userAgent}}
	).then(
		(result) => {
			const { centers } = result.data;
			console.log(centers);
			let slotInfo = "";
			let appointmentsAvailableCount = 0;
			if (centers.length) {
				centers.forEach(center => {
					center.sessions.forEach((session => {
						if (session.min_age_limit <= +age && session.available_capacity > 0) {
							let message = session.available_capacity + " slots is/are available: " + center.name + " on " + session.date;
							notify(notifier, key, message);
						}else{
							console.error("no slots");
						}
					}))
				});
			}
		}).catch((err) => {
			console.log("Error: " + err.message);
	});
}

function notify(notifier, key, message) {
	if (notifier && key) {
		axios.post("https://maker.ifttt.com/trigger/" + notifier + "/with/key/" + key, { value1: message }).then(() => {
			console.log("Sent Notification to Phone");
		}).catch((err) => {console.error(err)});
	} else {
		console.log("Slots found");
		console.log(slotInfo);
	}
}

function runloop(parameters){
	let pingCount = 0;
	timer = setInterval(() => {
		pingCount += 1;
		console.log("Ping Count - ", pingCount);
		ping(parameters);
	}, interval * 6000);
}

getParameters();