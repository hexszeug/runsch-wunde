import Navbar from './Navbar';
import Footer from './Footer';
import Login from './Login';
import Main from './Main';
import { useSyncExternalStore } from 'react';
import { appState } from './auth';

function App() {
  const state = useSyncExternalStore(appState.subscribe, appState.getSnapshot);
  return (
    <div className="viewport">
      <section className="section">
        <Navbar />
      </section>
      <section className="section">
        {state === 'login' && <Login />}
        {state === 'normal' && <Main />}
      </section>
      {/* explicitly not .section (no margins on the footer)*/}
      <section className="mt-auto">
        <Footer />
      </section>
    </div>
  );
}

export default App;
