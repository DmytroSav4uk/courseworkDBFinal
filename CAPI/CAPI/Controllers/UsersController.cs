using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public UsersController(SocialMediaContext context)
    {
        _context = context;
    }

    // GET: api/Users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // GET: api/Users/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return user;
    }

    // POST: api/Users
    
    
    public class UserDto
    {
      
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        
        public string? FullName { get; set; }
        
        public string? Bio { get; set; }

        [FromForm]
        public IFormFile? ProfileImage { get; set; }
    }

    
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<User>> PostUser([FromForm] UserDto userDto)
    {
        if (string.IsNullOrWhiteSpace(userDto.Password))
        {
            return BadRequest("Password is required.");
        }

        // Hash the password
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            var passwordBytes = System.Text.Encoding.UTF8.GetBytes(userDto.Password);
            var hashedBytes = sha256.ComputeHash(passwordBytes);
            userDto.Password = Convert.ToBase64String(hashedBytes);
        }

        // Map the DTO to your User entity
        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            PasswordHash = userDto.Password,
            CreatedAt = DateTime.UtcNow
        };

        // Handle profile image upload
        if (userDto.ProfileImage != null)
        {
            using (var memoryStream = new MemoryStream())
            {
                await userDto.ProfileImage.CopyToAsync(memoryStream);
                user.ProfileImagePath = memoryStream.ToArray();  // Directly store byte[] in ProfileImagePath
            }
        }



        // Save the user
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetUser", new { id = user.UserId }, user);
    }


    
    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers(
        [FromQuery] string username = null,
        [FromQuery] string email = null,
        [FromQuery] string fullName = null)
    {
        var query = _context.Users.AsQueryable();

        
        if (!string.IsNullOrWhiteSpace(username))
        {
            query = query.Where(u => u.Username.Contains(username));
        }

        
        if (!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(u => u.Email.Contains(email));
        }
        
        if (!string.IsNullOrWhiteSpace(fullName))
        {
            query = query.Where(u => u.FullName.Contains(fullName));
        }
        
        var users = await query.ToListAsync();

        if (users == null || !users.Any())
        {
            return NotFound("No users found matching the criteria.");
        }

        return Ok(users);
    }


    // PUT: api/Users/5
 [HttpPut("{id}")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> PutUser(int id, [FromForm] UserDto userDto)
{
    // Check if the ID in the URL matches the provided user object
    if (id <= 0)
    {
        return BadRequest("Invalid User ID.");
    }

    // Fetch the existing user from the database
    var user = await _context.Users.FindAsync(id);
    if (user == null)
    {
        return NotFound("User not found.");
    }

    // Update fields only if they are provided in the body
    if (!string.IsNullOrWhiteSpace(userDto.Username))
    {
        user.Username = userDto.Username;
    }

    if (!string.IsNullOrWhiteSpace(userDto.Email))
    {
        user.Email = userDto.Email;
    }

    // Update the password only if it's provided
    if (!string.IsNullOrWhiteSpace(userDto.Password))
    {
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            var passwordBytes = System.Text.Encoding.UTF8.GetBytes(userDto.Password);
            var hashedBytes = sha256.ComputeHash(passwordBytes);
            user.PasswordHash = Convert.ToBase64String(hashedBytes);
        }
    }

    // Update Bio only if it's provided
    if (!string.IsNullOrWhiteSpace(userDto.Bio))
    {
        user.Bio = userDto.Bio;
    }
    
    if (!string.IsNullOrWhiteSpace(userDto.FullName))
    {
        user.FullName = userDto.FullName;
    }

    // Handle profile image upload (if provided)
    if (userDto.ProfileImage != null)
    {
        using (var memoryStream = new MemoryStream())
        {
            await userDto.ProfileImage.CopyToAsync(memoryStream);
            user.ProfileImagePath = memoryStream.ToArray(); // Store the byte[] for the profile image
        }
    }

    // Mark the entity as modified and save the changes to the database
    try
    {
        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!UserExists(id))
        {
            return NotFound("User not found.");
        }
        else
        {
            throw;
        }
    }

    return NoContent();  // No content means the update was successful
}




    // DELETE: api/Users/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        try
        {
            // Delete related friendships
            var friendshipsToDelete = _context.Friendships
                .Where(f => f.UserId1 == id || f.UserId2 == id);
            _context.Friendships.RemoveRange(friendshipsToDelete);

            // Delete related messages where the user is either the sender or the receiver
            var messagesToDelete = _context.Messages
                .Where(m => m.ReceiverId == id || m.SenderId == id);
            _context.Messages.RemoveRange(messagesToDelete);

            // Remove the user
            _context.Users.Remove(user);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
        }
        catch (DbUpdateException ex)
        {
            // Log the error message and inner exception if available
            var innerExceptionMessage = ex.InnerException?.Message ?? "No inner exception available.";
            Console.WriteLine($"Error deleting user: {ex.Message} - Inner Exception: {innerExceptionMessage}");

            // Return a BadRequest response with detailed error message
            return BadRequest(new { message = $"Error deleting user: {ex.Message}", innerException = innerExceptionMessage });
        }
        catch (Exception ex)
        {
            // Catch any other exceptions that might occur
            Console.WriteLine($"Unexpected error: {ex.Message}");
            return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
        }
    }




    private bool UserExists(int id)
    {
        return _context.Users.Any(e => e.UserId == id);
    }
}

