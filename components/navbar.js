import Image from 'next/image'
import OELogo from '../public/octo-energy-logo.svg'

const navBarStyle = {
  backgroundColor: "#180048",
};

const NavBar = () => (
  <div className="NavBar flex items-center justify-between flex-wrap p-6" style={navBarStyle}>
    <Image src={OELogo} alt="Octopus Energy" />
  </div>
);

export default NavBar;