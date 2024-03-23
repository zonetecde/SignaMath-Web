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

	async function wrapedSendEmail(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			// Envoyez l'email en utilisant la méthode sendMail
			transporter.sendMail(mailOptions, (error: any, info: any) => {
				if (error) {
					resolve(false);
					return console.log(error);
				} else {
					resolve(true);
				}
			});
		});
	}

	const success: boolean = await wrapedSendEmail();

	return new Response(success ? 'Email sent!' : 'Email failed to send.');
}
