using Look.API.DTOs;

namespace Look.API.Services;

public interface IJobService
{
    Task<IEnumerable<JobPostingDTO>> GetAllJobsAsync(string? search = null, string? jobType = null);
    Task<JobPostingDTO?> GetJobByIdAsync(int id);
    Task<JobPostingDTO> CreateJobAsync(CreateJobPostingDTO createJobDto);
    Task<JobPostingDTO?> UpdateJobAsync(int id, UpdateJobPostingDTO updateJobDto);
    Task<bool> DeleteJobAsync(int id);
}