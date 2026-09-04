import config from '../constants/config';

export const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return `${config.currency}0.00`;
  return `${config.currency}${Number(price).toFixed(2)}`;
};

export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0;
  const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
  return Math.round(discount);
};

export const formatDiscountBadge = (originalPrice, discountPrice) => {
  const percentage = calculateDiscountPercentage(originalPrice, discountPrice);
  return percentage > 0 ? `${percentage}% OFF` : null;
};
