//Email

//notifications

//otp
export const GenerateOtp = () => {
	const otp = Math.floor(1000000 + Math.random() * 900000);
	const expiry = new Date();
	expiry.setTime(new Date().getTime() + 60 * 60 * 1000);

	return { otp, expiry };
};

export const onOTPRequest = async (otp: number, toPhoneNumber: string) => {
	try {
		const accountSid = "ACb9c7a64a45311bcc63e612d973361f5a";
		const authToken = "3ce3fdb8782aaf1f82dacb0c28ef8702";
		const client = require("twilio")(accountSid, authToken);

		const response = await client.messages.create({
			body: `Your otp is: ${otp}`,
			// from: "+12232142030",
			messagingServiceSid: "MGa94779bbc72ade970ae5c4298e09dbd6",
			to: toPhoneNumber,
		});

		console.log("________----------_________", response, "________----------_________");
		return response;
	} catch (error) {
		console.log("******_____________**********", error, "******_____________**********");
	}
};

//payment notification or emails
