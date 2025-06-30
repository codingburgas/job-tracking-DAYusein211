using Look.API.Models;

namespace Look.API.DTOs;

public class ApplicationDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int JobPostingId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateApplicationStatusDTO
{
    public ApplicationStatus Status { get; set; }
}