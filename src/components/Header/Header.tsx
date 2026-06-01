import "./Header.css";
import logo from "../../assets/logo.svg";
const appName = "Knowledge Hub";

const Header = () => (
  <header className="header">
    <img src={logo} alt={`${appName} logo`} className="header__logo" />
    <h1>{appName}</h1>
  </header>
);

export default Header;
