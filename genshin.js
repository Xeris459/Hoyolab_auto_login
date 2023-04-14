require("dotenv").config();
const fetch = require("node-fetch");
const ACT_ID = "e202102251931481";

if (process.env.HOYOLAB_COOKIE && process.env.HOYOLAB_COOKIE.length != 0) {
	GenshinRequest(process.env.HOYOLAB_COOKIE);
}

async function GenshinRequest(cookie) {
	const data = await checkDailyNotSigned(cookie);
	if (data.signed == true) return;
	await DailySigned(cookie);
	const data2 = await checkDailyNotSigned(cookie);

	if (data2.total_sign_day == data.total_sign_day) return console.log(`failed to sigh in, because traveler already sign`);

	console.log(`your sign in is success, your total sign in is ${data2.sign_cnt}`);
}

async function checkDailyNotSigned(cookie) {
	try {
		const response = await fetch(`https://sg-hk4e-api.hoyolab.com/event/sol/resign_info?lang=en-us&act_id=${ACT_ID}`, {
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/json;charset=UTF-8",
				"sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"x-rpc-language": "en-us",
				cookie: `${cookie}`,
			},
			referrer: "https://www.hoyolab.com/",
			referrerPolicy: "strict-origin-when-cross-origin",
			method: "GET",
			mode: "cors",
		});

		const data = await response.json();
		if (data.data == null) throw data.message;

		return data.data;
	} catch (error) {
		console.log("check info failed with error: " + error);
		return false;
	}
}

async function DailySigned(cookie) {
	try {
		const response = await fetch(`https://sg-hk4e-api.hoyolab.com/event/sol/sign?lang=en-us`, {
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/json;charset=UTF-8",
				"sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",
				"x-rpc-language": "en-us",
				cookie: `${cookie}`,
			},
			body: `{"act_id":"${ACT_ID}"}`,
			referrer: "https://www.hoyolab.com/",
			referrerPolicy: "strict-origin-when-cross-origin",
			method: "POST",
			mode: "cors",
		});

		const data = await response.json();
		if (data.data == null) throw data.message;
	} catch (error) {
		console.log("check info failed with error: " + error);
	}
}
