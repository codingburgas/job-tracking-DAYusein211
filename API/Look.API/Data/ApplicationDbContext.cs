using Microsoft.EntityFrameworkCore;
using Look.API.Models;

namespace Look.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>(user =>
        {
            user.HasIndex(u => u.Username).IsUnique();
            user.Property(u => u.Role).HasConversion<int>();
        });

        builder.Entity<JobPosting>(job =>
        {
            job.Property(j => j.Status).HasConversion<int>();
        });

        builder.Entity<Application>(app =>
        {
            app.Property(a => a.Status).HasConversion<int>();

            app.HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            app.HasOne(a => a.JobPosting)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);

            app.HasIndex(a => new { a.UserId, a.JobPostingId }).IsUnique();
        });
    }
}