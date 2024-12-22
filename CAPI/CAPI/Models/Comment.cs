using System;
using System.Collections.Generic;

namespace CAPI.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int UserId { get; set; }

    public int PostId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? EditedAt { get; set; }

    public virtual Post? Post { get; set; } = null!;

    public virtual User? User { get; set; } = null!;
}
