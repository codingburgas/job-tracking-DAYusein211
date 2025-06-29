using Look.Data;
using Look.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users/{id} - Get user profile by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
            .Where(u => !u.Deleted)
            .Select(u => new 
            {
                u.Id,
                u.FirstName,
                u.MiddleName,
                u.LastName,
                u.Email,
                u.Role,
                u.Description,
                u.HourlyRate,
                u.CreatedAt,
                Skills = u.UserSkills.Select(us => new { us.Skill.Id, us.Skill.Name })
            })
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // GET: api/users/me - Get current logged-in user's profile
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);


        var user = await _context.Users
            .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
            .Where(u => !u.Deleted)
            .Select(u => new 
            {
                u.Id,
                u.FirstName,
                u.MiddleName,
                u.LastName,
                u.Email,
                u.Role,
                u.Description,
                u.HourlyRate,
                u.CreatedAt,
                Skills = u.UserSkills.Select(us => new { us.Skill.Id, us.Skill.Name })
            })
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // GET: api/users - Get all users (admin only)
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Include(u => u.UserSkills)
                .ThenInclude(us => us.Skill)
            .Where(u => !u.Deleted)
            .Select(u => new 
            {
                u.Id,
                u.FirstName,
                u.MiddleName,
                u.LastName,
                u.Email,
                u.Role,
                u.Description,
                u.HourlyRate,
                u.CreatedAt,
                Skills = u.UserSkills.Select(us => new { us.Skill.Id, us.Skill.Name })
            })
            .ToListAsync();

        return Ok(users);
    }
}
