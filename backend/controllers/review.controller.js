import Review from "../models/review.model.js";

const createReview = async (req, res) => {
  try {
    const { courseId, name, email, comment, rating } = req.body;

    if (!courseId || !name || !comment || !rating) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    const review = new Review({
      courseId,
      userId: req.user?._id || null,
      name,
      email,
      comment,
      rating,
    });

    await review.save();
    res.status(201).json({ message: "Gửi đánh giá thành công.", review });
  } catch (error) {
    console.error("Lỗi khi tạo đánh giá:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra." });
  }
};
const getTopReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({
      courseId,
      rating: { $gte: 5 },
    })
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy top reviews:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy đánh giá." });
  }
};
export { createReview, getTopReviews };
