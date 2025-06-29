// User.cs
using System;
using System.Collections.Generic;

namespace Look.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public Role Role { get; set; } = Role.USER;
        public string Description { get; set; }
        public decimal? HourlyRate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool Deleted { get; set; } = false;

        public ICollection<UserSkill> UserSkills { get; set; }
        public IEnumerable<Review>? ReviewsWritten { get; set; }
        public IEnumerable<Review>? ReviewsReceived { get; set; }
        public ICollection<Application> Applications { get; set; }
        public ICollection<JobPosting> JobPostingsCreated { get; set; }
    }
}