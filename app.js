const axios = require('axios')
const interval = 5; 
const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0'


function ping() {
	axios.get(
			"https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin?pincode=411011&date=07-05-2021", 
			{headers: {'User-Agent': userAgent}}
	).then(
		(result) => {
			console.log(result.data);
	});
}
ping();