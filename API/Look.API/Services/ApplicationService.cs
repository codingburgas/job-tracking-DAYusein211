using Microsoft.EntityFrameworkCore;
using Look.API.Data;
using Look.API.DTOs;
using Look.API.Models;

namespace Look.API.Services;

public class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApplicationDTO?> SubmitApplicationAsync(int userId, int jobPostingId)
    {
        if (await _context.Applications.AnyAsync(a => a.UserId == userId && a.JobPostingId == jobPostingId))
            return null;

        var job = await _context.JobPostings.FindAsync(jobPostingId);
        if (job == null || job.Status != JobStatus.Active)
            return null;

        var application = new Models.Application
        {
            UserId = userId,
            JobPostingId = jobPostingId,
            Status = ApplicationStatus.Submitted
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(userId);

        return new ApplicationDTO
        {
            Id = application.Id,
            UserId = application.UserId,
            UserName = $"{user?.FirstName} {user?.LastName}",
            JobPostingId = application.JobPostingId,
            JobTitle = job.Title,
            CompanyName = job.CompanyName,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt
        };
    }

    public async Task<IEnumerable<ApplicationDTO>> GetUserApplicationsAsync(int userId)
    {
        return await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new ApplicationDTO
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = $"{a.User.FirstName} {a.User.LastName}",
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                Status = a.Status,
                SubmittedAt = a.SubmittedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationDTO>> GetAllApplicationsAsync()
    {
        return await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new ApplicationDTO
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = $"{a.User.FirstName} {a.User.LastName}",
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                Status = a.Status,
                SubmittedAt = a.SubmittedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<ApplicationDTO>> GetJobApplicationsAsync(int jobPostingId)
    {
        return await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .Where(a => a.JobPostingId == jobPostingId)
            .OrderByDescending(a => a.SubmittedAt)
            .Select(a => new ApplicationDTO
            {
                Id = a.Id,
                UserId = a.UserId,
                UserName = $"{a.User.FirstName} {a.User.LastName}",
                JobPostingId = a.JobPostingId,
                JobTitle = a.JobPosting.Title,
                CompanyName = a.JobPosting.CompanyName,
                Status = a.Status,
                SubmittedAt = a.SubmittedAt,
                UpdatedAt = a.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<ApplicationDTO?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDTO updateDto)
    {
        var application = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application == null) return null;

        application.Status = updateDto.Status;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ApplicationDTO
        {
            Id = application.Id,
            UserId = application.UserId,
            UserName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            JobTitle = application.JobPosting.Title,
            CompanyName = application.JobPosting.CompanyName,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt,
            UpdatedAt = application.UpdatedAt
        };
    }
}
