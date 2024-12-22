using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CAPI.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly SocialMediaContext _context;

    public MessagesController(SocialMediaContext context)
    {
        _context = context;
    }

    // GET: api/Messages/Conversation?userId1=1&userId2=2
    [HttpGet("Conversation")]
    public async Task<ActionResult<IEnumerable<Message>>> GetConversation(int userId1, int userId2)
    {
        var conversation = await _context.Messages
            .Where(m =>
                (m.SenderId == userId1 && m.ReceiverId == userId2) ||
                (m.SenderId == userId2 && m.ReceiverId == userId1))
            .OrderBy(m => m.SentAt) 
            .ToListAsync();

        if (conversation == null || !conversation.Any())
        {
            return NotFound($"No conversation found between users {userId1} and {userId2}.");
        }

        return conversation;
    }

    // POST: api/Messages
    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage([FromBody] Message message)
    {
        // Check if both users exist
        var senderExists = await _context.Users.AnyAsync(u => u.UserId == message.SenderId);
        var receiverExists = await _context.Users.AnyAsync(u => u.UserId == message.ReceiverId);

        if (!senderExists)
        {
            return NotFound($"Sender with ID {message.SenderId} not found.");
        }

        if (!receiverExists)
        {
            return NotFound($"Receiver with ID {message.ReceiverId} not found.");
        }

        // Add the message to the database
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetConversation", new { userId1 = message.SenderId, userId2 = message.ReceiverId }, message);
    }

    
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var message = await _context.Messages.FindAsync(id);

        if (message == null)
        {
            return NotFound($"Message with ID {id} not found.");
        }

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    
}
