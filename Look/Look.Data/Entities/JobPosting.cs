// JobPosting.cs
using System;
using System.Collections.Generic;

namespace Look.Data.Entities
{
    public class JobPosting
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public string Description { get; set; }

        public int JobTypeId { get; set; }
        public JobType JobType { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        public int ExperienceLevelId { get; set; }
        public ExperienceLevel ExperienceLevel { get; set; }

        public decimal? Salary { get; set; }
        public decimal? HourlyRate { get; set; }
        public JobStatus Status { get; set; } = JobStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public User Creator { get; set; }
        public bool Deleted { get; set; } = false;

        public ICollection<Application> Applications { get; set; }
        public ICollection<JobPostingSkill> JobPostingSkills { get; set; }

    }
}