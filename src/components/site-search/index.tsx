import './index.scss';

import { Col, Input, Row } from 'antd';
import React from 'react';

import { SiteOption, SiteSelect } from '../site-select';

export function SiteSearch({
  search,
  optionsValue,
  options,
  onChange,
}: {
  search: string;
  optionsValue: string[];
  options: SiteOption[];
  onChange: (props: { sites?: string[]; search?: string }) => void;
}) {
  function handleOptionsChange(v: string[]) {
    onChange({
      sites: v,
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({
      search: e.target.value,
    });
  }

  return (
    <Input.Group>
      <Row>
        <Col span={8}>
          <Input defaultValue={search} onChange={handleInputChange} />
        </Col>
        <Col span={16} className="site-select">
          <SiteSelect
            options={options}
            optionsValue={optionsValue}
            onChange={handleOptionsChange}
          ></SiteSelect>
        </Col>
      </Row>
    </Input.Group>
  );
}
