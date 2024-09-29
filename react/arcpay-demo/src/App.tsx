import reactLogo from './assets/react.svg';
import './App.css';
import Pay from './Pay';

function App() {
  return (
    <>
      <div>
        <a href="https://arcpay.online" target="_blank">
          <img
            src="https://arcpay.online/logo.png"
            className="logo arc"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ArcPay</h1>
      <div className="card">
        <Pay />
      </div>
      <p className="read-the-docs">
        Click on the Arcpay and React logos to learn more
      </p>
    </>
  );
}

export default App;
