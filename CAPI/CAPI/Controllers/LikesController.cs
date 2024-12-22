using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using Microsoft.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class LikesController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public LikesController(SocialMediaContext context)
    {
        _context = context;
    }

    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Like>>> GetAllLikes()
    {
        try
        {
            // Отримати всі лайки з бази даних
            var allLikes = await _context.Likes
                .ToListAsync();

            // Перевірка: якщо лайків немає, повернути NotFound
            if (!allLikes.Any())
            {
                return NotFound("No likes found.");
            }

            // Повернути список лайків
            return Ok(allLikes);
        }
        catch (Exception ex)
        {
            // У разі помилки повернути статус 500
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    
    // GET: api/Likes/filter?userId={userId}&postId={postId}
    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<Like>>> GetFilteredLikes([FromQuery] int? userId, [FromQuery] int? postId)
    {
        try
        {
          
            var query = _context.Likes.AsQueryable();

      
            if (userId.HasValue)
            {
                query = query.Where(like => like.UserId == userId.Value);
            }

          
            if (postId.HasValue)
            {
                query = query.Where(like => like.PostId == postId.Value);
            }

          
            var filteredLikes = await query.ToListAsync();

           
            if (!filteredLikes.Any())
            {
                return NotFound("No likes found for the specified filters.");
            }

          
            return Ok(filteredLikes);
        }
        catch (Exception ex)
        {
          
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    
  
    [HttpGet("User/{userId}")]
    public async Task<ActionResult<IEnumerable<Post>>> GetLikedPostsByUser(int userId)
    {
        var likedPosts = await _context.Likes
            .Where(like => like.UserId == userId)
            .Include(like => like.Post) // Ensures related post data is loaded
            .Select(like => like.Post)
            .ToListAsync();

        if (!likedPosts.Any())
        {
            return NotFound($"No liked posts found for UserID {userId}.");
        }

        return likedPosts;
    }

   
    [HttpPost]
    public async Task<IActionResult> AddLikeToPost([FromBody] Like like)
    {
        try
        {
            // Extract the values from the Like object
            int userId = like.UserId;
            int postId = like.PostId;
        
            // Build the raw SQL query
            var sql = "INSERT INTO Likes (UserId, PostId, LikedAt) VALUES (@userId, @postId, @likedAt)";

            // Execute the SQL query
            await _context.Database.ExecuteSqlRawAsync(sql, 
                new SqlParameter("userId", userId),
                new SqlParameter("postId", postId),
                new SqlParameter("likedAt", DateTime.Now));

            return Ok("Like added successfully.");
        }
        catch (Exception ex)
        {
            // Return an error if something goes wrong
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    
    [HttpPost("remove")]
    public async Task<IActionResult> RemoveLikeFromPost([FromBody] Like like)
    {
        try
        {
            // Extract the values from the Like object
            int userId = like.UserId;
            int postId = like.PostId;
            
            // Build the raw SQL query to remove the like
            var sql = "DELETE FROM Likes WHERE UserId = @userId AND PostId = @postId";

            // Execute the SQL query
            var rowsAffected = await _context.Database.ExecuteSqlRawAsync(sql,
                new SqlParameter("userId", userId),
                new SqlParameter("postId", postId));

            // Check if the like was removed (rows affected > 0 means a like was removed)
            if (rowsAffected > 0)
            {
                return Ok("Like removed successfully.");
            }
            else
            {
                return BadRequest("No like found for the specified user and post.");
            }
        }
        catch (Exception ex)
        {
            // Return an error if something goes wrong
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}