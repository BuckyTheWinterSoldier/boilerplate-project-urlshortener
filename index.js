require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const URL=require('url');
const dns = require('dns'); 
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
app.use(bodyParser.urlencoded({ extended: false }))
mongoose.connect('mongodb+srv://ashokravi:ashokravi@cluster0.xk9uy7l.mongodb.net/URL_Shortner?retryWrites=true&w=majority&appName=Cluster0')
  .then(console.log('connected!'));
  const urlSchema=mongoose.Schema({
    originalURL:{type:String,required:true}
  })
  const URLRepo=mongoose.model('URLRepo',urlSchema);
app.get('/api/shorturl/:shortURL',async(request,response)=>{
  const {url}=request.params;
  const responsePayload=await URLRepo.findById(url);
  response.redirect(responsePayload.originalURL);
})
app.post('/api/shorturl',async(request,response)=>{
  // console.log(request);
  // const url=request.body.url;
  const url = URL.parse(request.body.url, true);
  const hostName=url.hostname;
  dns.lookup(hostName,(error,address,family)=>{
    if(error){
    response.json({ error: 'invalid url' });
    }
  })
  console.log(url);
  const resposnePayload = await URLRepo.create({originalURL:url.href});
  // console.log(resposnePayload);
  response.json({ original_url : resposnePayload.originalURL, short_url : resposnePayload._id});
});