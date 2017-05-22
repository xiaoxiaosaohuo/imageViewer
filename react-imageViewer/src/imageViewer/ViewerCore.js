import  React,{PureComponent} from 'react';
import {debounce,isEqual} from "lodash";
import './style.css';
import ViewerCanvas from './ViewerCanvas';
import ViewerNav from './ViewerNav';
import ViewerToolbar from './ViewerToolbar';
import classnames from 'classnames/bind';
import styles from "./style.css";
let cn = classnames.bind(styles);
import Icon, { ActionType } from './Icon';
import ImgFailure from "../assets/images/imgFailure.png";
const  noop = () => {}

const transitionDuration = 300;

export default class ViewerCore extends PureComponent{
  static defaultProps = {
    visible: false,
    onClose: noop,
    images: [],
    activeIndex: 0,
    zIndex: 1000,
    drag: true,
    attribute: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    isNav:true,
    isError:false
  };


  constructor(props) {
    super(props);

    this.prefixCls = 'react-viewer';
    this.navItemWidth = 141;
    this.cache = {};
    this.tempLeft=0;
    this.state = {
      visible: false,
      visibleStart: false,
      transitionEnd: false,
      activeIndex: this.props.activeIndex,
      width: 0,
      height: 0,
      top: 15,
      left: null,
      marginLeft:0,
      rotate: 0,
      imageWidth: 0,
      imageHeight: 0,
      scaleX: 1,
      scaleY: 1,
      loading: false,
      isError:false
    };

    this.setContainerWidthHeight();
    this.footerHeight = 130;
  }

   setContainerWidthHeight = () => {
    this.containerWidth = window.innerWidth;
    this.containerHeight = window.innerHeight;
    if (this.props.container) {
      this.containerWidth = this.props.container.offsetWidth;
      this.containerHeight = this.props.container.offsetHeight;
    }
  }

   handleClose = (e) => {
    this.props.onClose();
  }
  //计算宽度
    caculateWidth = debounce(()=>{
          const nav = this.navContaier;
          const width = parseInt(window.getComputedStyle(nav).width);
          this.cache.width=width;
          return this.cache.width;
      },250)

   startVisible = (activeIndex) => {
    this.setState({
      visibleStart: true,
    });
    setTimeout(() => {
      this.setState({
        visible: true,
      });
      if(this.props.isNav){
          this.caculateWidth()//计算导航栏宽度
      }
      setTimeout(() => {
        this.bindEvent();


        this.loadImg(activeIndex, true);
      }, 300);
    }, 10);
  }


  handleNext = () =>{
      const stageWidth = this.cache.width;
      const prevLeft = this.state.marginLeft;
      const imgTotalWidth = this.props.images.length*this.navItemWidth
      const imgNum = Math.floor(Math.ceil(stageWidth/this.navItemWidth)/2);
      const left =-(imgNum)*this.navItemWidth+prevLeft;
      this.setState((prevState)=>{
          if(imgTotalWidth+prevLeft<stageWidth){
              return {marginLeft:prevLeft}
          }
          return {marginLeft:left}
      })


      if(this.state.activeIndex+1>=Math.abs(this.state.marginLeft)/this.navItemWidth){
          this.tempLeft = this.state.marginLeft;
      }

  }
  handlePrev = () =>{
      const {activeIndex} =this.state
      const stageWidth = this.cache.width;
      const prevLeft = this.state.marginLeft;
      const imgNum = Math.floor(Math.ceil(stageWidth/this.navItemWidth)/2);
      const MaxNum = Math.floor(stageWidth/this.navItemWidth);
      const left =prevLeft+(imgNum)*this.navItemWidth;
      this.setState((prevState)=>{
          if(left>=0){
              return {marginLeft:0}
          }
          return {marginLeft:left}
      })
      if((activeIndex+1)+prevLeft/this.navItemWidth<MaxNum){
           this.tempLeft = this.state.marginLeft;
      }

  }


  getImgWidthHeight = (imgWidth, imgHeight) => {
    let width = 0;
    let height = 0;
    let maxWidth = this.containerWidth * .8;
    let maxHeight = (this.containerHeight - this.footerHeight) * .8;
    width = Math.min(maxWidth, imgWidth);
    height = (width / imgWidth) * imgHeight;
    if (height > maxHeight) {
      height = maxHeight;
      width = (height / imgHeight) * imgWidth;
    }
    return [width, height];
  }

