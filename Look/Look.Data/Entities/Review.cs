// Review.cs
using System;

namespace Look.Data.Entities
{
    public class Review
    {
        public int Id { get; set; }

        public int ReviewerId { get; set; }
        public User Reviewer { get; set; }

        public int TargetId { get; set; }
        public User Target { get; set; }

        public int Rating { get; set; }
        public ReviewSentiment Sentiment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool Deleted { get; set; } = false;
    }
}