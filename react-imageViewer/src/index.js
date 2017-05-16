import  React,{Component} from 'react';
import  {render}  from 'react-dom';
import Viewer from './imageViewer';


import Perf from 'react-addons-perf';
window.Perf = Perf;

//

class Demo extends Component {
	
	render(){
		const images = [
			{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},
			{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},

			{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},
						{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},
			{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},

			{src:"http://www.wallcoo.com/animal/Dogs_Summer_and_Winter/wallpapers/1920x1200/DogsB10_Lucy.jpg"},
			{src:"http://www.dabaoku.com/sucaidatu/dongwu/chongwujingling/804838.JPG"},


			]
		return (
			
			<Viewer
				images={images}
				>
			</Viewer>
		)
	}
}

render(
	<Demo></Demo>,
    document.getElementById('root')
);