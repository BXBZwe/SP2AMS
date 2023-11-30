// import Nav from "./components/Nav";

// const Layout = ({ children }) => {
//   return (
//     <div style={{ display: 'flex' }}>
//       <div style={{ flex: 1 }}>
//         <Nav />
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Layout;

import Nav from "./components/Nav";

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Nav />
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
