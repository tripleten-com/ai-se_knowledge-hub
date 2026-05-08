import "./Header.css";
import logo from "../../assets/logo.svg";

const Header = () => (
  <header className="header">
    <img src={logo} alt="Knowledge Hub logo" className="header__logo" />
    <h1>Knowledge Hub</h1>
  </header>
);

export default Header;
