import React, { useState, useEffect } from 'react';

const styles = {
  container: { fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#333' },
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #ccc', marginBottom: '20px' },
  navBrand: { fontSize: '24px', fontWeight: 'bold', color: '#0066cc', cursor: 'pointer' },
  navButtons: { display: 'flex', gap: '15px' },
  btn: { padding: '10px 20px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnOutline: { padding: '10px 20px', backgroundColor: 'transparent', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { padding: '20px', border: '1px solid #eaeaea', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  cardTitle: { fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' },
  cardPrice: { fontSize: '20px', color: '#0066cc', fontWeight: 'bold', margin: '10px 0' },
  cardCategory: { fontSize: '12px', color: '#666', textTransform: 'uppercase' },
  cardDesc: { color: '#555', flexGrow: 1, margin: '10px 0' },
  cartItem: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eaeaea', alignItems: 'center' },
  cartTotal: { fontSize: '24px', fontWeight: 'bold', textAlign: 'right', marginTop: '20px' },
  checkoutBtn: { padding: '15px 30px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginTop: '20px', width: '100%' },
  qtyBtn: { padding: '5px 10px', margin: '0 10px', cursor: 'pointer' },
  aiSection: { marginTop: '50px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  aiHeader: { color: '#6f42c1', display: 'flex', alignItems: 'center', gap: '10px' },
  flexCenter: { display: 'flex', alignItems: 'center' }
};

export default function App() {
  const [view, setView] = useState('Store'); // 'Store' or 'Cart'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const checkout = () => {
    window.alert('Stripe Payment Successful!');
    setCart([]);
    setView('Store');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // AI Recommendation Logic (Mock)
  const cartIds = cart.map(item => item.id);
  const availableProducts = products.filter(p => !cartIds.includes(p.id));
  const aiSuggestions = availableProducts.slice(0, 2);

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.navBrand} onClick={() => setView('Store')}>MERN Tech Store</div>
        <div style={styles.navButtons}>
          <button style={view === 'Store' ? styles.btn : styles.btnOutline} onClick={() => setView('Store')}>
            Store
          </button>
          <button style={view === 'Cart' ? styles.btn : styles.btnOutline} onClick={() => setView('Cart')}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </nav>

      {view === 'Store' && (
        <div>
          <h2>Available Products</h2>
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product.id} style={styles.card}>
                <div style={styles.cardCategory}>{product.category}</div>
                <div style={styles.cardTitle}>{product.name}</div>
                <div style={styles.cardDesc}>{product.description}</div>
                <div style={styles.cardPrice}>${product.price}</div>
                <button style={styles.btn} onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'Cart' && (
        <div>
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{item.name}</div>
                    <div style={{ color: '#666' }}>${item.price} each</div>
                  </div>
                  <div style={styles.flexCenter}>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <div style={{ fontWeight: 'bold', width: '80px', textAlign: 'right' }}>
                      ${item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
              <div style={styles.cartTotal}>Total: ${cartTotal}</div>
              <button style={styles.checkoutBtn} onClick={checkout}>Checkout with Stripe</button>

              {aiSuggestions.length > 0 && (
                <div style={styles.aiSection}>
                  <h3 style={styles.aiHeader}>✨ AI Suggested Add-ons</h3>
                  <div style={styles.grid}>
                    {aiSuggestions.map(product => (
                      <div key={product.id} style={{...styles.card, backgroundColor: 'white'}}>
                        <div style={styles.cardTitle}>{product.name}</div>
                        <div style={styles.cardPrice}>${product.price}</div>
                        <button style={styles.btnOutline} onClick={() => addToCart(product)}>Add to Cart</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
