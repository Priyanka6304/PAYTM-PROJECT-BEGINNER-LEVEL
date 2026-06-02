import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://65.0.129.251:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1>Paytm Wallet Dashboard</h1>

      {users.length > 0 ? (
        users.map((user, index) => (
          <div
            key={index}
            style={{
              background: "white",
              color: "black",
              padding: "10px",
              margin: "10px",
              borderRadius: "10px",
            }}
          >
            <h2>{user.name}</h2>
            <p>Balance: ₹{user.wallet_balance}</p>
          </div>
        ))
      ) : (
        <h2 style={{ color: "white" }}>Loading users...</h2>
      )}
    </div>
  );
}

export default App;