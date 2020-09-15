import { Layout } from 'antd';
import React, { Component, Fragment } from 'react';

import ArticleList from '../article-list';
import Header from '../header/header';

export class Home extends Component {
  public render() {
    return (
      <Fragment>
        <Layout>
          <Header></Header>
        </Layout>
        <ArticleList></ArticleList>``
      </Fragment>
    );
  }
}
