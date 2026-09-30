// Port of 404.php.
export default function NotFound() {
  return (
    <section className="banner default">
      <div className="container banner-inner">
        <div className="banner-text">
          <span className="kicker">Error 404</span>
          <h1>
            Page not <strong>found.</strong>
          </h1>
          <div className="banner-intro">
            <p>The page you were looking for has moved or no longer exists.</p>
          </div>
          <div className="buttons">
            <a className="btn primary" href="/">
              Back to home <i aria-hidden className="fa-solid fa-arrow-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
