using Look.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Look.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<JobPostingSkill> JobPostingSkills { get; set; }  // Add this

        public DbSet<ExperienceLevel> ExperienceLevels { get; set; }
        public DbSet<JobType> JobTypes { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Composite keys for many-to-many join tables
            modelBuilder.Entity<UserSkill>()
                .HasKey(us => new { us.UserId, us.SkillId });

            modelBuilder.Entity<JobPostingSkill>()  // Add composite key for JobPostingSkill
                .HasKey(jps => new { jps.JobPostingId, jps.SkillId });

            modelBuilder.Entity<Review>()
                .HasIndex(r => new { r.ReviewerId, r.TargetId })
                .IsUnique();

            modelBuilder.Entity<Application>()
                .HasIndex(a => new { a.UserId, a.JobPostingId })
                .IsUnique();

            // Disable cascade delete for User references in Application
            modelBuilder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Application>()
                .HasOne(a => a.JobPosting)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Reviewer)
                .WithMany(u => u.ReviewsWritten)
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Target)
                .WithMany(u => u.ReviewsReceived)
                .HasForeignKey(r => r.TargetId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}
