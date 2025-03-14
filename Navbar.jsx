import { Link } from "react-router"
import "./Navbar.css"
const Navbar = () => {
  return (
    <>
    <div className="navbar">
    <div className='logo'>Sarvana Store</div>
    <ul>
      <Link to="/rsm">
        <li>Rsm</li>
        </Link>
        <Link to="/asm">
        <li>Asm</li>
        </Link>
        <Link to="/store">
        <li>Store</li>
        </Link>
        <Link to="/admin">
        <li>Admin</li>
        </Link>
    </ul>
    </div>
    </>
  )
}

export default Navbar