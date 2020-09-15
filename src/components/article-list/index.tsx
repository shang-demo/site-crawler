import { List } from 'antd';
import React, { useEffect, useState } from 'react';

import { Article, ArticleType } from '../article';

export function ArticleList({
  list,
  loading,
}: {
  list: ArticleType[];
  loading: boolean;
}) {
  const [loadingList, setList] = useState(list);

  useEffect(() => {
    if (loading) {
      setList([
        ...list,
        ...new Array(3).fill(0).map((_, index) => {
          return {
            href: `mock_${index}`,
            site: '',
            intro: '',
            gatherTime: '',
            img: '',
            title: '',
            loading: true,
          };
        }),
      ]);
    } else {
      setList(list);
    }
  }, [list, loading]);

  return (
    <List
      itemLayout="horizontal"
      size="large"
      dataSource={loadingList}
      renderItem={(item) => {
        return <Article key={item.href} article={item}></Article>;
      }}
    ></List>
  );
}
