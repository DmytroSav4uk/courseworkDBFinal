
using Microsoft.EntityFrameworkCore;

namespace CAPI.Models;

[Keyless]
public partial class MonthlyStatistic
{
    public int Month { get; set; }
    public int Count { get; set; } // UserCount, PostCount, or LikeCount
}