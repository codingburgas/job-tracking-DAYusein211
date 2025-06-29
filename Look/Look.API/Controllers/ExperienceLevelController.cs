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
    public class ExperienceLevelsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExperienceLevelsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExperienceLevel>>> GetExperienceLevels()
        {
            return Ok(await _context.ExperienceLevels.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExperienceLevel>> GetExperienceLevel(int id)
        {
            var level = await _context.ExperienceLevels.FindAsync(id);
            if (level == null)
                return NotFound();

            return Ok(level);
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ExperienceLevel>> CreateExperienceLevel(ExperienceLevel level)
        {
            _context.ExperienceLevels.Add(level);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExperienceLevel), new { id = level.Id }, level);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateExperienceLevel(int id, ExperienceLevel level)
        {
            if (id != level.Id)
                return BadRequest();

            _context.Entry(level).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExperienceLevelExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteExperienceLevel(int id)
        {
            var level = await _context.ExperienceLevels.FindAsync(id);
            if (level == null)
                return NotFound();

            _context.ExperienceLevels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExperienceLevelExists(int id) =>
            _context.ExperienceLevels.Any(e => e.Id == id);
    }
}
