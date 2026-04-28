import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        <div style={styles.section}>
          <h2 style={styles.logo}>ShopHub</h2>
          <p style={styles.text}>
            Your one-stop destination for quality products and great deals.
          </p>
        </div>

        <div style={styles.section}>
          <h3>Quick Links</h3>
          <ul style={styles.list}>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3>Customer Support</h3>
          <ul style={styles.list}>
            <li>Help Center</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3>Follow Us</h3>
          <div style={styles.socials}>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Twitter</span>
          </div>
        </div>

      </div>

      <div style={styles.bottom}>
        © 2026 ShopHub. All Rights Reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#111",
    color: "#fff",
    paddingTop: "60px",
    marginTop: "50px"
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "auto",
    padding: "0 30px 50px"
  },

  section: {
    lineHeight: "2"
  },

  logo: {
    fontSize: "28px"
  },

  text: {
    color: "#bbb"
  },

  list: {
    listStyle: "none",
    padding: 0
  },

  socials: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  bottom: {
    borderTop: "1px solid #333",
    textAlign: "center",
    padding: "20px",
    color: "#aaa"
  }
};

export default Footer;