   loadImg = (activeIndex, firstLoad) => {
    let imgSrc = '';
    let images = this.props.images || [];
    if (images.length > 0) {
      imgSrc = images[activeIndex].src;
    }
    let img = new Image();
    img.src = imgSrc;

    if (firstLoad) {

      this.setState({
        activeIndex: activeIndex,
        width: 0,
        height: 0,
        left: this.containerWidth / 2,
        top:  (this.containerHeight - this.footerHeight) / 2,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        loading: true,
        isError:false
      });
    }else {
      this.setState({
        activeIndex: activeIndex,
        loading: true,
        isError:false
      });
    }
    img.onload = () => {
      let imgWidth = img.width;
      let imgHeight = img.height;
      if (firstLoad) {
          //计算图片距离,将当前图片移动到视图中
          let marginLeft = 0;
          const stageWidth = this.cache.width;
          const MaxNum = Math.floor(stageWidth/this.navItemWidth);
          if(this.props.activeIndex+1>MaxNum){
              let a = Math.floor((activeIndex+1)/MaxNum);
              marginLeft =-(a*MaxNum)*this.navItemWidth
          }
        setTimeout(() => {
          this.setState({
            activeIndex: activeIndex,
            imageWidth: imgWidth,
            imageHeight: imgHeight,
            marginLeft:marginLeft,
            isError:false
          });
          let imgCenterXY = this.getImageCenterXY();
          this.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, 1);
        }, 50);
      }else {
        const [ width, height ] = this.getImgWidthHeight(imgWidth, imgHeight);
        let left = ( this.containerWidth - width ) / 2;
        let top = (this.containerHeight - height - this.footerHeight) / 2;
        this.setState({
          activeIndex: activeIndex,
          width: width,
          height: height,
          left: left,
          top:  top,
          imageWidth: imgWidth,
          imageHeight: imgHeight,
          loading: false,
          rotate: 0,
          scaleX: 1,
          scaleY: 1,
          isError:false
        });
      }
    };
    img.onerror = () => {
        let width=400;
        let height=300;
        let left = ( this.containerWidth - width ) / 2;
        let top = (this.containerHeight - height - this.footerHeight) / 2;
      this.setState({
        activeIndex: activeIndex,
        left: left,
        top:  top,
        width: width,
        height: height,
        imageWidth: 800,
        imageHeight: 600,
        loading: false,
        isError:true
      });
    };
  }

  handleChangeImg = (newIndex) => {
    // let imgCenterXY2 = this.getImageCenterXY();
    // this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, 1);
    // setTimeout(() => {
    //   this.loadImg(newIndex);
    // }, transitionDuration);

    this.loadImg(newIndex);
  }

   handleChangeImgState = (width, height, top, left) => {
    this.setState({
      width: width,
      height: height,
      top: top,
      left: left,
    });
  }

   handleAction = debounce((type) => {
       let stageWidth,prevLeft,MaxNum;
       const {activeIndex,marginLeft,scaleX,scaleY} = this.state;
       if(this.props.isNav){
         stageWidth = this.cache.width;
         prevLeft = marginLeft;
         MaxNum = Math.floor(stageWidth/this.navItemWidth);
        }
    switch (type) {
      case ActionType.prev:
        if(this.props.isNav){
              const curLeft = (activeIndex+1)*this.navItemWidth+prevLeft;
              if(Math.abs(activeIndex*this.navItemWidth+prevLeft)<=this.navItemWidth&&activeIndex>=1){
                  this.handlePrev()
              }
              if(Math.abs(marginLeft)/this.navItemWidth+MaxNum<activeIndex+1||activeIndex+1<Math.abs(marginLeft)/this.navItemWidth){
                  this.setState({
                      marginLeft:this.tempLeft
                  })
              }
          }

        if (activeIndex - 1 >= 0) {

          this.handleChangeImg(activeIndex - 1);
        }
        break;
      case ActionType.next:
        if(this.props.isNav){
              const curLeft1 = (activeIndex+1)*this.navItemWidth+prevLeft;
              if(Math.abs(curLeft1-stageWidth)<this.navItemWidth){
                  this.handleNext()
              }
              if(activeIndex<Math.abs(marginLeft)/this.navItemWidth||activeIndex+1>Math.abs(marginLeft)/this.navItemWidth+MaxNum){
                  this.setState({
                      marginLeft:this.tempLeft
                  })
              }
          }
        if (activeIndex + 1 < this.props.images.length) {
          this.handleChangeImg(activeIndex + 1);
        }
        break;
      case ActionType.zoomIn:
        let imgCenterXY = this.getImageCenterXY();
        this.handleZoom(imgCenterXY.x, imgCenterXY.y, 1, .05);
        break;
      case ActionType.zoomOut:
        let imgCenterXY2 = this.getImageCenterXY();
        this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, .05);
        break;
      case ActionType.rotateLeft:
        this.handleRotate();
        break;
      case ActionType.rotateRight:
        this.handleRotate(true);
        break;
      case ActionType.reset:
        this.loadImg(activeIndex);
        break;
      case ActionType.scaleX:
        this.handleScaleX(scaleX === 1 ? -1 : 1);
        break;
      case ActionType.scaleY:
        this.handleScaleY(scaleY === 1 ? -1 : 1);
        break;
      default:
        break;
    }
},250)

  handleScaleX = (newScale) => {
    this.setState({
      scaleX: newScale,
    });
  }

  handleScaleY = (newScale) => {
    this.setState({
      scaleY: newScale,
    });
  }

 handleZoom = (targetX, targetY, direct, scale) => {
    let imgCenterXY = this.getImageCenterXY();
    let diffX = targetX - imgCenterXY.x;
    let diffY = targetY - imgCenterXY.y;
    let diffWidth = direct * this.state.width * scale;
    let diffHeight = direct * this.state.height * scale;
    // when image width is 0, set original width
    if (diffWidth === 0) {
      const [ width, height ] = this.getImgWidthHeight(this.state.imageWidth, this.state.imageHeight);
      diffWidth = width;
      diffHeight = height;
    }
    this.setState({
      width: this.state.width + diffWidth,
      height: this.state.height + diffHeight,
      top: this.state.top + -diffHeight / 2 + -direct * diffY * scale,
      left: this.state.left + -diffWidth / 2 + -direct * diffX * scale,
      loading: false,
    });
  }

 getImageCenterXY = () => {
    return {
      x: this.state.left + this.state.width / 2,
      y: this.state.top + this.state.height / 2,
    };
  }

 handleRotate = (isRight) => {
    this.setState({
      rotate: this.state.rotate + 90 * (isRight ? 1 : -1),
    });
  }

 handleResize = () =>{
    this.setContainerWidthHeight();
    if (this.props.visible) {
      const [ width, height ] = this.getImgWidthHeight(this.state.imageWidth, this.state.imageHeight);
      let left = ( this.containerWidth - width ) / 2;
      let top = (this.containerHeight - height - this.footerHeight) / 2;
      this.setState({
        width: width,
        height: height,
        left: left,
        top:  top,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
      });
    }
  }

 handleKeydown = (e) => {
    let keyCode = e.keyCode || e.which || e.charCode;
    let isFeatrue = false;
    switch (keyCode) {
      // key: esc
      case 27:
        this.props.onClose();
        isFeatrue = true;
        break;
      // key: ←
      case 37:
        if (e.ctrlKey) {
          this.handleAction(ActionType.rotateLeft);
        }else {
          this.handleAction(ActionType.prev);
        }
        isFeatrue = true;
        break;
      // key: →
      case 39:
        if (e.ctrlKey) {
          this.handleAction(ActionType.rotateRight);
        }else {
          this.handleAction(ActionType.next);
        }
        isFeatrue = true;
        break;
      // key: ↑
      case 38:
        this.handleAction(ActionType.zoomIn);
        isFeatrue = true;
        break;
      // key: ↓
      case 40:
        this.handleAction(ActionType.zoomOut);
        isFeatrue = true;
        break;
      // key: Ctrl + 1
      case 49:
        if (e.ctrlKey) {
          this.loadImg(this.state.activeIndex);
          isFeatrue = true;
        }
        break;
      default:
        break;
    }
    if (isFeatrue) {
      e.preventDefault();
    }
  }

  handleTransitionEnd = (e) =>{
    if (!this.state.transitionEnd || this.state.visibleStart) {
      this.setState({
        visibleStart: false,
        transitionEnd: true,
      });
    }
  }

 bindEvent = (remove) => {
    let funcName = 'addEventListener';
    if (remove) {
      funcName = 'removeEventListener';
    }
    document[funcName]('keydown', this.handleKeydown, false);
  }




  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.startVisible(nextProps.activeIndex);
      return;
    }
    if (this.props.visible && !nextProps.visible) {
      this.bindEvent(true);
      let imgCenterXY2 = this.getImageCenterXY();
      this.handleZoom(imgCenterXY2.x, imgCenterXY2.y, -1, 1);
      setTimeout(() => {
        this.setState({
          visible: false,
          transitionEnd: false,
           activeIndex:0
        });
      }, transitionDuration);
      return;
    }
    if (this.props.activeIndex !== nextProps.activeIndex) {
      this.handleChangeImg(nextProps.activeIndex);

      return;
    }

  }

  shouldComponentUpdate(nextProps,nextState){
      const stateEqual = isEqual(this.state,nextState);
      if(nextProps.visible!=this.props.visible){
          return true;
      }
     return !stateEqual
  }

  componentDidMount() {
    this.startVisible(this.state.activeIndex);
    if(this.props.isNav){
        window.addEventListener("resize",this.caculateWidth);
    }

  }
  componentWillUnmount() {
    this.bindEvent(true);
    if(this.props.isNav){
        window.removeEventListener("resize",this.caculateWidth);
    }
  }


  render() {
    let activeImg = {
      src: '',
      alt: '',
    };

    let zIndex = 1000;
    if (this.props.zIndex) {
      zIndex = this.props.zIndex;
    }

    let viewerStryle= {
      opacity: this.state.visible ? 1 : 0,
    };
    if (!this.state.visible ) {
      viewerStryle.display = 'none';
    }
    // if (!this.state.visible && this.state.visibleStart) {
    //   viewerStryle.display = 'block';
    // }
    if (this.state.visible ) {
      let images = this.props.images || [];
      if (images.length > 0 && this.state.activeIndex >= 0) {
          !this.state.isError?activeImg = images[this.state.activeIndex]: activeImg.src = ImgFailure
      }
    }

    let className = `${this.prefixCls} ${this.prefixCls}-transition`;
    if (this.props.container) {
      className += ` inline`;
    }
    return (
      <div
      className={cn(className)}
      style={viewerStryle}
       ref="renderElement"
      onTransitionEnd={this.handleTransitionEnd}
      >
        <div className={cn(`${this.prefixCls}-mask`)} style={{zIndex: zIndex}}></div>
        <div
        className={cn("react-viewer-close")}
        onClick={this.handleClose}
        style={{zIndex: zIndex + 10}}
        >
          <Icon type={ActionType.close}/>
        </div>
        <ViewerCanvas
        prefixCls={this.prefixCls}
        imgSrc={activeImg.src}
        visible={this.props.visible}
        width={this.state.width}
        height={this.state.height}
        top={this.state.top}
        left={this.state.left}
        rotate={this.state.rotate}
        onChangeImgState={this.handleChangeImgState}
        onResize={this.handleResize}
        onZoom={this.handleZoom}
        zIndex={zIndex + 5}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
        loading={this.state.loading}
        isError = {this.state.isError}
        drag={this.props.drag}
        />
        <div className={cn(`${this.prefixCls}-footer`)} style={{zIndex: zIndex + 5}}>
          <ViewerToolbar
          prefixCls={this.prefixCls}
          onAction={this.handleAction}
          alt={activeImg.alt}
          width={this.state.imageWidth}
          height={this.state.imageHeight}
          attribute={this.props.attribute}
          zoomable={this.props.zoomable}
          rotatable={this.props.rotatable}
          scalable={this.props.scalable}
          changeable={true}
          activeIndex={this.state.activeIndex}
          length = {this.props.images.length}
          >

          </ViewerToolbar>
          {this.props.isNav&&
          <ViewerNav
          navbar = {el =>this.navContaier = el}
          prefixCls={this.prefixCls}
          marginLeft = {this.state.marginLeft}
          images={this.props.images}
          activeIndex={this.state.activeIndex}
          onChangeImg={this.handleChangeImg}
          handleNext={this.handleNext}
          handlePrev={this.handlePrev}
          />}
        </div>
      </div>
    );
  }
}
