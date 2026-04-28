import { Link } from "react-router-dom";


export default function Navbar({ user, cartCount, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">🛍️ Shop Mini</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/orders">Orders</Link>
              <span className="nav-user">Hi, {user.name || user.email}</span>
              <button className="btn-link" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
