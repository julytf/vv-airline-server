import Blog from '@/models/blog/blog.model'

export default async function seedBlogs() {
  await Blog.create({
    title: 'Tokyo - Thủ đô của hiện đại và truyền thống',
    summary:
      'Nếu bạn yêu thích nền văn hóa của xứ sở mặt trời mọc, thì Tokyo chính là điểm đến trong mơ dành cho bạn. Với một Nhật Bản thu nhỏ được tái hiện trong một lần dừng chân, Tokyo khoác lên mình tấm áo hào nhoáng và lấp lánh của một siêu đô thị không ngủ, nhưng len lỏi trong những góc phố ồn ào nhất là cả những khoảng bình lặng và cổ điển. Hãy lập kế hoạch xách balo lên và đi thôi, vì từ tháng 9 đến tháng 11 sẽ là lúc thời tiết thuận lợi nhất cho một chuyến du lịch Tokyo trọn vẹn.',
    coverImage: 'https://www.gotokyo.org/en/plan/tokyo-outline/images/main.jpg',
    content: `1. Shibuya:
    Đừng bỏ lỡ cơ hội được “bước chậm lại giữa thế gian vội vã” tại giao lộ Shibuya – một trong những biểu tượng của Tokyo sầm uất và năng động. Nhịp điệu nơi đây gắn liền với hoạt động của nhà ga Shibuya đưa đón hơn 3 triệu lượt khách du lịch Tokyo mỗi ngày và đây cũng là trung tâm mua sắm thời trang - giải trí cho giới trẻ với hàng trăm thương hiệu nổi tiếng.
    
    2. Asakusa:
    Rời xa bảng điện hào nhoáng và những tòa cao ốc của thế giới hiện đại khi du lịch quanh Tokyo, du khách có thể ngược dòng thời gian trở về một Tokyo cổ kính của thời Edo tại Asakusa. Con đường khám phá Asakusa thường bắt đầu từ bước chân qua Kaminarimon (Cổng sấm sét) – biểu tượng của thành phố, tản bộ qua khu phố Nakamise trong làn khói hương và thành tâm công đức đồng 5 Yên tại ngôi chùa Sensoji linh thiêng.`,
  })
}
