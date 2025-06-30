using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Look.API.DTOs;
using Look.API.Services;

namespace Look.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] string? search, [FromQuery] string? jobType)
    {
        var jobs = await _jobService.GetAllJobsAsync(search, jobType);
        return Ok(jobs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        
        if (job == null)
            return NotFound();

        return Ok(job);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobPostingDTO createJobDto)
    {
        var job = await _jobService.CreateJobAsync(createJobDto);
        return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobPostingDTO updateJobDto)
    {
        var job = await _jobService.UpdateJobAsync(id, updateJobDto);
        
        if (job == null)
            return NotFound();

        return Ok(job);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var result = await _jobService.DeleteJobAsync(id);
        
        if (!result)
            return NotFound();

        return NoContent();
    }
}