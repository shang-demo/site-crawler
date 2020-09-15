import { ArticleType } from '../components/article';
import { SiteOption } from '../components/site-select';

export interface StateType {
  options: SiteOption[];
  search: string;
  optionsValue: string[];

  articles: ArticleType[];

  time: Date;
}

function articleReducer(
  state: StateType = {
    options: [],
    search: '',
    optionsValue: [],

    articles: [],

    time: new Date(),
  },
  action: { type: string } & Record<string, any>
): StateType {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        optionsValue: action.sites ?? state.optionsValue,
        search: action.search ?? state.search,
      };
    case 'options':
      return {
        ...state,
        options: action.options,
      };
    case 'selected':
      return {
        ...state,
        optionsValue: action.optionsValue,
      };
    case 'update-articles':
      if (action.page === 1) {
        return {
          ...state,
          articles: action.articles,
        };
      }
      return {
        ...state,
        articles: [...state.articles, ...action.articles],
      };
    case 'time':
      return {
        ...state,
        time: action.time,
      };
    default:
      return state;
  }
}

function changeArticleSearch(v: { sites?: string[]; search?: string }) {
  return {
    type: 'change',
    ...v,
  };
}

function changeOptions(v: { options: SiteOption }) {
  return {
    type: 'options',
    ...v,
  };
}

function updateArticles(v: { options: SiteOption }) {
  return {
    type: 'update-articles',
    ...v,
  };
}

function changeSelected(v: { optionsValue: string[] }) {
  return {
    type: 'selected',
    ...v,
  };
}

function changeTime(v: Date) {
  return {
    type: 'time',
    time: v,
  };
}

export {
  articleReducer,
  changeArticleSearch,
  changeOptions,
  changeSelected,
  changeTime,
  updateArticles,
};
