const fs = require('fs');
const http = require('http');

var server = http.createServer(function (req, res){
    res.writeHead(200);

    fs.readFile('C:/Users/sergi/Downloads/my_outfile.json', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(data)
      });
});

server.listen(8080);