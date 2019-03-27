const express = require('express'),
  fs = require('fs'),
  app = express(),
  webCrypto = requiere('WebCrypto '), 
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  xml = require('./api/models/firmaModel'),
  receptor = require('./api/models/receptorModel'),
  bodyParser = require('body-parser'),
  axios = require('axios'),
  convert = require('xml-js'),
  postedData =
  `<?xml version='1.0' encoding='UTF-8'?>
  <SolicitaTokenRequest>
    <usuario>47250763</usuario>
    <apikey>2CjGSRYDfrkXOcW2xQbOEVV</apikey>
  </SolicitaTokenRequest>`;

  let file_buffered = fs.readFileSync('./key/llave.pfx');
  const password_buffered = pvutils.stringToArrayBuffer('E/2019/Fcs');
  const asn1 = asn1js.fromBER(file_buffered);
  
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://mongo/Facturadb', {useNewUrlParser: true });
  
  let key = '';
  let factura = '';
  let encabezado = '<?xml version="1.0" encoding="UTF-8"?><RegistraDocumentoXMLRequest id="866437D6-0BE3-467C-947C-EC8018DB0AE9"><xml_dte><![CDATA[';
  let cuerpo;
  let pie = '<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" Id="Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" /><ds:Reference Id="Reference-e663d691-a74b-4230-b53b-e3caba86b1f2" URI="#DatosEmision"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>r3F+fJc/lAte9veqOCqbEmkYtyfnFtfI9rOlaz2WHUo=</ds:DigestValue></ds:Reference><ds:Reference Id="ReferenceKeyInfo" URI="#KeyInfoId-Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>BwqtH5URkflcWis8P9SAhY+qeODkt/daxRWHyT/Y8iw=</ds:DigestValue></ds:Reference><ds:Reference Type="http://uri.etsi.org/01903#SignedProperties" URI="#SignedProperties-Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>rUtWT3llyhTNKMYppRtGwcoJQ2im/OO1vtJfnsEKOFI=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue Id="SignatureValue-3d1a91ad-2d0d-471d-93f0-82c12b45b217">wHxEDRHQcOg87pg9LPdayDUVd9XfWiZ5iAhkB2QTlbuKAI/HguMoEBnqoPajmYcasPUoOx+ZQVcqkcAg8BRggUIL5o+Xw/4JcHw6JdDTayUjGLBgvVImK69N2fH3Qy6+MQ/5HxN4xPX7qR35asGCx48cHvlf4dBzWfWA4lhA5CNzHQBeg49mkR6NVV1Ca/IK9fsDsIjVQCHgG22K9ce59m2B2cmTHI3ELX/t9MTncPQ+mDItYs6qLBqDA7cPjsyT867a6vOL11UxnRBjkztTDCfB+LCqMQnP6u5EzYOrupZwJ0FAYnbbAMIao5Li/uL+LCvDPRowGpKbfJy/66bk9Q==</ds:SignatureValue><ds:KeyInfo Id="KeyInfoId-Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><ds:X509Data><ds:X509Certificate>MIIDUjCCAjqgAwIBAgIISF6w2fgaROIwDQYJKoZIhvcNAQELBQAwKTEMMAoGA1UEAwwDRkVMMQwwCgYDVQQKDANTQVQxCzAJBgNVBAYTAkdUMB4XDTE5MDIyNTEzNTE1NloXDTIxMDIyNDEzNTE1NlowKDERMA8GA1UEAwwINDcyNTA3NjMxEzARBgNVBAoMCnNhdC5nb2IuZ3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDBaDT6B0SaBu0UZnc3X6jBoqipINceo9ZaZJqU6es5Vhls6UZdxSzaHU+NMjdtbsPCvdI2F02LKZUOJkI+Y4f08TCj0k2a6Tda1+iB8U7wwWEusp0bqZpUop0xGGEYSZE4wmnbQODWISz0YGJfQ3M6WCREOSjoqdWoTWS6g5+vwGwmaQu6OLUwQ3rVg1g8AXaQ3QuSglGqwGphAxzkqz9zpcMmWZY5r4mfigyAm25/AQUEYIEXZEBKJs4++MbwznsVst/kGVgrm6FI7LxvyvfysY4qaKjPadPAcqswftisVnFg/Duy3mWVFo4z+Ki00WGKs4tnxIdk3IN9B/zDtWBLAgMBAAGjfzB9MAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUc73zilJsM5hZ1/fQrbFzjLRQSgowHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMB0GA1UdDgQWBBQPwcfKFe+ObJ7M5N5OliAciRG6izAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggEBAChaQI1Fc+6icZqqWJ/LulGTCTPcE2DRi5wKwFL1wyiMCcpCkyLomiXCneh9osjAutHkWmn/QBxy74wblIhtzZFkfr1AlbgO902phI4nM4ttjOqOtaJnlCIy7/uKQeMAADB8DG2rvK9SlKjqv1OCA7exegV2/h+bwQ1P2pZVFEXZek4WXIwVJFSuAMRjs0zQEkQ3dLU5fCff+AfcgcI2ZEJd622rJjRphGf186IgVNYWHCearien6V1i+FT2PsmKIYdvkkVXsgrQCMOw5Z9nZiA3CafaKHHpGvY/b/hwHqyr0DpIuV/tHlR+tK+vXgwyQcrQ0lX2soWEz16+8TXJ7Kw=</ds:X509Certificate></ds:X509Data><ds:KeyValue><ds:RSAKeyValue><ds:Modulus>wWg0+gdEmgbtFGZ3N1+owaKoqSDXHqPWWmSalOnrOVYZbOlGXcUs2h1PjTI3bW7Dwr3SNhdNiymVDiZCPmOH9PEwo9JNmuk3WtfogfFO8MFhLrKdG6maVKKdMRhhGEmROMJp20Dg1iEs9GBiX0NzOlgkRDko6KnVqE1kuoOfr8BsJmkLuji1MEN61YNYPAF2kN0LkoJRqsBqYQMc5Ks/c6XDJlmWOa+Jn4oMgJtufwEFBGCBF2RASibOPvjG8M57FbLf5BlYK5uhSOy8b8r38rGOKmioz2nTwHKrMH7YrFZxYPw7st5llRaOM/iotNFhirOLZ8SHZNyDfQf8w7VgSw==</ds:Modulus><ds:Exponent>AQAB</ds:Exponent></ds:RSAKeyValue></ds:KeyValue></ds:KeyInfo><ds:Object Id="XadesObjectId-f3c98373-bb80-40f2-8c05-6e411c94a0f1"><xades:QualifyingProperties xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" Id="QualifyingProperties-1fa2dfc3-f1e1-4691-b756-5c461ab2f699" Target="#Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><xades:SignedProperties Id="SignedProperties-Signature-3d1a91ad-2d0d-471d-93f0-82c12b45b217"><xades:SignedSignatureProperties><xades:SigningTime>2019-03-25T11:02:58-06:00</xades:SigningTime><xades:SigningCertificate><xades:Cert><xades:CertDigest><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" /><ds:DigestValue>3dG5+4D5zw0SLBEibIJ6gVYhDk+RPxSURPjcHr5AEa0=</ds:DigestValue></xades:CertDigest><xades:IssuerSerial><ds:X509IssuerName>C=GT, O=SAT, CN=FEL</ds:X509IssuerName><ds:X509SerialNumber>5214799868758476002</ds:X509SerialNumber></xades:IssuerSerial></xades:Cert></xades:SigningCertificate></xades:SignedSignatureProperties><xades:SignedDataObjectProperties><xades:DataObjectFormat ObjectReference="#Reference-e663d691-a74b-4230-b53b-e3caba86b1f2"><xades:MimeType>text/xml</xades:MimeType><xades:Encoding>UTF-8</xades:Encoding></xades:DataObjectFormat></xades:SignedDataObjectProperties></xades:SignedProperties></xades:QualifyingProperties></ds:Object></ds:Signature></dte:GTDocumento>]]></xml_dte></RegistraDocumentoXMLRequest>';

