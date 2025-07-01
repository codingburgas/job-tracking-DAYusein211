using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Look.API.DTOs;
using Look.API.Services;

namespace Look.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpPost("submit/{jobId}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> SubmitApplication(int jobId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var application = await _applicationService.SubmitApplicationAsync(userId, jobId);
        
        if (application == null)
            return BadRequest(new { message = "Unable to submit application." });

        return CreatedAtAction(nameof(GetUserApplications), application);
    }

    [HttpGet("my-applications")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetUserApplications()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var applications = await _applicationService.GetUserApplicationsAsync(userId);
        return Ok(applications);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllApplications()
    {
        var applications = await _applicationService.GetAllApplicationsAsync();
        return Ok(applications);
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        var applications = await _applicationService.GetJobApplicationsAsync(jobId);
        return Ok(applications);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDTO updateDto)
    {
        var application = await _applicationService.UpdateApplicationStatusAsync(id, updateDto);
        
        if (application == null)
            return NotFound();

        return Ok(application);
    }
}