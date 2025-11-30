import Header from './Header.jsx';
import Footer from './Footer.jsx';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Phần nội dung chính sẽ thay đổi tùy theo trang */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;