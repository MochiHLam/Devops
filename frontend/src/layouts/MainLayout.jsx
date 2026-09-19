import Navbar from "../components/Navbar";

/**
 * MainLayout — wraps all public/user pages with the top navbar
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="page-content">
        {children}
      </main>
    </>
  );
}
