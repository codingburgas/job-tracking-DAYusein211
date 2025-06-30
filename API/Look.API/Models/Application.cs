using System.ComponentModel.DataAnnotations;

namespace Look.API.Models;

public class Application
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public int JobPostingId { get; set; }
    public JobPosting JobPosting { get; set; } = null!;
    
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
}

public enum ApplicationStatus
{
    Submitted = 0,
    SelectedForInterview = 1,
    Rejected = 2
}