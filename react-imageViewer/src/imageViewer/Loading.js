import  React,{PureComponent} from 'react';
import classnames from 'classnames/bind';
import styles from "./style.css";
let cn = classnames.bind(styles);

export default class Loading extends PureComponent{
  constructor() {
    super();
  }

  render() {
    let cls = 'spin spin-spinning';
    return (
      <div className={cn("spin-wrap")} style={this.props.style}>
        <div className={cn(cls)}>
          <div className={cn("spin-dot")}></div>
        </div>
      </div>
    );
  }
}
