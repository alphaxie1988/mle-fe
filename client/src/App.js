import logo from './logo.png';
import './App.css';
import BeforeAfterSlider from 'react-before-after-slider'


const before = 'default.jpg'
const jianlong = 'jianlong.jpg'
const wesley = 'wesley.jpg'
const jieyuan = 'jieyuan.jpg'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      
      </header>
      <div className="Content">

      <center>
      <h1>Jianlong attempt</h1>
      <BeforeAfterSlider
        before={before}
        after={jianlong}
        width={960}
        height={1280}
      />
      <h1>Jie Yuan attempt</h1>
      <BeforeAfterSlider
        before={before}
        after={jieyuan}
        width={960}
        height={1280}
      />
      <h1>Wesley attempt</h1>
      <BeforeAfterSlider
        before={before}
        after={wesley}
        width={960}
        height={1280}
      />
      <h1>Jieyuan vs Jianlong attempt</h1>
      <BeforeAfterSlider
        before={jieyuan}
        after={wesley}
        width={960}
        height={1280}
      />
      </center>
      </div>
    </div>
  );
}

export default App;
