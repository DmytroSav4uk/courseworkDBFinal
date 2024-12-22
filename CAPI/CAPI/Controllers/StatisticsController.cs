using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public StatisticsController(SocialMediaContext context)
    {
        _context = context;
    }

    // 1. Get Monthly User Registrations
    [HttpGet("UserRegistrations/{year}")]
    public async Task<ActionResult<IEnumerable<MonthlyStatistic>>> GetMonthlyUserRegistrations(int year)
    {
        var result = await _context.MonthlyStatistic
            .FromSqlRaw("EXEC GetMonthlyUserRegistrations @SelectedYear = {0}", year)
            .ToListAsync();
        return Ok(result);
    }

    // 2. Get Monthly Post Counts
    [HttpGet("PostCounts/{year}")]
    public async Task<ActionResult<IEnumerable<MonthlyStatistic>>> GetMonthlyPostCounts(int year)
    {
        var result = await _context.MonthlyStatistic
            .FromSqlRaw("EXEC GetMonthlyPostCounts @SelectedYear = {0}", year)
            .ToListAsync();

        return Ok(result);
    }

    // 3. Get Monthly Like Counts
    [HttpGet("LikeCounts/{year}")]
    public async Task<ActionResult<IEnumerable<MonthlyStatistic>>> GetMonthlyLikeCounts(int year)
    {
        var result = await _context.MonthlyStatistic
            .FromSqlRaw("EXEC GetMonthlyLikeCounts @SelectedYear = {0}", year)
            .ToListAsync();

        return Ok(result);
    }

    // 4. Get Most Liked Post Per Month
    [HttpGet("MostLikedPost/{year}")]
    public async Task<ActionResult<IEnumerable<MostLikedPostStatistic>>> GetMostLikedPostPerMonth(int year)
    {
        var result = await _context.MostLikedPostStatistic
            .FromSqlRaw("EXEC GetMostLikedPostPerMonth @SelectedYear = {0}", year)
            .ToListAsync();

        return Ok(result);
    }
}