import './header.scss';

import { Button, Col, Layout, Row } from 'antd';
import React from 'react';

import { formatDate } from '../../utils/date';
import { SiteSearch } from '../site-search';
import { SiteOption } from '../site-select';

const { Header } = Layout;

export function MyHeader({
  time,
  search,
  optionsValue,
  options,
  onChange,
}: {
  time: Date;
  search: string;
  optionsValue: string[];
  options: SiteOption[];
  onChange: (props: { sites?: string[]; search?: string }) => void;
}) {
  return (
    <Header style={{ zIndex: 1, width: '100%' }}>
      <Row gutter={16}>
        <Col>
          <div className="logo" />
        </Col>
        <Col>
          <Button type="primary">设置</Button>
        </Col>
        <Col span={7} className="site-search">
          <SiteSearch
            search={search}
            optionsValue={optionsValue}
            options={options}
            onChange={onChange}
          ></SiteSearch>
        </Col>
        <Col flex="auto"></Col>
        <Col>{formatDate('YYYY-MM-DD hh:mm', time)}</Col>
      </Row>
    </Header>
  );
}
