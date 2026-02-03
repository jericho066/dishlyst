// src/components/common/Footer.jsx

/**
 * Footer Component
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>
            © {currentYear} Dishlyst. Recipe data from{' '}
            <a 
              href="https://www.themealdb.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ea580c', textDecoration: 'none' }}
            >
              TheMealDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}