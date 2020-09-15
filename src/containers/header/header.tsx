import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MyHeader } from '../../components/header/header';
import { SiteOption } from '../../components/site-select';
import {
  changeArticleSearch,
  changeOptions,
  changeSelected,
  changeTime,
  StateType,
} from '../../reducers/article';
import { myFetch } from '../../utils/fetch';

class HeaderContainer extends Component<
  {
    changeTime: (v: Date) => void;
    changeOptions: (v: { options: SiteOption[] }) => void;
    changeSelected: (v: { optionsValue: string[] }) => void;
    changeArticleSearch: (v: {
      sites?: string[] | undefined;
      search?: string | undefined;
    }) => void;
  } & StateType
> {
  public componentDidMount() {
    Promise.all([this.loadSelected(), this.loadSites(), this.loadTime()]).catch(
      console.warn
    );
  }

  public render() {
    return (
      <MyHeader
        time={this.props.time}
        options={this.props.options}
        optionsValue={this.props.optionsValue}
        search={this.props.search}
        onChange={this.onChange.bind(this)}
      ></MyHeader>
    );
  }

  public onChange(v: { sites?: string[]; search?: string }) {
    if (v.sites) {
      localStorage.setItem('selectedSites', JSON.stringify(v.sites));
    }

    this.props.changeArticleSearch(v);
  }

  private async loadSelected() {
    const v = localStorage.getItem('selectedSites');
    let arr = [];
    try {
      arr = JSON.parse(v ?? '');
    } catch (e) {
      console.warn(e);
    }

    this.props.changeSelected({
      optionsValue: arr,
    });
  }

  private async loadSites() {
    const sites = await myFetch.sites();

    this.props.changeOptions({
      options: sites.map((v) => {
        return {
          label: v,
          value: v,
        };
      }),
    });
  }

  private async loadTime() {
    const time = await myFetch.time();

    this.props.changeTime(time);
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
      changeTime: (v: any) => {
        dispatch(changeTime(v));
      },
      changeOptions: (v: any) => {
        dispatch(changeOptions(v));
      },
      changeArticleSearch: (v: any) => {
        dispatch(changeArticleSearch(v));
      },
      changeSelected: (v: any) => {
        dispatch(changeSelected(v));
      },
    };
  }
)(HeaderContainer);
