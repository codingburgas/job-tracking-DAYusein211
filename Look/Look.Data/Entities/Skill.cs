// Skill.cs
using System.Collections.Generic;

namespace Look.Data.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserSkill> UserSkills { get; set; }
    }
}