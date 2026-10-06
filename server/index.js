const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const port = 3000;

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = router.db.get('users').find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos' });
  }

  const { password: _, ...publicUser } = user;
  res.json({ token: `fake-token-${user.id}`, user: publicUser });
});

server.use((req, res, next) => {
  const auth = req.headers.authorization || '';

  if (!auth.startsWith('Bearer fake-token-')) {
    return res.status(401).json({ message: 'Token inválido ou ausente' });
  }

  next();
});

server.use('/users', (req, res) => {
  res.status(403).json({ message: 'Acesso negado' });
});

server.use(router);

server.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
