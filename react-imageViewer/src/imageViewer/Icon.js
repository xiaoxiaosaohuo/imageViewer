import  React,{PureComponent} from 'react';
import classnames from 'classnames/bind';
import styles from "./style.css";
let cn = classnames.bind(styles);

export const   ActionType =  {
  zoomIn : "zoomIn",
  zoomOut : "zoomOut",
  prev : "prev",
  next : "next",
  rotateLeft : "rotateLeft",
  rotateRight : "rotateRight",
  reset : "reset",
  close : "close",
  scaleX : "scaleX",
  scaleY : "scaleY",
}

export default class Icon extends PureComponent{
    shouldComponentUpdate(nextProps){
        if(nextProps.type!=this.props.type){
            return true
        }
        return false;
    }
  render() {
    let prefixCls = 'icon';
    return (
      <i className={cn("iconfont",`${prefixCls}-${ActionType[this.props.type]}`)}></i>
    );
  }
}
