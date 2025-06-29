using Look.Data;
using Look.Data.Entities;
using Look.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Look.API.DTOs;

namespace Look.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobPostingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobPostingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/jobpostings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobPosting>>> GetJobPostings(
            [FromQuery] int? minHourlyRate = null,
            [FromQuery] int? maxHourlyRate = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] int? jobTypeId = null,
            [FromQuery] int? experienceLevelId = null)
        {
            var query = _context.JobPostings
                .Include(j => j.Category)
                .Include(j => j.JobType)
                .Include(j => j.ExperienceLevel)
                .Where(j => !j.Deleted)  // Exclude soft-deleted
                .AsQueryable();

            if (minHourlyRate.HasValue)
                query = query.Where(j => j.HourlyRate >= minHourlyRate.Value);

            if (maxHourlyRate.HasValue)
                query = query.Where(j => j.HourlyRate <= maxHourlyRate.Value);

            if (categoryId.HasValue)
                query = query.Where(j => j.CategoryId == categoryId.Value);

            if (jobTypeId.HasValue)
                query = query.Where(j => j.JobTypeId == jobTypeId.Value);

            if (experienceLevelId.HasValue)
                query = query.Where(j => j.ExperienceLevelId == experienceLevelId.Value);

            var jobs = await query.ToListAsync();

            return Ok(jobs);
        }

        // GET: api/jobpostings/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<JobPosting>> GetJobPosting(int id)
        {
            var job = await _context.JobPostings
                .Include(j => j.Category)
                .Include(j => j.JobType)
                .Include(j => j.ExperienceLevel)
                .FirstOrDefaultAsync(j => j.Id == id && !j.Deleted);

            if (job == null)
                return NotFound();

            return Ok(job);
        }

        // POST: api/jobpostings
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<JobPosting>> CreateJobPosting([FromBody] JobPostingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var jobPosting = new JobPosting
            {
                Title = dto.Title,
                CompanyName = dto.CompanyName,
                Description = dto.Description,
                JobTypeId = dto.JobTypeId,
                CategoryId = dto.CategoryId,
                ExperienceLevelId = dto.ExperienceLevelId,
                Salary = dto.Salary,
                HourlyRate = dto.HourlyRate,
                CreatedBy = dto.CreatedBy
            };

            _context.JobPostings.Add(jobPosting);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobPosting), new { id = jobPosting.Id }, jobPosting);
        }

        // PUT: api/jobpostings/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateJobPosting(int id, [FromBody] JobPostingUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var jobPosting = await _context.JobPostings.FindAsync(id);
            if (jobPosting == null || jobPosting.Deleted)
                return NotFound();

            jobPosting.Title = dto.Title;
            jobPosting.CompanyName = dto.CompanyName;
            jobPosting.Description = dto.Description;
            jobPosting.JobTypeId = dto.JobTypeId;
            jobPosting.CategoryId = dto.CategoryId;
            jobPosting.ExperienceLevelId = dto.ExperienceLevelId;
            jobPosting.Salary = dto.Salary;
            jobPosting.HourlyRate = dto.HourlyRate;

            _context.Entry(jobPosting).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.JobPostings.Any(j => j.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/jobpostings/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteJobPosting(int id)
        {
            var jobPosting = await _context.JobPostings.FindAsync(id);
            if (jobPosting == null || jobPosting.Deleted)
                return NotFound();

            jobPosting.Deleted = true;
            _context.Entry(jobPosting).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
