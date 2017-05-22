import  React,{Component} from 'react';
import ViewerContainer from './Viewer';
import {isEqual} from 'lodash';
import ImgItem from './ImgItem';
import styles from "./style.css";


class Viewer extends Component {
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
			<ViewerContainer
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
Viewer.defaultProps={
	thumbnail:true,
	text:"",
	images:[{}]
}
export default Viewer;
