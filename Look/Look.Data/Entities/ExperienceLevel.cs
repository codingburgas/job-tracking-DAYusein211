// ExperienceLevel.cs
using System.Collections.Generic;

namespace Look.Data.Entities
{
    public class ExperienceLevel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<JobPosting> JobPostings { get; set; }
    }
}