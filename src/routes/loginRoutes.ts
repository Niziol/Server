import { Request, Response, Router, NextFunction } from 'express';

interface RequestBody extends Request {
	body: { [key: string]: string | undefined };
}

function requireAuthentication(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	if (request.session && request.session.loggedIn) {
		next();
		return;
	}

	response.status(403);
	response.send(`
    <div>
      <p>Not permitted</p>
      <a href="/">Evacuate</a>
    </div>
  `);
}

const router = Router();

router.get('/login', (request: Request, response: Response) => {
	response.send(`
    <form method='POST'>
      <div>
        <label>Email</label>
        <input name='email' />
      </div>
      <div>
        <label>Password</label>
        <input name='password' type='password' />
      </div>
      <button>Submit</button>
    </form>
  `);
});

router.post('/login', (request: RequestBody, response: Response) => {
	const { email, password } = request.body;

	if (email && password && email === 'test@test.com' && password === 'test') {
		request.session = { loggedIn: true };
		response.redirect('/');
	} else {
		response.send(`
      <div>
        <p>Invalid email or password</p>
        <a href="/login">Try again?</a>
      </div>
    `);
	}
});

router.get('/', (request: Request, response: Response) => {
	if (request.session && request.session.loggedIn) {
		response.send(`
      <div>
        <p>You are logged in</p>
        <a href="/logout">Logout</a>
      </div>
    `);
	} else {
		response.send(`
      <div>
        <p>You are not logged in</p>
        <a href="/login">Login</a>
      </div>
    `);
	}
});

router.get('/logout', (request: Request, response: Response) => {
	request.session = undefined;
	response.redirect('/');
});

router.get(
	'/protected',
	requireAuthentication,
	(request: Request, response: Response) => {
		response.send(`
      <div>
        <p>Welcome in protected route, logged in user</p>
        <a href="/">Home</a>
      </div>
    `);
	}
);

export { router };
