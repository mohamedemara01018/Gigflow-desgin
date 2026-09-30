import { Star, StarHalf } from "lucide-react";

export default function RatingStars({ rating = 0 }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5 stars`}>
            {[...Array(5)].map((_, idx) => {
                if (idx < fullStars) {
                    return (
                        <Star
                            key={idx}
                            size={16}
                            className="text-primary fill-primary"
                        />
                    );
                }
                if (idx === fullStars && hasHalfStar) {
                    return (
                        <StarHalf
                            key={idx}
                            size={16}
                            className="text-primary fill-primary"
                        />
                    );
                }
                return (
                    <Star
                        key={idx}
                        size={16}
                        className="text-outline-variant"
                    />
                );
            })}
        </div>
    );
}