import axios from 'axios';
import { Article, ArticleI } from './models/Articles';

axios.defaults.baseURL = 'https://api.spaceflightnewsapi.net/v3';

const insertNewArticles = async (): Promise<void> => {
  const numberOfArticles = await Article.find({});

  const newItemsFromAPI = await axios.get('/articles', {
    params: { _limit: 150, _start: numberOfArticles[0]?.id + 1 },
  });

  Article.insertMany(newItemsFromAPI.data)
    .then((results) => {
      console.log('Arquivos carregados com sucesso!');
      // process.exit(exitStatus.Success);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default insertNewArticles;
