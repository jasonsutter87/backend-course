namespace InventorySystem.Models;

public class Transaction
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
    public string Type { get; set; } = string.Empty; // "In" or "Out"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
