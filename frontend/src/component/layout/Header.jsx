import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark text-white">
        <div className="container-fluid">
          {/* Left-aligned brand */}
          <Link className="navbar-brand text-white" to="/">
            ETX
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Right-aligned navigation links */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to="/user"
                  className="nav-link active text-white"
                  aria-current="page"
                >
                  User
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

