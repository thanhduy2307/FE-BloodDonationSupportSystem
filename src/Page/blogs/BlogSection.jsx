import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../configs/axios';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    api.get('blogs')
      .then((res) => {
        setBlogPosts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách blogs:", err);
      });
  }, []);

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
            <article key={post.blogId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-red-600 transition">
                  {post.title}
                </h3>
                <Link 
                  to={`/blogs/${post.blogId}`} 
                  className="text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  Đọc thêm
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
