using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public CommentsController(SocialMediaContext context)
    {
        _context = context;
    }
    // GET: api/Comments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
    {
        return await _context.Comments.ToListAsync();
    }
    // GET: api/Comments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Comment>> GetComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);

        if (comment == null)
        {
            return NotFound();
        }

        return comment;
    }
    [HttpPost]
    public async Task<ActionResult<Comment>> PostComment(Comment comment)
    {
        var postExists = await _context.Posts.AnyAsync(p => p.PostId == comment.PostId);
        if (!postExists)
        {
            return BadRequest($"Post with ID {comment.PostId} does not exist.");
        }

        // Validate that the UserId exists
        var userExists = await _context.Users.AnyAsync(u => u.UserId == comment.UserId);
        if (!userExists)
        {
            return BadRequest($"User with ID {comment.UserId} does not exist.");
        }
        comment.CreatedAt = DateTime.UtcNow;
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetComment), new { id = comment.CommentId }, comment);
    }

    [HttpGet("ByPost/{postId}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByPostId(int postId)
    {
        var comments = await _context.Comments
            .Where(c => c.PostId == postId)
            .ToListAsync();

        if (comments == null || comments.Count == 0)
        {
            return NotFound($"No comments found for PostID {postId}.");
        }

        return comments;
    }
    
    public class CommentDto
    {
        public string Content { get; set; }
    }


    // PUT: api/Comments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutComment(int id, [FromBody] CommentDto commentDto)
    {
        // Перевіряємо, чи існує коментар з таким ID
        var existingComment = await _context.Comments.FindAsync(id);
        if (existingComment == null)
        {
            return NotFound($"Comment with ID {id} not found.");
        }

        // Оновлюємо лише поле Content
        if (!string.IsNullOrWhiteSpace(commentDto.Content))
        {
            existingComment.Content = commentDto.Content;
            existingComment.EditedAt = DateTime.UtcNow; // Встановлюємо час редагування
        }
        else
        {
            return BadRequest("Content cannot be empty.");
        }
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }

        return NoContent();
    }
    // DELETE: api/Comments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    private bool CommentExists(int id)
    {
        return _context.Comments.Any(e => e.CommentId == id);
    }
}
