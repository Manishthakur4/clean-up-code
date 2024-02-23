const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    const latestMessage = fs.readFileSync('message.txt', 'utf8').trim();

    res.write('<html>');
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body>');
    res.write(`<p>${latestMessage}</p>`);
    res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form>');
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const newMessage = parsedBody.split('=')[1];

      fs.writeFileSync('message.txt', newMessage);

      res.statusCode = 302;
      res.setHeader('Location', '/');
      return res.end();
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hello, this is my first Node.js server!</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports.handler = requestHandler;
module.exports.someText = "Some extra Text here";


