import React from 'react';
import { Droplet, Heart, Clock, Users, Check } from 'lucide-react';

const AboutSection = () => {
  const benefits = [
    {
      title: 'Cứu sống mạng người',
      description: 'Một đơn vị máu có thể cứu sống tới 3 người bệnh cần truyền máu.',
      icon: <Heart className="w-8 h-8 text-red-600" />
    },
    {
      title: 'Kiểm tra sức khỏe miễn phí',
      description: 'Được kiểm tra sức khỏe và xét nghiệm nhóm máu miễn phí.',
      icon: <Check className="w-8 h-8 text-red-600" />
    },
    {
      title: 'Thời gian ngắn',
      description: 'Quá trình hiến máu chỉ mất khoảng 30-45 phút.',
      icon: <Clock className="w-8 h-8 text-red-600" />
    },
    {
      title: 'Tham gia cộng đồng',
      description: 'Trở thành một phần của cộng đồng những người mang lại sự sống.',
      icon: <Users className="w-8 h-8 text-red-600" />
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block">
            <Droplet className="text-red-600 mx-auto mb-4" size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Về Hiến Máu Nhân Đạo</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Hiến máu nhân đạo là hành động tự nguyện, người hiến máu không nhận thù lao
            dưới bất kỳ hình thức nào. Đây là nghĩa cử cao đẹp thể hiện tình yêu thương và trách nhiệm với cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="rounded-full bg-red-50 w-16 h-16 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-red-50 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ai có thể hiến máu?</h3>
              <ul className="space-y-3">
                {[
                  'Người từ 18-60 tuổi, cân nặng từ 45kg trở lên',
                  'Có sức khỏe tốt, không mắc các bệnh truyền nhiễm',
                  'Không dùng một số loại thuốc đặc biệt',
                  'Khoảng cách giữa 2 lần hiến là 12 tuần với nam và 16 tuần với nữ'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-600 flex items-center justify-center mt-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="ml-3 text-gray-700">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Hình ảnh quy trình hiến máu tại bệnh viện" 
                  loading="lazy"
                  className="rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
