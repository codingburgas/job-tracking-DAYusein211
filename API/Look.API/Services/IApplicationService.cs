using Look.API.DTOs;

namespace Look.API.Services;

public interface IApplicationService
{
    Task<ApplicationDTO?> SubmitApplicationAsync(int userId, int jobPostingId);
    Task<IEnumerable<ApplicationDTO>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationDTO>> GetAllApplicationsAsync();
    Task<IEnumerable<ApplicationDTO>> GetJobApplicationsAsync(int jobPostingId);
    Task<ApplicationDTO?> UpdateApplicationStatusAsync(int id, UpdateApplicationStatusDTO updateDto);
}