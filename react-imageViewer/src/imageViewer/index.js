import  React,{Component} from 'react';
import ViewerContainer from './Viewer';
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
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.visible!=this.state.visible){
			return true
		}
		if(nextState.activeIndex!=this.state.activeIndex){
			return true;
		}
		return false
	}
	render(){
		const {visible,activeIndex} = this.state;
		const {images,drag,zIndex,rotatable,scalable,zoomable,isNav} = this.props
		return (
			<div>

			{images.map((item, index) => {
			  return (
				  <ImgItem
				  handleClick = {this.onClick}
				  imgSrc = {item.src}
				  key = {index}
				  imgIndex = {index}
				  ></ImgItem>

			  )
			})}
			<ViewerContainer
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
export default Viewer;
