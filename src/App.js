import Header from './components/Header/index';
import AppStock from './components/Eth-Overview/index';
import BlockStats from './components/Latest-Blocks/index';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <AppStock></AppStock>
      <BlockStats></BlockStats>
    </div>
  );
}

export default App;
