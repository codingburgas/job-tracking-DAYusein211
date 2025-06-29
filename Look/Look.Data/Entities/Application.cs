// Application.cs
using System;

namespace Look.Data.Entities
{
    public class Application
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int JobPostingId { get; set; }
        public JobPosting JobPosting { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.PENDING;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public string CoverLetter { get; set; }

    }
}