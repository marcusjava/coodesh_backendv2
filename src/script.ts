import axios from 'axios';
import { Article, ArticleI } from './models/Articles';
import mongoose from 'mongoose';

axios.defaults.baseURL = 'https://api.spaceflightnewsapi.net/v3';

enum exitStatus {
  Failure = 1,
  Success = 0,
}

/* const MONGO_URL =
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
 */
const insertNewArticles = async (): Promise<void> => {
  const numberOfArticles = await Article.find({})
    .sort({ createdAt: -1 })
    .limit(1);
  const newItemsFromAPI = await axios.get('/articles', {
    params: { _limit: 150, _start: numberOfArticles[0].id + 1 },
  });

  Article.insertMany(newItemsFromAPI.data)
    .then((results) => {
      console.log('Arquivos carregados com sucesso!');
      //process.exit(exitStatus.Success);
    })
    .catch((error) => {
      //logger.error(error.message);
      //process.exit(exitStatus.Failure);
      console.log(error.message);
    });
};

/* (async function populate(): Promise<void> {
  await insertNewArticles();
})();
 */

export default insertNewArticles;
