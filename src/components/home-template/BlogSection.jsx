import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "Tầm quan trọng của việc hiến máu định kỳ",
    excerpt: "Hiến máu định kỳ không chỉ giúp cứu người mà còn có lợi cho sức khỏe người hiến. Hãy cùng tìm hiểu về những lợi ích này.",
    image: "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg",
    author: "Bs. Nguyễn Văn A",
    date: "01/03/2025",
    category: "Sức khỏe"
  },
  {
    id: 2,
    title: "5 điều cần biết trước khi hiến máu",
    excerpt: "Chuẩn bị tốt trước khi hiến máu sẽ giúp quá trình hiến máu diễn ra thuận lợi và an toàn hơn.",
    image: "https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg",
    author: "Ds. Trần Thị B",
    date: "28/02/2025",
    category: "Hướng dẫn"
  },
  {
    id: 3,
    title: "Câu chuyện từ người nhận máu",
    excerpt: "Những câu chuyện cảm động về những người được cứu sống nhờ những người hiến máu tình nguyện.",
    image: "https://images.pexels.com/photos/4226883/pexels-photo-4226883.jpeg",
    author: "Phạm Văn C",
    date: "25/02/2025",
    category: "Câu chuyện"
  }
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tin tức & Bài viết</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về hoạt động hiến máu và các kiến thức bổ ích
            về sức khỏe và hiến máu nhân đạo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-red-600 transition">
                  <Link to="#">{post.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link 
                  to="#" 
                  className="text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  Đọc thêm
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/blogs" 
            className="inline-flex items-center justify-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full px-6 py-2 font-medium transition"
          >
            Xem tất cả bài viết
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
