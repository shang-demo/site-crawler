import { Avatar, List, Skeleton } from 'antd';
import React from 'react';

import { formatDate } from '../../utils/date';

export interface ArticleType {
  _id?: string;
  href: string;
  site: string;
  intro: string;
  gatherTime: string;
  img: string;
  title: string;
}

export function Article({
  article,
}: {
  article: ArticleType & { loading?: boolean };
}) {
  return (
    <List.Item
      extra={
        article.loading ? (
          ''
        ) : (
          <div>
            {formatDate('YYYY-MM-DD hh:mm', new Date(article.gatherTime))}
          </div>
        )
      }
    >
      <Skeleton avatar title={false} loading={article.loading} active>
        <List.Item.Meta
          avatar={<Avatar src={article.img} />}
          title={
            <a href={article.href} rel="noopener noreferrer" target="_blank">
              [{article.site}] {article.title}
            </a>
          }
          description={article.intro}
        />
      </Skeleton>
    </List.Item>
  );
}
