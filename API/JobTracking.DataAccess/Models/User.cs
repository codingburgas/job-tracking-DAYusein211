namespace JobTracking.DataAccess.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
public class User
{
    [Key]
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; }
    [MaxLength(20)]
    public string CreatedBy { get; set; }
    public DateTime? UpdatedOn { get; set; }
    public string? UpdatedBy { get; set; }
    public virtual ICollection<Denis> denis { get; set; } = new List<Denis>();
}