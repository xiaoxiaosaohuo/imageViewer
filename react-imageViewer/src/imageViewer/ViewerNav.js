import  React,{PureComponent} from 'react';
import classnames from 'classnames/bind';
import {isEqual} from 'lodash';
import styles from "./style.css";
let cn = classnames.bind(styles);

export default class ViewerNav extends PureComponent {
    constructor(props){
        super(props);
    }

  handleChangeImg = (newIndex) => {
    if (this.props.activeIndex === newIndex) {
      return;
    }
    this.props.onChangeImg(newIndex);
  }

  shouldComponentUpdate(nextProps){
      const {marginLeft,activeIndex,images} = nextProps;
      if(marginLeft!=this.props.marginLeft){
          return true
      }
      if(activeIndex!= this.props.activeIndex){
          return true;
      }
      if(!isEqual(images,this.props.images)){
          return true;
      };

      return false
  }

  render() {
    let marginLeft =this.props.marginLeft;
    let width = this.props.images.length*141+6;
    let listStyle = {
      marginLeft: `${marginLeft}px`,
      width:`${width}px`
    };

    return (
        <div className={cn("navbar")}>
        <span className={cn(["iconfont" ,"icon-prev", "controlBtn", "toLeft"])} onClick={this.props.handlePrev}>
        </span>
          <div className={cn(`${this.props.prefixCls}-navbar`)} ref = {this.props.navbar} id="navbar">
            <ul className={cn(`${this.props.prefixCls}-list`,`${this.props.prefixCls}-list-transition`)} style={listStyle}>
              {this.props.images.map((item, index) =>
                <li
                key={index}
                className={cn(index === this.props.activeIndex ? 'active' : '')}
                onClick={this.handleChangeImg.bind(this, index)}
                >
                  <img src={item.src} alt={item.alt} />
                </li>
                )
              }
            </ul>
          </div>
          <span className={cn(["iconfont", "icon-next" ,"controlBtn", "toRight"])} onClick={this.props.handleNext}>
          </span>
      </div>
    );
  }
}

ViewerNav.defaultProps = {
   activeIndex: 0,
 };
