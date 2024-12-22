using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public PostsController(SocialMediaContext context)
    {
        _context = context;
    }

    // GET: api/Posts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
        return await _context.Posts.ToListAsync();
    }

    // GET: api/Posts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Post>> GetPost(int id)
    {
        var post = await _context.Posts.FindAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        return post;
    }

   
    [HttpGet("{postId}/image")]
    public async Task<IActionResult> GetPostImage(int postId)
    {
        var post = await _context.Posts
            .Where(p => p.PostId == postId)
            .FirstOrDefaultAsync();

        if (post == null || post.Image == null)
        {
            return NotFound();
        }

        // Convert the byte array to Base64 string
        var base64Image = Convert.ToBase64String(post.Image);
        return Ok(base64Image);
    }


   

    public class PostDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string? Content { get; set; } = null!;
        public IFormFile? Image { get; set; }
    }

    // POST: api/Posts
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<Post>> PostPost([FromForm] PostDto postDto)
    {
        // Map the DTO to your entity
        var post = new Post
        {
            UserId = postDto.UserId,
            Content = postDto.Content,
            CreatedAt = DateTime.UtcNow
        };

        // Handle image upload
        if (postDto.Image != null)
        {
            using (var memoryStream = new MemoryStream())
            {
                await postDto.Image.CopyToAsync(memoryStream);
                post.Image = memoryStream.ToArray();
            }
        }

        // Save the post
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetPost", new { id = post.PostId }, post);
    }


    
   

    
    // PUT: api/Posts/5
    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> PutPost(int id, [FromForm] PostDto postDto)
    {
        if (id != postDto.PostId)
        {
            return BadRequest("Post ID in the URL does not match Post ID in the request body.");
        }

        var post = await _context.Posts.FindAsync(id);
        if (post == null)
        {
            return NotFound($"Post with ID {id} not found.");
        }

        bool isUpdated = false;

        // Update content only if provided
        if (!string.IsNullOrEmpty(postDto.Content))
        {
            post.Content = postDto.Content;
            isUpdated = true;
        }

        // Handle image update
        if (postDto.Image != null)
        {
            using (var memoryStream = new MemoryStream())
            {
                await postDto.Image.CopyToAsync(memoryStream);
                post.Image = memoryStream.ToArray();
            }
            isUpdated = true;
        }

        // Update EditedAt if any changes were made
        if (isUpdated)
        {
            post.EditedAt = DateTime.UtcNow;
        }

        // Save changes
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }





    // DELETE: api/Posts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        // Find the post and include related likes and comments
        var post = await _context.Posts
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.PostId == id);

        if (post == null)
        {
            return NotFound();
        }

        // Remove related likes and comments
        _context.Likes.RemoveRange(post.Likes);
        _context.Comments.RemoveRange(post.Comments);

        // Remove the post
        _context.Posts.Remove(post);

        // Save changes
        await _context.SaveChangesAsync();

        return NoContent();
    }


    private bool PostExists(int id)
    {
        return _context.Posts.Any(e => e.PostId == id);
    }
}
