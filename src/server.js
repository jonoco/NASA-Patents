import express from 'express';
import util from 'util';
import jade from 'jade';
import bodyParser from 'body-parser';
import { logger } from './middleware';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 9000;
const API_KEY = process.env.API_KEY || 'DEMO_KEY';
const ROOT_URL = 'https://api.nasa.gov/patents/content';

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
	res.render('index', {});
});

app.get('/search', logger, (req, res) => {

  const query = req.query.keyword || null;
  
  if (query) {
    const limit = 500;
    const tags = false;
    const url = `${ROOT_URL}?query=${query}&limit=${limit}&tags=${tags}&api_key=${API_KEY}`;

    axios.get(url)
      .then( response => {
        res.render('index', { data: response.data });
        console.log('Response status: ' + response.status);
      })
      .catch( response => {
        if (response instanceof Error) {
          console.log('Error: ', response.message);
          res.render('index', { error: response.message });
        } else {
          console.log('Errored Response status: ' + response.status);
          res.render('index', { error: response.status });
        }
    });
    
  } else {
    res.render('index', {});
  }
  
});

// Handle 404
app.use( (req, res, next) => {
  res.status(404).send('Sorry can\'t find that!');
});

// Handle errors
app.use( (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);  
}); 
