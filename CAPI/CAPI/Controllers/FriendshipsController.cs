using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class FriendshipsController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public FriendshipsController(SocialMediaContext context)
    {
        _context = context;
    }

    // GET: api/Friendships
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Friendship>>> GetFriendships()
    {
        return await _context.Friendships.ToListAsync();
    }

    // GET: api/Friendships/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Friendship>> GetFriendship(int id)
    {
        var friendship = await _context.Friendships.FindAsync(id);

        if (friendship == null)
        {
            return NotFound();
        }

        return friendship;
    }

    
    // GET: api/Friendships/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<int>>> GetUserFriendships(int userId)
    {
        // Знайти всі дружби, де поточний користувач є або userId1, або userId2
        var friendships = await _context.Friendships
            .Where(f => f.UserId1 == userId || f.UserId2 == userId)
            .ToListAsync();

        if (friendships == null || !friendships.Any())
        {
            return NotFound();
        }

        // Отримати всі ID друзів, виключаючи поточного користувача
        var friendIds = friendships
            .SelectMany(f => new[] { f.UserId1, f.UserId2 }) // Збираємо всі ID з полів userId1 і userId2
            .Where(id => id != userId) // Фільтруємо, щоб не додавати поточного користувача
            .Distinct() // Забезпечуємо унікальність ID друзів
            .ToList();

        return friendIds;
    }
    
    
    public class FriendshipRequest
    {
        public int UserId1 { get; set; }
        public int UserId2 { get; set; }
    }

    // POST: api/Friendships
    [HttpPost]
    public async Task<ActionResult<Friendship>> CreateFriendship([FromBody] FriendshipRequest request)
    {
        if (request.UserId1 == request.UserId2)
        {
            return BadRequest("A user cannot be friends with themselves.");
        }

        // Check if both users exist
        var user1 = await _context.Users.FindAsync(request.UserId1);
        var user2 = await _context.Users.FindAsync(request.UserId2);

        if (user1 == null || user2 == null)
        {
            return NotFound("One or both users not found.");
        }

        // Check if the friendship already exists
        var existingFriendship = await _context.Friendships
            .FirstOrDefaultAsync(f => 
                (f.UserId1 == request.UserId1 && f.UserId2 == request.UserId2) ||
                (f.UserId1 == request.UserId2 && f.UserId2 == request.UserId1));

        if (existingFriendship != null)
        {
            return Conflict("Friendship already exists.");
        }

        // Create a new friendship
        var friendship = new Friendship
        {
            UserId1 = request.UserId1,
            UserId2 = request.UserId2
        };

        _context.Friendships.Add(friendship);
        await _context.SaveChangesAsync();

        return Ok();
    }


    // DELETE: api/Friendships/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFriendship(int id)
    {
        var friendship = await _context.Friendships.FindAsync(id);
        if (friendship == null)
        {
            return NotFound();
        }

        _context.Friendships.Remove(friendship);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
