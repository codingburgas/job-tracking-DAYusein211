using Look.Data.Entities;

public class JobPostingSkill
{
    public int JobPostingId { get; set; }
    public JobPosting JobPosting { get; set; }

    public int SkillId { get; set; }
    public Skill Skill { get; set; }
}