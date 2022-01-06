import axios from 'axios';
import { Article } from './models/Articles';
import { ArticleI } from './models/Articles';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose');

const MONGO_URL =
  'mongodb+srv://space:flight@cluster0.s6rhu.mongodb.net/spaceDB?retryWrites=true&w=majority';

mongoose.connect(
  `${MONGO_URL}`,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connect to database');
  }
);

axios.defaults.baseURL = 'https://api.spaceflightnewsapi.net/v3';

(async () => {
  const results = await axios.get('/articles', { params: { _limit: 200 } });

  Article.insertMany(results.data)
    .then((results: ArticleI[]) => {
      console.log('Arquivos carregados com sucesso!');
    })
    .catch((error: any) => console.log(error.message));
})();
