using Look.Data;
using Look.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Look.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobTypesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobTypesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobType>>> GetJobTypes()
        {
            return Ok(await _context.JobTypes.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobType>> GetJobType(int id)
        {
            var jobType = await _context.JobTypes.FindAsync(id);
            if (jobType == null)
                return NotFound();

            return Ok(jobType);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<JobType>> CreateJobType(JobType jobType)
        {
            _context.JobTypes.Add(jobType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobType), new { id = jobType.Id }, jobType);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateJobType(int id, JobType jobType)
        {
            if (id != jobType.Id)
                return BadRequest();

            _context.Entry(jobType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobTypeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteJobType(int id)
        {
            var jobType = await _context.JobTypes.FindAsync(id);
            if (jobType == null)
                return NotFound();

            _context.JobTypes.Remove(jobType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool JobTypeExists(int id) =>
            _context.JobTypes.Any(j => j.Id == id);
    }
}
