import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getAdById,
  getComments,
  addComment,
  getRatings,
  addRating,
} from "../features/ads/adsSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaEye,
  FaDollarSign,
  FaUser,
  FaClock,
  FaHeart,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import {
  createReport,
  resetReportState,
} from "../features/admin/adminSlice";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// Custom arrow components for react-slick
const NextArrow = ({ onClick }) => (
  <button
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full z-10 shadow-lg transition-all duration-200 hover:scale-110"
    onClick={onClick}
    aria-label="Next image"
  >
    <FaChevronRight className="text-sm" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full z-10 shadow-lg transition-all duration-200 hover:scale-110"
    onClick={onClick}
    aria-label="Previous image"
  >
    <FaChevronLeft className="text-sm" />
  </button>
);

// Enhanced Star Rating Component
const StarRating = ({
  rating,
  onRate,
  interactive = true,
  size = "text-2xl",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={`star-${star}`}
          type="button"
          className={`${size} transition-all duration-150 ${
            star <= (hoverRating || rating)
              ? "text-yellow-400"
              : "text-gray-300"
          } ${
            interactive
              ? "hover:text-yellow-400 cursor-pointer hover:scale-110"
              : "cursor-default"
          }`}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="animate-pulse">
      <div className="bg-gray-200 h-96 rounded-2xl mb-8"></div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const ReportModal = ({ isOpen, onClose, adId }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.admin
  );

  const reasons = [
    "Fake Ad",
    "Inappropriate Content",
    "Scam or Fraud",
    "Duplicate or Spam",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a reason for reporting.");
      return;
    }

    dispatch(
      createReport({
        targetId: adId,
        targetType: "Ad",
        reason,
        description: details,
      })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Report submitted successfully.");
      dispatch(resetReportState());
      onClose();
      setReason("");
      setDetails("");
    }
    if (isError) {
      toast.error(message || "An error occurred while submitting the report.");
      dispatch(resetReportState());
    }
  }, [isSuccess, isError, dispatch, message, onClose]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <DialogPanel className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full z-50 relative">
          <DialogTitle className="text-xl font-bold mb-4 text-center">
            Report This Ad
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              {reasons.map((r) => (
                <label key={r} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="form-radio"
                  />
                  <span>{r}</span>
                </label>
              ))}
              <textarea
                placeholder="Additional details (optional)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full mt-2 p-2 border rounded resize-none min-h-[80px]"
              />
              <button
                type="submit"
                disabled={isLoading || !reason}
                className={`w-full bg-red-600 text-white font-semibold py-2 px-4 rounded ${
                  !reason || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700"
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const AdDetails = () => {
  const dispatch = useDispatch();
  const { _id } = useParams();
  const { ad, isLoading, isError, message } = useSelector((state) => state.ads);
  const { user } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdById(_id));
    dispatch(getComments(_id));
    dispatch(getRatings(_id));
  }, [dispatch, _id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    setIsSubmittingComment(true);
    try {
      await dispatch(addComment({ id: _id, text: commentText }));
      setCommentText("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddRating = (stars) => {
    if (!user) {
      toast.error("Please login to rate");
      return;
    }
    setUserRating(stars);
    dispatch(addRating({ id: _id, stars }));
    toast.success("Rating submitted successfully!");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) return <LoadingSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {message || "Unable to load the ad details"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ad Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The ad you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: ad?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: ad?.images?.length > 1,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
    afterChange: (index) => setActiveImageIndex(index),
    ...(ad?.images?.length > 1
      ? {
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
        }
      : { arrows: false }),
    customPaging: (i) => (
      <div
        className={`w-3 h-3 rounded-full transition-all ${
          i === activeImageIndex ? "bg-orange-500" : "bg-gray-300"
        }`}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            Back to listings
          </button>
        </nav>

        {/* Image Slider */}
        {ad.images?.length > 0 && (
          <div className="mb-8 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Slider {...sliderSettings}>
                {ad.images.map((image, idx) => (
                  <div key={`${image}-${idx}`} className="relative">
                    <img
                      src={`http://localhost:5000/uploads/${image}`}
                      alt={`${ad.title} ${idx + 1}`}
                      className="w-full h-96 lg:h-[500px] object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x500?text=No+Image+Available";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {idx + 1} / {ad.images.length}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  {ad.title}
                </h1>
                <div className="flex space-x-2 ml-4">
                  <button className="p-3 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group">
                    <FaHeart className="text-gray-600 group-hover:text-red-500" />
                  </button>
                  <button className="p-3 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors group">
                    <FaShare className="text-gray-600 group-hover:text-blue-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-orange-500" />
                  <span>{ad.location}</span>
                </div>
                <div className="flex items-center">
                  <FaEye className="mr-2 text-orange-500" />
                  <span>{ad.views?.toLocaleString()} views</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {ad.description}
                </p>
              </div>
            </div>

            {/* Ratings Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Customer Reviews
              </h3>

              <div className="flex items-center space-x-4 mb-6">
                <StarRating
                  rating={ad.averageRating || 0}
                  interactive={false}
                />
                <div className="text-gray-600">
                  <span className="text-2xl font-bold text-gray-800">
                    {ad.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="ml-2">
                    ({ad.ratings?.length || 0} reviews)
                  </span>
                </div>
              </div>

              {user && (
                <div className="border-t pt-6">
                  <p className="text-lg font-medium text-gray-800 mb-3">
                    Rate this ad:
                  </p>
                  <StarRating rating={userRating} onRate={handleAddRating} />
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Comments ({ad.comments?.length || 0})
              </h3>

              {user && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        rows="3"
                        placeholder="Share your thoughts about this ad..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">
                          {commentText.length}/500 characters
                        </span>
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleAddComment}
                          disabled={isSubmittingComment || !commentText.trim()}
                        >
                          {isSubmittingComment && (
                            <FaSpinner className="animate-spin" />
                          )}
                          <span>
                            {isSubmittingComment
                              ? "Posting..."
                              : "Post Comment"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ad.comments?.length > 0 ? (
                <div className="space-y-6">
                  {ad.comments.map((comment) => (
                    <div
                      key={
                        comment._id || `${comment.userId}-${comment.createdAt}`
                      }
                      className="flex space-x-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {comment.user?.FullName || "Anonymous User"}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1" />
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    No comments yet
                  </h4>
                  <p className="text-gray-500">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center text-4xl font-bold text-green-600 mb-2">
                  <FaDollarSign className="text-3xl" />
                  {formatPrice(ad.price)}
                </div>
                <p className="text-gray-600">Listed Price</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg">
                  Contact Seller
                </button>
                <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200">
                  Make Offer
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Seller Information
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {ad.user?.FullName || "Anonymous"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Member since {new Date(ad.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors">
                View Profile
              </button>
            </div>

            {/* Ad Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Ad Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">
                    {formatDate(ad.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">
                    {ad.views?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium">
                    {ad.comments?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <StarRating
                      rating={ad.averageRating || 0}
                      interactive={false}
                      size="text-sm"
                    />
                    <span className="ml-2 font-medium">
                      ({ad.ratings?.length || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <button
                onClick={() => setIsReportOpen(true)}
                className="w-full text-red-600 hover:text-red-700 font-semibold py-3 px-4 rounded-lg transition-colors border border-red-200 hover:bg-red-50"
              >
                Report this ad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        adId={_id} 
      />
    </div>
  );
};

export default AdDetails;