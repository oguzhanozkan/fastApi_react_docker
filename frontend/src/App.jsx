
import { UserProvider } from "./context/UserContext";
import { UserInfoProvider } from "./context/UserInfoContext";
import PageRouter from "./router/PageRouter"

function App() {


  return (
    <div className="App">
      <UserProvider>
        <UserInfoProvider>
          <PageRouter />
        </UserInfoProvider>
      </UserProvider>
    </div>
  );
}

export default App;
