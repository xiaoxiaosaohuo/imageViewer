import  React,{PureComponent} from 'react';
import Loading from './Loading';
import classnames from 'classnames/bind';
import {isEqual} from 'lodash';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import styles from "./style.css";
let cn = classnames.bind(styles);

export default class ViewerCanvas extends PureComponent{

  constructor() {
    super();

    this.state = {
      isMouseDown: false,
      mouseX: 0,
      mouseY: 0,
      imgKey:0
    };

  }

  componentDidMount() {
    if (this.props.drag) {
      this.bindEvent();
    }
  }

  handleResize = (e) => {
    this.props.onResize();
  }

  handleMouseDown = (e) => {
    if (!this.props.visible || !this.props.drag) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isMouseDown: true,
      mouseX: e.nativeEvent.pageX,
      mouseY: e.nativeEvent.pageY,
    });
  }

  handleMouseMove = (e) => {
    if (this.state.isMouseDown) {
      let diffX = e.x - this.state.mouseX;
      let diffY = e.y - this.state.mouseY;
      this.setState({
        mouseX: e.x,
        mouseY: e.y,
      });
      this.props.onChangeImgState(this.props.width, this.props.height, this.props.top + diffY, this.props.left + diffX);
    }
  }

  handleMouseUp = (e) => {
    this.setState({
      isMouseDown: false,
    });
  }

  handleMouseScroll = (e) => {
    let direct: 0 | 1 | -1 = 0;
    if (e.wheelDelta) {
      direct = e.wheelDelta > 0 ? 1 : -1;
    }else if (e.detail) {
      direct = e.detail > 0 ? 1 : -1;
    }
    if (direct !== 0) {
      let pageX = e.pageX;
      let pageY = e.pageY;
      this.props.onZoom(pageX, pageY, direct, .05);
    }
  }

  bindEvent = (remove) => {
    let funcName = 'addEventListener';
    if (remove) {
      funcName = 'removeEventListener';
    }
    document[funcName]('mousewheel', this.handleMouseScroll, false);
    document[funcName]('click', this.handleMouseUp, false);
    document[funcName]('mousemove', this.handleMouseMove, false);
    window[funcName]('resize', this.handleResize, false);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      if (nextProps.drag) {
        return this.bindEvent();
      }
    }
    if (this.props.visible && !nextProps.visible) {
      if (nextProps.drag) {
        return this.bindEvent(true);
      }
    }
    if (this.props.drag && !nextProps.drag) {
      return this.bindEvent(true);
    }
    if (!this.props.drag && nextProps.drag) {
      if (nextProps.visible) {
        return this.bindEvent(true);
      }
    }

    if(this.props.imgSrc!=nextProps.imgSrc){
        this.setState({
            imgKey:Math.random()
        })
    }
  }

  componentWillUnmount() {
    this.bindEvent(true);
  }
  update = (next,prev) =>{
      for(let i in next){
          if(next[i]!=prev[i]){
              return true
          }
          return false
      }

  }
  shouldComponentUpdate(nextProps,nextState){
      const propsEqual = isEqual(nextProps,this.props);
      const stateEqual =  isEqual(nextState,this.state);
      return !propsEqual||!stateEqual
  }

  render() {
    let imgStyle={
      width: `${this.props.width}px`,
      height: `${this.props.height}px`,
      marginTop: `${this.props.top}px`,
      marginLeft: this.props.left ? `${this.props.left}px` : 'auto',
      transform: `rotate(${this.props.rotate}deg) scaleX(${this.props.scaleX}) scaleY(${this.props.scaleY})`,
    };

    let imgClass = this.props.drag ? 'drag' : '';
    if (!this.state.isMouseDown) {
      imgClass += ` ${this.props.prefixCls}-image-transition`;
    }

    let style = {
      zIndex: this.props.zIndex,
    };

    let imgNode = null;
    if (this.props.imgSrc !== ''&&!this.props.loading&&this.props.height) {
      imgNode = <img
      className={cn(imgClass)}
      src={this.props.imgSrc}
      style={imgStyle}
      key={this.state.imgKey}
      onMouseDown={this.handleMouseDown}
      />;
    }
    if (this.props.loading) {
      imgNode = <Loading style={{
        marginTop: '50%',
        marginLeft:'50%',
      }}/>;
    }
    return (
      <div
      className={cn(`${this.props.prefixCls}-canvas`)}
      onMouseDown={this.handleMouseDown}
      style={style}
      >
      <CSSTransitionGroup
      transitionName={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        leave: styles.leave,
        leaveActive: styles.leaveActive,
        appear: styles.appear,
        appearActive: styles.appearActive
      }}
       transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
          {imgNode}
      </CSSTransitionGroup>

      </div>
    );
  }
}
