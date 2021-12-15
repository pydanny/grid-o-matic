import Image from 'next/image'
import OELogo from '../public/octo-energy-logo.svg'
import Link from 'next/link'

const navBarStyle = {
  backgroundColor: "#180048",
};

const NavBar = () => (
  <div className="NavBar flex items-center justify-between flex-wrap p-6 headerShadow" style={navBarStyle}>
    <Link href="/"><a><Image src={OELogo} alt="Octopus Energy" /></a></Link>
  </div>
);

export default NavBar;