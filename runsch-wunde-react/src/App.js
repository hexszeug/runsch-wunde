import Navbar from './Navbar';
import Footer from './Footer';
import Login from './Login';
import Main from './Main';

function App() {
  return (
    <div className="viewport">
      <section className="section">
        <Navbar />
      </section>
      <section className="section">
        <Login />
        <Main />
      </section>
      {/* explicitly not .section (no margins on the footer)*/}
      <section className="mt-auto">
        <Footer />
      </section>
    </div>
  );
}

export default App;
