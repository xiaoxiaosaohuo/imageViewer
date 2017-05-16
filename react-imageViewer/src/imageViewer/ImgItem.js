import React,{PureComponent} from "react";
import styles from "./style.css";
class ImgItem extends PureComponent{
	// shouldComponentUpdate(nextProps){
    //     const {marginLeft,activeIndex} = nextProps;
    //     if(marginLeft!=this.props.marginLeft){
    //         return true
    //     }
    //     if(activeIndex!= this.props.activeIndex){
    //         return true;
    //     }
    //     return false
    // }

	render(){
		const {handleClick,imgIndex,imgSrc} = this.props;
		return(
			<div className={styles.pictureWrapper}>
				<a className={styles.pictureA}
				   onClick={(e) => handleClick(imgIndex, e)}
				>
				<img src={imgSrc}/>
				</a>
			</div>
		)
	}
}

export default ImgItem;
