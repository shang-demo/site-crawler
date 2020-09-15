import { Select } from 'antd';
import React from 'react';

const { Option } = Select;

export interface SiteOption {
  label: string;
  value: string;
}

export function SiteSelect({
  optionsValue,
  options,
  onChange,
}: {
  optionsValue: string[];
  options: SiteOption[];
  onChange: (v: string[]) => void;
}) {
  const children = options.map(({ value, label }) => {
    return (
      <Option key={value} value={value} label={label}>
        <div className="demo-option-label-item">{value}</div>
      </Option>
    );
  });

  function handleChange(value: string[]) {
    onChange(value);
  }

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="选择站点"
      value={optionsValue}
      onChange={handleChange}
      optionLabelProp="label"
    >
      {children}
    </Select>
  );
}
