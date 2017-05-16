import  React,{PureComponent} from 'react';
import Icon, { ActionType } from './Icon';
import {debounce} from "lodash";
import classnames from 'classnames/bind';
import styles from "./style.css";
let cn = classnames.bind(styles);

export default class ViewerToolbar extends PureComponent {

  constructor() {
    super();
  }

  handleAction = (type) => {
    this.props.onAction(type)
  }
  shouldComponentUpdate(nextProps){
      const {activeIndex} = nextProps;
      if(activeIndex!=this.props.activeIndex){
          return true
      }
      return false
  }

  render() {
    let featureNodeArr = [];
    if (this.props.zoomable) {
      featureNodeArr = featureNodeArr.concat([
        <li
        key="zoomIn"
        className={cn(`${this.props.prefixCls}-btn`)}
        onClick={() => {this.handleAction(ActionType.zoomIn);}}>
          <Icon type={ActionType.zoomIn}/>
        </li>,
        <li
        key="zoomOut"
        className={cn(`${this.props.prefixCls}-btn`)}
        onClick={() => {this.handleAction(ActionType.zoomOut);}}>
          <Icon type={ActionType.zoomOut}/>
        </li>,
      ]);
    }
    if (this.props.changeable) {
      featureNodeArr = featureNodeArr.concat([
        <li
        key="prev"
        className={cn(`${this.props.prefixCls}-btn`)} onClick={() => {this.handleAction(ActionType.prev);}}>
          <Icon type={ActionType.prev}/>
        </li>,
        <li
        key="reset"
        className={cn(`${this.props.prefixCls}-btn`)} onClick={() => {this.handleAction(ActionType.reset);}}>
          <Icon type={ActionType.reset}/>
        </li>,
        <li
        key="next"
        className={cn(`${this.props.prefixCls}-btn`)} onClick={() => {this.handleAction(ActionType.next);}}>
          <Icon type={ActionType.next}/>
        </li>,
      ]);
    }
    if (this.props.rotatable) {
      featureNodeArr = featureNodeArr.concat([
        <li
        key="rotateLeft"
        className={cn(`${this.props.prefixCls}-btn`)}
        onClick={() => {this.handleAction(ActionType.rotateLeft);}}>
          <Icon type={ActionType.rotateLeft}/>
        </li>,
        <li
        key="rotateRight"
        className={cn(`${this.props.prefixCls}-btn`)}
        onClick={() => {this.handleAction(ActionType.rotateRight);}}>
          <Icon type={ActionType.rotateRight}/>
        </li>,
      ]);
    }

    return (
      <div className={cn(`${this.props.prefixCls}-footerLayOut`)}>
       <span className={cn(`${this.props.prefixCls}-tips`)}>{this.props.activeIndex+1}/{this.props.length}</span>
        <ul className={cn(`${this.props.prefixCls}-toolbar`)}>
          {featureNodeArr}
        </ul>
      </div>
    );
  }
}
