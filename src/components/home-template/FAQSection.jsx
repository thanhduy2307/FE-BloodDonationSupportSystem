import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const faqs = [
    {
      question: "Hiến máu có đau không?",
      answer: "Khi hiến máu, bạn chỉ cảm thấy đau nhẹ khi kim đâm vào da, tương tự như khi lấy máu xét nghiệm. Sau đó, bạn sẽ không cảm thấy đau khi máu được lấy."
    },
    {
      question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
      answer: "Không, hiến máu không ảnh hưởng xấu đến sức khỏe nếu bạn đủ điều kiện hiến máu. Cơ thể bạn sẽ tạo ra tế bào máu mới để thay thế lượng máu đã hiến trong vòng vài ngày đến vài tuần."
    },
    {
      question: "Mỗi lần hiến bao nhiêu máu?",
      answer: "Mỗi lần hiến máu toàn phần, bạn sẽ hiến khoảng 350-450ml máu, tùy thuộc vào cân nặng của bạn. Lượng máu này chỉ chiếm khoảng 8-10% tổng lượng máu trong cơ thể."
    },
    {
      question: "Cần chuẩn bị gì trước khi hiến máu?",
      answer: "Trước khi hiến máu, bạn nên ngủ đủ giấc, ăn đầy đủ, uống nhiều nước, tránh uống rượu bia và hút thuốc. Mang theo CMND/CCCD hoặc giấy tờ tùy thân có ảnh."
    },
    {
      question: "Sau khi hiến máu cần lưu ý gì?",
      answer: "Sau khi hiến máu, bạn nên nghỉ ngơi tại chỗ khoảng 10-15 phút, uống nhiều nước, tránh vận động mạnh trong 24 giờ, không hút thuốc trong ít nhất 2 giờ và không uống rượu bia trong 24 giờ."
    },
    {
      question: "Máu hiến tặng được sử dụng như thế nào?",
      answer: "Máu hiến tặng sẽ được xét nghiệm, phân loại và chế biến thành các chế phẩm máu khác nhau như hồng cầu, huyết tương, tiểu cầu... để phục vụ điều trị cho nhiều bệnh nhân khác nhau."
    }
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${question}`}
        >
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-red-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        <div 
          id={`faq-answer-${question}`}
          role="region"
          aria-hidden={!isOpen}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-gray-700">{answer}</p>
        </div>
      </div>
    );
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Giải đáp những thắc mắc phổ biến về hiến máu nhân đạo để bạn có thể
            hiểu rõ hơn và tự tin tham gia.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Bạn còn câu hỏi khác?</p>
          <a 
            href="#contact" 
            className="text-red-600 font-medium hover:text-red-700 underline transition"
          >
            Liên hệ với chúng tôi
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
