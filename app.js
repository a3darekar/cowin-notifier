const axios = require("axios")
const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0"
const dotenv = require("dotenv");
const dateformat = require("dateformat");
dotenv.config();
let args = process.env;
const interval = process.env.interval;
const baseURL = "https://cdn-api.co-vin.in/api/v2/appointment/sessions"
//  "/calendarByPin?pincode=" + pincode + "&date=" + date

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
	} else if(args.searchByDistrict == "TRUE" && !args.districtcode) {
		console.error("Please provide required District Code in .env file as => districtcode=<XXX> \nRefer documentation for respective District Code values");
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else if(args.searchByDistrict == "FALSE" && !args.pincode) {
		console.error("Please provide required PIN code  in .env file as => pincode=<6-DIGIT-PINCODE> \nRefer documentation for more details");
		console.error("Visit https://github.com/a3darekar/cowin-notifier#readme for documentation.");
		return;
	} else {
		let date = new Date()
		date = dateformat(date, "dd-mm-yyyy")
		// date.setDate(date.getDate() + 1);
		let url = ""
		if (args.searchByDistrict == "TRUE") {
			url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" + args.districtcode + "&date=" + date
		} else {
			url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=" + args.pincode + "&date=" + date 
		}
		const parameters = {
			searchByDistrict: args.searchByDistrict,
			notifier: args.notifier,
			key: args.key,
			age: args.age,
			url: url
		}
		console.log("All inputs seem valid. Initiating the notifier loop");
		if (args.searchByDistrict == "TRUE") {
			console.log("Looking for available vaccination slots in District Code: " + args.districtcode);
		}else {
			console.log("Looking for available vaccination slots in PIN Code: " + args.pincode);
		}
		runloop(parameters);
	}
}

function ping({url, notifier, key, age}) {
	axios.get(
			url, 
			{headers: {"User-Agent": userAgent}}
	).then(
		(result) => {
			const { centers } = result.data;
			let notifierFlag = false;
			let appointmentsAvailableCount = 0;
			if (centers.length) {
				centers.forEach(center => {
					center.sessions.forEach((session => {
						if (session.min_age_limit <= +age && session.available_capacity > 0) {
							let message = session.available_capacity + " slots is/are available: " + center.name + " on " + session.date;
							console.log(message);
							notifierFlag = true;
							notify(notifier, key, message);
						}
					}));
				});
			}
			if (!notifierFlag) {
				console.error("No slots found");
			}
		}).catch((err) => {
			console.log("Error: " + err.message);
	});
}

function notify(notifier, key, message) {
	if (notifier && key) {
		axios.post("https://maker.ifttt.com/trigger/" + notifier + "/with/key/" + key, { value1: message }).then(() => {
			console.log("Sent Notification to Phone");
		}).catch((err) => {
			console.log("Error: " + err.message);
		});
	} else {
		console.log("Slots found");
	}
}

function runloop(parameters){
	let pingCount = 0;
	timer = setInterval(() => {
		pingCount += 1;
		console.log("\n\nChecking COWIN site for available slot at " + dateformat(Date.now(), "HH:MM") + " - Ping No. #" + pingCount);
		ping(parameters);
	}, interval * 60000);
}

getParameters();