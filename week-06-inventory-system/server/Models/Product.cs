namespace InventorySystem.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int StockLevel { get; set; }
    public int MinStockLevel { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
