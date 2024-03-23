import nodemailer from 'nodemailer';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get name from query
	const name = url.searchParams.get('name') || '';
	// get email from query
	const email = url.searchParams.get('email') || '';
	// get message from query
	const message = url.searchParams.get('message') || '';

	if (!name || !email || !message) {
		return new Response('Missing name, email, or message.');
	}

	try {
		let transporter = nodemailer.createTransport({
			host: process.env.host,
			port: 587,
			secure: false,
			auth: {
				user: 'zonetecde@rayanestaszewski.fr',
				pass: process.env.pass
			}
		});

		let mailOptions = {
			from: 'zonetecde@rayanestaszewski.fr',
			to: 'zonedetec@gmail.com',
			subject: 'SignaMath - ' + name + ' (' + email + ')',
			html: message
		};

		transporter.sendMail(mailOptions, (error: any, info: any) => {
			if (error) {
				return new Response('Error: ' + error);
			}
			return new Response('Email sent: ' + info.response);
		});

		return new Response('Email sent.');
	} catch (error) {
		console.log('Error: ' + error);
		return new Response('Error: ' + error);
	}
}
