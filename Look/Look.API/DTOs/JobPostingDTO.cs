namespace Look.API.DTOs
{
    public class JobPostingDto
    {
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public string Description { get; set; }
        public int JobTypeId { get; set; }
        public int CategoryId { get; set; }
        public int ExperienceLevelId { get; set; }
        public decimal? Salary { get; set; }
        public decimal? HourlyRate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class JobPostingUpdateDto : JobPostingDto
    {
    }
}
