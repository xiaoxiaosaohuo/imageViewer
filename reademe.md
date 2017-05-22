# 图片查看组件
## 支持放大缩小旋转，照片切换，缩略图导航。
## Installation

git clone

## Usage

```
import  React,{Component} from 'react';
import Viewer from '../imageViewer';
import {isEqual} from 'lodash';
import ImgItem from './ImgItem';
import styles from "./style.css";


class ViewerDemo extends Component {
	constructor(props){
		super(props)
		this.state= {
            visible:false,
            activeIndex:0
		}
	}
	onClose =() => {
        this.setState({ visible: false });
    }
    onClick = (index,e) => {
      this.setState({
        visible: true,
        activeIndex: Number(index),
      });
    }
	componentWillReceiveProps(nextProps){
		if(!isEqual(nextProps.images,this.props.images)){
			this.setState({
				activeIndex:0
			})
		}
	}
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.visible!=this.state.visible){
			return true
		}
		if(nextState.activeIndex!=this.state.activeIndex){
			return true;
		}
		if(!isEqual(nextProps.images,this.props.images)){
			return true
		}
		return false
	}
	renderTxet =() =>{
		const {text} = this.props;
		return (
			<a onClick={(e) => this.onClick(0,e)}>{text}</a>
		)
	}
	renderImage = ()=>{
		const gallery = this.props.images.map((item, index) => {
		  return (
			 item.src?<ImgItem
			  handleClick = {this.onClick}
			  imgSrc = {item.src}
			  key = {index}
			  imgIndex = {index}
			  ></ImgItem>:null

		  )
		})
		return gallery
	}
	render(){
		const {visible,activeIndex} = this.state;
		const {images,drag,zIndex,rotatable,scalable,zoomable,isNav,thumbnail} = this.props
		return (
			<div>

			{thumbnail?this.renderImage():this.renderTxet()}
			<Viewer
				key={activeIndex}
				visible={visible}
				onClose={this.onClose }
				images={images}
				activeIndex={activeIndex}
				zIndex={zIndex}
				drag={drag}
				rotatable={rotatable}
				zoomable={zoomable}
				isNav = {isNav}
				/>
			</div>
		)
	}
}
ViewerDemo.defaultProps={
	thumbnail:true,
	text:"",
	images:[{}]
}
export default ViewerDemo;

```

## API

 参数 |  说明 | 类型 | 默认值
---|---|---|---
visible | 是否可见 | boolean |无
onClose | 点击右上角叉的回调 | function(e) | 无
images | 图片集合 | array | []
activeIndex | 当前图片索引 | number | 0
zIndex | css z-index| number |1000
drag | 是否可拖动 | boolean |true
zoomable| 是否可缩放 | boolean |true
rotatable |是否可旋转 |boolean | true
container |设置父元素容器 | HTMLElement |null
isNav | 是否显示底部导航 | boolean |true

## License
MIT
