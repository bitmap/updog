var formidable = require('formidable');
var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
  if (request.url == '/upload' && request.method.toLowerCase() == 'post') {

    var form = new formidable.IncomingForm();

    form.uploadDir = __dirname + '/uploaded';
    form.keepExtensions = true;

    form.on('file', function(field, file) {
      fs.rename(file.path, form.uploadDir + "/" + file.name);
    })

    form.parse(request, function(err, fields, files) {
      response.writeHead(200, {'content-type': 'text/html'});
      response.write('<img src="' + form.uploadDir + '/' + files.upload.name + '">');
      response.end();
    });

    form.onPart = function(part) {
      if(!part.filename || part.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
        this.handlePart(part);
      }
    }

    return;
  }

  fs.readFile('./index.html', function (err, data){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  });

}).listen(138);