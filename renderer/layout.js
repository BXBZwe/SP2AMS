import Nav from "./components/Nav";
const Layout = ({ children }) => {
  return (
    <>
      <nav>
        <Nav/>
        {/* more navbar code here */}
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Layout;