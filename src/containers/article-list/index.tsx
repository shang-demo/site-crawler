import './index.scss';

import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import { ArticleType } from '../../components/article';
import { ArticleList } from '../../components/article-list';
import { StateType, updateArticles } from '../../reducers/article';
import { myFetch } from '../../utils/fetch';

class ArticleListContainer extends Component<{
  articles: ArticleType[];
  search: string;
  optionsValue: string[];

  updateArticles: (v: { page: number; articles: ArticleType[] }) => void;
}> {
  public readonly state = {
    isMore: undefined,
    limit: 10,

    oldOptionsValue: [],
    oldSearch: '',

    loading: false,
  };

  public componentDidUpdate() {
    // 检测是否需要加载
    if (!this.props.optionsValue.length && this.state.isMore === undefined) {
      this.setState({ isMore: true });
    }

    if (this.isSame()) {
      return;
    }

    this.setState({
      oldOptionsValue: this.props.optionsValue,
      oldSearch: this.props.search,
    });
    // 查询条件变更, 需要重新载入
    this.loadMore(1);
  }

  public render() {
    return (
      <div className="list">
        <InfiniteScroll
          initialLoad={true}
          pageStart={0}
          loadMore={this.loadMore.bind(this)}
          hasMore={this.state.isMore}
          useWindow={true}
        >
          <ArticleList
            loading={this.state.loading}
            list={this.props.articles}
          ></ArticleList>
        </InfiniteScroll>
      </div>
    );
  }

  public async loadMore(page: number) {
    console.info('page: ', page, this.props.optionsValue);
    this.setState({ isMore: false, loading: true });

    const list = await myFetch.next({
      inputPage: page,
      search: this.props.search,
      inputLimit: this.state.limit,
      sites: this.props.optionsValue,
    });

    this.props.updateArticles({ page, articles: list });

    this.setState({ isMore: list.length >= this.state.limit, loading: false });
  }

  private isSame() {
    if (this.state.oldSearch !== this.props.search) {
      return false;
    }

    if (
      this.state.oldOptionsValue.sort().join(',') !==
      this.props.optionsValue.sort().join(',')
    ) {
      return false;
    }

    return true;
  }
}

export default connect(
  (state: StateType) => {
    return {
      ...state,
    };
  },
  (dispatch) => {
    return {
      updateArticles: (v: any) => {
        dispatch(updateArticles(v));
      },
    };
  }
)(ArticleListContainer);
