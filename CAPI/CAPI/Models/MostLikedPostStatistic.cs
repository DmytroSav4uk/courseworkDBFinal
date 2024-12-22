using Microsoft.EntityFrameworkCore;

namespace CAPI.Models;

[Keyless]
public partial class MostLikedPostStatistic
{
    public int Month { get; set; }
    public int PostId { get; set; }
    public int LikeCount { get; set; }
}