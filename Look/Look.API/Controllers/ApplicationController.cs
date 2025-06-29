using Look.Data;
using Look.Data.Entities;
using Look.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ApplicationController : ControllerBase
{
    private readonly AppDbContext _context;

    public ApplicationController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/application/apply
    [HttpPost("apply")]
    [Authorize] // Any logged in user can apply
    public async Task<IActionResult> Apply([FromBody] ApplyDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        // Optional: Check if JobPosting exists and is active
        var jobExists = await _context.JobPostings.AnyAsync(j => j.Id == dto.JobPostingId && !j.Deleted);
        if (!jobExists)
            return NotFound(new { message = "Job posting not found." });

        var application = new Application
        {
            UserId = userId,
            JobPostingId = dto.JobPostingId,
            CoverLetter = dto.CoverLetter,
            Status = ApplicationStatus.PENDING,
            AppliedAt = System.DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Application submitted successfully" });
    }

    // GET: api/application/my
    [HttpGet("my")]
    [Authorize] // User can get their own applications
    public async Task<IActionResult> GetMyApplications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        var applications = await _context.Applications
            .Include(a => a.JobPosting)
            .Where(a => a.UserId == userId)
            .ToListAsync();

        return Ok(applications);
    }

    // GET: api/application
    [HttpGet]
    [Authorize(Roles = "ADMIN")] // Only admins can see all applications for their jobs
    public async Task<IActionResult> GetAllApplications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int adminUserId = int.Parse(userIdClaim.Value);

        // Get applications for job postings created by this admin
        var applications = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.JobPosting.CreatedBy == adminUserId)
            .ToListAsync();

        return Ok(applications);
    }
}
