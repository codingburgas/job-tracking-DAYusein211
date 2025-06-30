using Microsoft.EntityFrameworkCore;
using Look.API.Data;
using Look.API.DTOs;
using Look.API.Models;

namespace Look.API.Services;

public class JobService : IJobService
{
    private readonly ApplicationDbContext _context;

    public JobService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobPostingDTO>> GetAllJobsAsync(string? search = null, string? jobType = null)
    {
        var query = _context.JobPostings.Include(j => j.Applications).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(j => j.Title.Contains(search) 
                                  || j.CompanyName.Contains(search) 
                                  || j.Description.Contains(search));

        if (!string.IsNullOrEmpty(jobType))
            query = query.Where(j => j.JobType == jobType);

        return await query
            .OrderByDescending(j => j.DatePosted)
            .Select(j => new JobPostingDTO
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                DatePosted = j.DatePosted,
                Status = j.Status,
                JobType = j.JobType,
                Location = j.Location,
                SalaryRange = j.SalaryRange,
                ExperienceLevel = j.ExperienceLevel,
                ApplicationsCount = j.Applications.Count
            })
            .ToListAsync();
    }

    public async Task<JobPostingDTO?> GetJobByIdAsync(int id)
    {
        var job = await _context.JobPostings
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null) return null;

        return new JobPostingDTO
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            JobType = job.JobType,
            Location = job.Location,
            SalaryRange = job.SalaryRange,
            ExperienceLevel = job.ExperienceLevel,
            ApplicationsCount = job.Applications.Count
        };
    }

    public async Task<JobPostingDTO> CreateJobAsync(CreateJobPostingDTO createJobDto)
    {
        var job = new JobPosting
        {
            Title = createJobDto.Title,
            CompanyName = createJobDto.CompanyName,
            Description = createJobDto.Description,
            JobType = createJobDto.JobType,
            Location = createJobDto.Location,
            SalaryRange = createJobDto.SalaryRange,
            ExperienceLevel = createJobDto.ExperienceLevel,
            Status = JobStatus.Active
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        return new JobPostingDTO
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            JobType = job.JobType,
            Location = job.Location,
            SalaryRange = job.SalaryRange,
            ExperienceLevel = job.ExperienceLevel,
            ApplicationsCount = 0
        };
    }

    public async Task<JobPostingDTO?> UpdateJobAsync(int id, UpdateJobPostingDTO updateJobDto)
    {
        var job = await _context.JobPostings
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null) return null;

        job.Title = updateJobDto.Title;
        job.CompanyName = updateJobDto.CompanyName;
        job.Description = updateJobDto.Description;
        job.JobType = updateJobDto.JobType;
        job.Location = updateJobDto.Location;
        job.SalaryRange = updateJobDto.SalaryRange;
        job.ExperienceLevel = updateJobDto.ExperienceLevel;
        job.Status = updateJobDto.Status;

        await _context.SaveChangesAsync();

        return new JobPostingDTO
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            Status = job.Status,
            JobType = job.JobType,
            Location = job.Location,
            SalaryRange = job.SalaryRange,
            ExperienceLevel = job.ExperienceLevel,
            ApplicationsCount = job.Applications.Count
        };
    }

    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return false;

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }
}
