using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CAPI.Models
{
    public partial class Like
    {
        [Key]
        public int LikeId { get; set; }

        public int UserId { get; set; }

        public int PostId { get; set; }

        public DateTime? LikedAt { get; set; }

        
        public virtual Post? Post { get; set; } = null!;

        public virtual User? User { get; set; } = null!;
    }
}