axios.post('https://dev.api.ifacere-fel.com/fel-dte-services/api/solicitarToken', postedData, {
  headers: {
    'content-type': 'application/xml'
  }
})
  .then(res => {
    //console.log(res);
    key = convert.xml2js(res.data, {compact: true, spaces: 2});
  })
  .catch(error => {
    //console.log(error);
  });

io.sockets.on('connect', socket => {
  io.sockets.emit('key', key);
  io.sockets.emit('factura', factura);
  socket.on('body', body => {
    cuerpo = body;
    sendFactura();
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let firmaRoutes = require('./api/routes/firmaRoute');
firmaRoutes(app);

let recepotrRoutes = require('./api/routes/receptorRoute');
recepotrRoutes(app);

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

function sendFactura() {
  const url = 'https://dev.api.ifacere-fel.com/fel-dte-services/api/registrarDocumentoXML';
  const auth = 'Bearer ' + key.SolicitaTokenResponse.token._text;
  factura = encabezado + cuerpo + pie;
  axios.post(url, factura.toString(), {
    headers : {
      'content-type': 'application/xml;charset=utf-8',
      'Authorization': auth
    }
  }).then(res => {
    console.log(res);
    console.log(factura);
  }).catch(err => {
    console.log(err);
    console.log(factura);
  });
}

server.listen(port);

console.log('Servidor xml corriendo en puerto' + port);