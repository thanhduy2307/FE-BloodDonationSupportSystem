import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import api from "../../configs/axios";

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    api
      .get("Blog/getAllBlog")
      .then((res) => {
        const data = res.data;

        if (Array.isArray(data)) {
          setBlogPosts(data);
        } else if (Array.isArray(data.data)) {
          setBlogPosts(data.data);
        } else {
          console.error("Cấu trúc không hợp lệ:", data);
          setBlogPosts([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách blogs:", err);
        setBlogPosts([]);
      });
  }, []);

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.blogId}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-gray-900 mb-4 hover:text-red-600 transition block"
              >
                {post.title}
              </a>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 font-medium flex items-center"
              >
                Đọc thêm
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
