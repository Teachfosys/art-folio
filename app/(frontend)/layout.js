import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";

export default function FrontendLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
