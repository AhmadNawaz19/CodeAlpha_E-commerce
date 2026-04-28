import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { api } from './api';
import Hero from '../components/Hero'

const useCart = () => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
  const save = (c) => { setCart(c); localStorage.setItem('cart', JSON.stringify(c)); };
  return {
    cart,
    add: (p) => {
      const ex = cart.find(i => i.id === p.id);
      save(ex ? cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...cart, { ...p, qty: 1 }]);
    },
    remove: (id) => save(cart.filter(i => i.id !== id)),
    clear: () => save([]),
  };
};

function Nav({ cart, user, logout }) {
  return (
    <nav className="nav">
      <Link to="/" className="logo">🛍️ Shop Mini</Link>
      <div className="nav-links">
        <Link to="/cart">Cart ({cart.length})</Link>
        {user ? (
          <><span>Hi, {user.name}</span><button onClick={logout}>Logout</button></>
        ) : (
          <><Link to="/login">Login</Link><Link to="/register">Register</Link></>
        )}
      </div>
    </nav>
  );
}

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  useEffect(() => { api('/products').then(setProducts); }, []);
  return (
    <>
    <Hero/>
    <div className="grid">
      {products.map(p => (
        <div key={p.id} className="card">
          <Link to={`/product/${p.id}`}><img src={p.image} alt={p.name} /></Link>
          <h3>{p.name}</h3>
          <p className="price">${p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
      </>
  );
}

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => { api(`/products/${id}`).then(setP); }, [id]);
  if (!p) return <p>Loading...</p>;
  return (
    <div className="detail">
      <img src={p.image} alt={p.name} />
      <div>
        <h2>{p.name}</h2>
        <p>{p.description}</p>
        <p className="price">${p.price}</p>
        <p>Stock: {p.stock}</p>
        <button onClick={() => addToCart(p)}>Add to Cart</button>
      </div>
    </div>
  );
}

function Cart({ cart, remove, clear, user }) {
  const nav = useNavigate();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  const checkout = async () => {
    if (!user) return nav('/login');
    await api('/orders', { method: 'POST', body: JSON.stringify({ items: cart, total }) });
    clear(); alert('Order placed!'); nav('/');
  };
  if (!cart.length) return <p>Cart is empty.</p>;
  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map(i => (
        <div key={i.id} className="cart-row">
          <img src={i.image} alt="" />
          <span>{i.name}</span>
          <span>{i.qty} × ${i.price}</span>
          <button onClick={() => remove(i.id)}>X</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

function AuthForm({ mode, onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api(`/${mode}`, { method: 'POST', body: JSON.stringify(form) });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user); nav('/');
    } catch (err) { alert(err.message); }
  };
  return (
    <form onSubmit={submit} className="form">
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      {mode === 'register' && <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />}
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
      <button>{mode === 'register' ? 'Register' : 'Login'}</button>
    </form>
  );
}

export default function App() {
  const cartHook = useCart();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const logout = () => { localStorage.clear(); setUser(null); };
  return (
    <>
      <Nav cart={cartHook.cart} user={user} logout={logout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Products addToCart={cartHook.add} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={cartHook.add} />} />
          <Route path="/cart" element={<Cart {...cartHook} user={user} />} />
          <Route path="/login" element={<AuthForm mode="login" onAuth={setUser} />} />
          <Route path="/register" element={<AuthForm mode="register" onAuth={setUser} />} />
        </Routes>
      </main>
    </>
  );
}
